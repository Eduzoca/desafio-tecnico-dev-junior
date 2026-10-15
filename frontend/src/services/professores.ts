import type { BuscaRequest, Resultado } from "../types";
import { tempoLimiteBusca } from "../config";

export class ErroBusca extends Error {
  constructor(
    public readonly tipo:
      "validacao" | "servidor" | "resposta" | "rede" | "timeout",
    public readonly mensagens: string[],
  ) {
    super(mensagens.join(" "));
  }
}
const objeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === "object" && valor !== null;
const inteiro = (valor: unknown): valor is number =>
  Number.isSafeInteger(valor) && Number(valor) >= 0;
const horario = (valor: unknown) =>
  typeof valor === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(valor);
export function resultadoValido(valor: unknown): valor is Resultado {
  if (
    !objeto(valor) ||
    !Array.isArray(valor.professores) ||
    !Array.isArray(valor.naoElegiveis)
  )
    return false;
  const identidade = (p: unknown): p is Record<string, unknown> =>
    objeto(p) &&
    inteiro(p.id) &&
    typeof p.nome === "string" &&
    p.nome.trim().length > 0;
  return (
    valor.professores.every(
      (p) =>
        identidade(p) &&
        inteiro(p.aulasNaSemana) &&
        Array.isArray(p.horarios) &&
        p.horarios.every(horario),
    ) &&
    valor.naoElegiveis.every(
      (p) => identidade(p) && typeof p.motivo === "string",
    )
  );
}
export async function buscarProfessores(
  consulta: BuscaRequest,
  signal: AbortSignal,
): Promise<Resultado> {
  signal.throwIfAborted();
  const controller = new AbortController();
  let expirou = false;
  const timer = setTimeout(() => {
    expirou = true;
    controller.abort();
  }, tempoLimiteBusca);
  const cancelar = () => {
    clearTimeout(timer);
    controller.abort();
  };
  signal.addEventListener("abort", cancelar, { once: true });
  try {
    const response = await fetch("/api/professores/busca", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consulta),
      signal: controller.signal,
    });
    signal.throwIfAborted();
    if (expirou) throw new Error("Timeout");
    if (response.status === 400) {
      const dados: unknown = await response.json().catch(() => null);
      const mensagens =
        objeto(dados) &&
        Array.isArray(dados.erros) &&
        dados.erros.length &&
        dados.erros.every((e: unknown) => typeof e === "string")
          ? (dados.erros as string[])
          : ["Confira os dados da busca."];
      throw new ErroBusca("validacao", mensagens);
    }
    if (!response.ok)
      throw new ErroBusca("servidor", [
        "Não foi possível concluir a busca. Tente novamente.",
      ]);
    const dados: unknown = await response.json().catch(() => null);
    signal.throwIfAborted();
    if (expirou) throw new Error("Timeout");
    if (!resultadoValido(dados))
      throw new ErroBusca("resposta", [
        "A API retornou uma resposta inválida. Tente novamente.",
      ]);
    return dados;
  } catch (erro) {
    signal.throwIfAborted();
    if (expirou)
      throw new ErroBusca("timeout", [
        "A busca demorou mais que o esperado. Tente novamente.",
      ]);
    if (erro instanceof ErroBusca) throw erro;
    throw new ErroBusca("rede", [
      "Não foi possível comunicar com a API. Tente novamente em instantes.",
    ]);
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", cancelar);
  }
}
export function mensagensDaBusca(erro: unknown): string[] {
  return erro instanceof ErroBusca
    ? erro.mensagens
    : ["Não foi possível concluir a busca. Tente novamente."];
}

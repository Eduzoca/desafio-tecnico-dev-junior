import { useEffect, useRef, useState } from "react";
import type { BuscaRequest, Resultado } from "../types";

export function useBusca() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [consulta, setConsulta] = useState<BuscaRequest | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const ativa = useRef<AbortController | null>(null);
  useEffect(() => () => ativa.current?.abort(), []);

  async function buscar(request: BuscaRequest) {
    ativa.current?.abort();
    const controle = new AbortController();
    ativa.current = controle;
    let expirou = false;
    const timer = setTimeout(() => {
      expirou = true;
      controle.abort();
    }, 15000);
    setCarregando(true);
    setErros([]);
    setResultado(null);
    setConsulta({ ...request, dias: [...request.dias] });
    try {
      const resposta = await fetch("/api/professores/busca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controle.signal,
      });
      if (resposta.status === 400) {
        const erro = await resposta.json().catch(() => null);
        if (ativa.current === controle && !controle.signal.aborted)
          setErros(
            Array.isArray(erro?.erros) &&
              erro.erros.every((e: unknown) => typeof e === "string")
              ? erro.erros
              : ["Confira os dados da busca."],
          );
      } else if (!resposta.ok) {
        if (ativa.current === controle && !controle.signal.aborted)
          setErros(["Não foi possível concluir a busca. Tente novamente."]);
      } else {
        const dados: Resultado = await resposta.json();
        if (ativa.current === controle && !controle.signal.aborted)
          setResultado(dados);
      }
    } catch {
      if (ativa.current === controle && (!controle.signal.aborted || expirou))
        setErros([
          expirou
            ? "A busca demorou mais que o esperado. Tente novamente."
            : "Não foi possível comunicar com a API. Tente novamente em instantes.",
        ]);
    } finally {
      clearTimeout(timer);
      if (ativa.current === controle) setCarregando(false);
    }
  }
  return { resultado, consulta, erros, carregando, buscar };
}

import { useState } from "react";
import type { BuscaRequest, Resultado } from "../types";
export function useBusca() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  async function buscar(request: BuscaRequest) {
    setCarregando(true);
    setErros([]);
    setResultado(null);
    try {
      const resposta = await fetch("/api/professores/busca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      if (resposta.status === 400) {
        const erro = await resposta.json();
        setErros(erro.erros ?? [erro.mensagem ?? "Confira os dados da busca."]);
      } else if (!resposta.ok)
        setErros(["Não foi possível concluir a busca. Tente novamente."]);
      else setResultado(await resposta.json());
    } catch {
      setErros([
        "Não foi possível comunicar com a API. Verifique se ela está em execução e tente novamente.",
      ]);
    } finally {
      setCarregando(false);
    }
  }
  return { resultado, erros, carregando, buscar };
}

import { useEffect, useRef, useState } from "react";
import type { BuscaRequest, Resultado } from "../types";
import { buscarProfessores, mensagensDaBusca } from "../services/professores";
export function useBusca() {
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [consulta, setConsulta] = useState<BuscaRequest | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const ativa = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      ativa.current?.abort();
      ativa.current = null;
    },
    [],
  );
  async function buscar(request: BuscaRequest) {
    ativa.current?.abort();
    const controle = new AbortController();
    ativa.current = controle;
    const snapshot = { ...request, dias: [...request.dias] };
    setCarregando(true);
    setErros([]);
    setResultado(null);
    setConsulta(snapshot);
    try {
      const dados = await buscarProfessores(snapshot, controle.signal);
      if (ativa.current === controle) setResultado(dados);
    } catch (erro) {
      if (ativa.current === controle && !controle.signal.aborted)
        setErros(mensagensDaBusca(erro));
    } finally {
      if (ativa.current === controle) setCarregando(false);
    }
  }
  return { resultado, consulta, erros, carregando, buscar };
}

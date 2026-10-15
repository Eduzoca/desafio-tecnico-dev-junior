import { useEffect, useRef, useState } from "react";
import { diasSemana } from "../config";
import type { BuscaRequest } from "../types";
import { agruparSemana, type ProfessorSemana } from "../domain/agenda";
import { buscarProfessores, mensagensDaBusca } from "../services/professores";
export function useDisponibilidadeSemana(consulta: BuscaRequest) {
  const [estado, setEstado] = useState<{
    chave: string;
    professores: ProfessorSemana[] | null;
    carregando: boolean;
    erro: string;
  } | null>(null);
  const ativa = useRef<AbortController | null>(null);
  const chave = JSON.stringify(consulta);
  useEffect(
    () => () => {
      ativa.current?.abort();
      ativa.current = null;
    },
    [chave],
  );
  async function consultar() {
    ativa.current?.abort();
    const controle = new AbortController();
    ativa.current = controle;
    setEstado({ chave, professores: null, carregando: true, erro: "" });
    try {
      const respostas = await Promise.all(
        diasSemana.map(async ([dia]) => ({
          dia,
          resultado: await buscarProfessores(
            { ...consulta, dias: [dia] },
            controle.signal,
          ),
        })),
      );
      if (ativa.current === controle && !controle.signal.aborted)
        setEstado({
          chave,
          professores: agruparSemana(respostas),
          carregando: false,
          erro: "",
        });
    } catch (erro) {
      if (ativa.current === controle && !controle.signal.aborted)
        setEstado({
          chave,
          professores: null,
          carregando: false,
          erro: mensagensDaBusca(erro).join(" "),
        });
      controle.abort();
    }
  }
  const atual = estado?.chave === chave ? estado : null;
  return {
    professores: atual?.professores ?? null,
    carregando: atual?.carregando ?? false,
    erro: atual?.erro ?? "",
    consultar,
  };
}

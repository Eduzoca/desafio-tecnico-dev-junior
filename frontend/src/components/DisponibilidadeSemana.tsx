import { useEffect, useRef, useState } from "react";
import type { BuscaRequest, Resultado } from "../types";
import { diasSemana } from "./ResumoBusca";
type ProfessorSemana = {
  id: number;
  nome: string;
  dias: Record<string, string[]>;
  motivo: string;
};
export function DisponibilidadeSemana({
  consulta,
}: {
  consulta: BuscaRequest;
}) {
  const [professores, setProfessores] = useState<ProfessorSemana[] | null>(
    null,
  );
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const controle = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      controle.current?.abort();
      controle.current = null;
    },
    [],
  );
  async function consultar() {
    controle.current?.abort();
    const abort = new AbortController();
    controle.current = abort;
    setCarregando(true);
    setErro("");
    const timer = setTimeout(() => abort.abort(), 15000);
    try {
      const respostas = await Promise.all(
        diasSemana.map(async ([dia]) => {
          const response = await fetch("/api/professores/busca", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...consulta, dias: [dia] }),
            signal: abort.signal,
          });
          if (!response.ok) throw new Error("Falha ao consultar a semana");
          return { dia, resultado: (await response.json()) as Resultado };
        }),
      );
      if (abort.signal.aborted) return;
      const mapa = new Map<number, ProfessorSemana>();
      for (const { dia, resultado } of respostas) {
        for (const p of [...resultado.professores, ...resultado.naoElegiveis]) {
          const professor = mapa.get(p.id) ?? {
            id: p.id,
            nome: p.nome,
            dias: {},
            motivo: "",
          };
          if ("horarios" in p) professor.dias[dia] = p.horarios;
          else professor.motivo = p.motivo;
          mapa.set(p.id, professor);
        }
      }
      setProfessores(
        [...mapa.values()].sort((a, b) =>
          a.nome.localeCompare(b.nome, "pt-BR"),
        ),
      );
    } catch {
      if (controle.current === abort)
        setErro(
          "Não foi possível consultar a semana completa. Tente novamente.",
        );
      abort.abort();
    } finally {
      clearTimeout(timer);
      if (controle.current === abort) setCarregando(false);
    }
  }
  return (
    <section
      className="disponibilidade-semana"
      aria-label="Disponibilidade por professor"
    >
      <span className="marca">EXPLORE A SEMANA</span>
      <h3>Em quais dias cada professor está disponível?</h3>
      <p>
        {consulta.idioma} · {consulta.inicioFaixa}–{consulta.fimFaixa} · aulas
        de {consulta.duracaoMinutos} min. Esta consulta verifica cada dia
        separadamente, incluindo os dias que você não selecionou.
      </p>
      {!professores && (
        <button
          type="button"
          onClick={() => void consultar()}
          disabled={carregando}
        >
          {carregando
            ? "Consultando os sete dias…"
            : "Ver disponibilidade da semana inteira"}
        </button>
      )}
      <div role="status">
        {carregando ? "Verificando as agendas reais dos professores…" : erro}
      </div>
      {professores && (
        <div className="semana-professores">
          {professores.map((p) => (
            <article key={p.id}>
              <h4>{p.nome}</h4>
              <p>
                {Object.keys(p.dias).length
                  ? `${Object.keys(p.dias).length} dia(s) com horários livres`
                  : p.motivo === "Sem horário em comum nos dias pedidos"
                    ? "Sem horários livres nesta faixa e duração."
                    : p.motivo}
              </p>
              <div className="semana-dias">
                {diasSemana.map(([dia, nome]) =>
                  p.dias[dia]?.length ? (
                    <details key={dia}>
                      <summary>
                        {nome}
                        <span>{p.dias[dia].length} horário(s)</span>
                      </summary>
                      <p>{p.dias[dia].join(" · ")}</p>
                    </details>
                  ) : (
                    <div className="dia-indisponivel" key={dia}>
                      <strong>{nome}</strong>
                      <span>Indisponível</span>
                    </div>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="nota">
        Disponibilidade recorrente, descontando as aulas existentes. Dias livres
        podem ter horários diferentes entre si. Nenhuma aula é reservada.
      </p>
    </section>
  );
}

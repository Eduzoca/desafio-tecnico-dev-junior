import { lazy, Suspense, useEffect, useId, useRef, useState } from "react";
import type { BuscaRequest, Resultado } from "../types";
import { diasSemana, tempoLimiteBusca } from "../config";
const AgendaCalendar = lazy(() => import("./AgendaCalendar"));
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
  const [aberto, setAberto] = useState(false);
  const [professorId, setProfessorId] = useState<number | null>(null);
  const painelId = useId();
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
    const timer = setTimeout(() => abort.abort(), tempoLimiteBusca);
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
  const selecionado =
    professores?.find((p) => p.id === professorId) ??
    professores?.find((p) => Object.keys(p.dias).length > 0) ??
    professores?.[0];
  function alternar() {
    setAberto(!aberto);
    if (!aberto && !professores && !carregando) void consultar();
  }
  return (
    <section
      className="disponibilidade-semana"
      aria-label="Disponibilidade por professor"
    >
      <div className="agenda-heading">
        <div>
          <span className="marca">EXPLORE A SEMANA</span>
          <h3>Agenda dos professores</h3>
        </div>
        <button
          type="button"
          className="agenda-toggle"
          aria-expanded={aberto}
          aria-controls={painelId}
          onClick={alternar}
        >
          {aberto ? "Recolher agenda" : "Ver disponibilidade da semana inteira"}
        </button>
      </div>
      <p>
        {consulta.idioma} · {consulta.inicioFaixa}–{consulta.fimFaixa} ·{" "}
        {consulta.duracaoMinutos} min por aula
      </p>
      {aberto && (
        <div id={painelId}>
          <div role="status">
            {carregando ? "Consultando os sete dias…" : erro}
          </div>
          {erro && (
            <button type="button" onClick={() => void consultar()}>
              Tentar novamente
            </button>
          )}
          {professores && selecionado && (
            <>
              <label className="agenda-professor">
                Professor
                <select
                  value={selecionado.id}
                  onChange={(e) => setProfessorId(Number(e.target.value))}
                >
                  {professores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} · {Object.keys(p.dias).length} dia(s) disponíveis
                    </option>
                  ))}
                </select>
              </label>
              <p className="agenda-status">
                {Object.keys(selecionado.dias).length
                  ? `${Object.keys(selecionado.dias).length} dia(s) com horários livres`
                  : selecionado.motivo ===
                      "Sem horário em comum nos dias pedidos"
                    ? "Sem horários livres nesta faixa e duração."
                    : selecionado.motivo}
              </p>
              <Suspense fallback={<p role="status">Carregando calendário…</p>}>
                <AgendaCalendar
                  dias={selecionado.dias}
                  duracao={consulta.duracaoMinutos}
                />
              </Suspense>
              <p className="nota">
                Semana recorrente. Cada bloco é uma opção de aula, não uma
                reserva. Dias vazios não possuem horários nesta faixa. Use
                “mais” para ver todas as opções do dia.
              </p>
            </>
          )}
          {professores?.length === 0 && <p>Nenhum professor cadastrado.</p>}
        </div>
      )}
    </section>
  );
}

import { Check, CalendarDays } from "lucide-react";
import { Reveal } from "./Visual";
import { useState } from "react";
import type { BuscaRequest } from "../types";
import { diasSemana } from "./ResumoBusca";

export function PreviaSemanal({
  nome,
  horarios,
  consulta,
}: {
  nome: string;
  horarios: string[];
  consulta: BuscaRequest;
}) {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const termino = (inicio: string) => {
    const [hora, minuto] = inicio.split(":").map(Number);
    const total = hora * 60 + minuto + consulta.duracaoMinutos;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };
  return (
    <>
      <div className="horarios" role="group" aria-label={`Horários de ${nome}`}>
        {horarios.map((h) => (
          <button
            type="button"
            key={h}
            aria-pressed={selecionado === h}
            onClick={() => setSelecionado(selecionado === h ? null : h)}
            aria-label={`Ver semana de ${nome} às ${h}`}
          >
            {selecionado === h && <Check size={13} aria-hidden="true" />} {h}
          </button>
        ))}
      </div>
      <p className="agenda-instrucao" role="status">
        {selecionado
          ? `Horário ${selecionado} selecionado. Confira sua semana abaixo.`
          : "Escolha um horário para visualizar a agenda semanal."}
      </p>
      {selecionado && (
        <Reveal key={selecionado} className="previa-semanal">
          <h4>
            <CalendarDays size={17} aria-hidden="true" /> Como ficaria sua
            semana com {nome}
          </h4>
          <p>
            {consulta.idioma} · Semana recorrente · {consulta.duracaoMinutos}{" "}
            min por aula
          </p>
          <ul
            className="agenda-semana"
            aria-label={`Agenda semanal de ${nome}`}
          >
            {diasSemana.map(([dia, rotulo]) => (
              <li key={dia} data-selected={consulta.dias.includes(dia)}>
                <strong>{rotulo}</strong>
                {consulta.dias.includes(dia) ? (
                  <span className="agenda-aula">
                    {selecionado}–{termino(selecionado)}
                  </span>
                ) : (
                  <span className="agenda-sem-consulta">Não consultado</span>
                )}
              </li>
            ))}
          </ul>
          <p>Prévia de disponibilidade. Nenhuma aula foi agendada.</p>
        </Reveal>
      )}
    </>
  );
}

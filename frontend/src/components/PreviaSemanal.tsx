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
            {h}
          </button>
        ))}
      </div>
      {selecionado && (
        <div className="previa-semanal" aria-live="polite">
          <h4>Como ficaria sua semana com {nome}</h4>
          <ul>
            {diasSemana
              .filter(([dia]) => consulta.dias.includes(dia))
              .map(([dia, rotulo]) => (
                <li key={dia}>
                  <strong>{rotulo}</strong>
                  <span>
                    {selecionado}–{termino(selecionado)}
                  </span>
                </li>
              ))}
          </ul>
          <p>Prévia de disponibilidade. Nenhuma aula foi agendada.</p>
        </div>
      )}
    </>
  );
}

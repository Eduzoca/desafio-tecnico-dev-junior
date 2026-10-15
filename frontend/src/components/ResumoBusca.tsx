import type { BuscaRequest, Resultado } from "../types";

import { diasSemana } from "../config";
export { diasSemana } from "../config";

export function ResumoBusca({
  consulta,
  resultado,
}: {
  consulta: BuscaRequest;
  resultado: Resultado;
}) {
  const total = resultado.professores.length + resultado.naoElegiveis.length;
  const opcoes = resultado.professores.reduce(
    (soma, professor) => soma + professor.horarios.length,
    0,
  );
  return (
    <div className="resumo-busca">
      <p className="consulta-descricao">
        {consulta.idioma} ·{" "}
        {diasSemana
          .filter(([dia]) => consulta.dias.includes(dia))
          .map(([, nome]) => nome)
          .join(", ")}{" "}
        · {consulta.inicioFaixa}–{consulta.fimFaixa} · {consulta.duracaoMinutos}{" "}
        min
      </p>
      <dl className="metricas">
        <div>
          <dt>Professores analisados</dt>
          <dd>{total}</dd>
        </div>
        <div>
          <dt>Professores disponíveis</dt>
          <dd>{resultado.professores.length}</dd>
        </div>
        <div>
          <dt>Opções de professor e horário</dt>
          <dd>{opcoes}</dd>
        </div>
      </dl>
      <p className="ordenacao">
        Ordenados por menos aulas na semana e, em caso de empate, pelo nome.
        Cada horário vale para todos os dias desta busca.
      </p>
    </div>
  );
}

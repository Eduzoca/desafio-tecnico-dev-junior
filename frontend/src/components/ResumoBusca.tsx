import type { BuscaRequest } from "../types";

import { diasSemana } from "../config";
export { diasSemana } from "../config";

export function ResumoBusca({ consulta }: { consulta: BuscaRequest }) {
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
    </div>
  );
}

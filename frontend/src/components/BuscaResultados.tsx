import { DisponibilidadeSemana } from "./DisponibilidadeSemana";
import { Plus, Users } from "lucide-react";

import type { BuscaRequest, Resultado } from "../types";
import { ResumoBusca } from "./ResumoBusca";
import { ExplorarResultados } from "./ExplorarResultados";
export function BuscaResultados({
  resultado,
  consulta,
  erros,
  carregando,
}: {
  resultado: Resultado | null;
  consulta: BuscaRequest | null;
  erros: string[];
  carregando: boolean;
}) {
  return (
    <section
      className="resultados"
      aria-label="Resultados da busca"
      aria-live="polite"
      aria-busy={carregando}
    >
      {erros.length > 0 && (
        <div className="erro" role="alert">
          <h2>Vamos conferir?</h2>
          <ul>
            {erros.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {carregando && (
        <div className="vazio">
          <span className="typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <h2>Consultando as agendas…</h2>
          <p>Estamos procurando horários em comum.</p>
        </div>
      )}
      {!carregando && !resultado && erros.length === 0 && (
        <div className="vazio">
          <span className="icone">
            <Users />
          </span>
          <div>
            <h2>Seu próximo passo começa aqui</h2>
            <p>
              Preencha suas preferências para ver os professores e horários
              disponíveis.
            </p>
          </div>
        </div>
      )}
      {consulta && !carregando && erros.length === 0 && (
        <DisponibilidadeSemana
          key={JSON.stringify(consulta)}
          consulta={consulta}
        />
      )}
      {resultado && (
        <>
          <span className="marca">
            PROFESSORES DE {consulta?.idioma.toLocaleUpperCase("pt-BR")}
          </span>
          <h2>
            {resultado.professores.length
              ? `${resultado.professores.length} professor(es) disponíveis`
              : "Nenhum professor encontrado"}
          </h2>
          {consulta && <ResumoBusca consulta={consulta} />}
          {!resultado.professores.length && (
            <p>Tente outros dias, uma faixa maior ou uma duração menor.</p>
          )}
          {consulta && resultado.professores.length > 0 && (
            <ExplorarResultados
              key={JSON.stringify(consulta)}
              resultado={resultado}
              consulta={consulta}
            />
          )}
          {resultado.naoElegiveis.length > 0 && (
            <details>
              <summary>
                <span>
                  Professores indisponíveis ({resultado.naoElegiveis.length})
                </span>
                <Plus size={18} />
              </summary>
              <div
                className="motivos-resumo"
                aria-label="Resumo dos motivos de exclusão"
              >
                {[...new Set(resultado.naoElegiveis.map((p) => p.motivo))].map(
                  (motivo) => {
                    const quantidade = resultado.naoElegiveis.filter(
                      (p) => p.motivo === motivo,
                    ).length;
                    return (
                      quantidade > 0 && (
                        <p key={motivo}>
                          <strong>{quantidade}</strong> · {motivo}
                        </p>
                      )
                    );
                  },
                )}
              </div>
              <ul>
                {resultado.naoElegiveis.map((p) => (
                  <li key={p.id}>
                    <strong>{p.nome}</strong>
                    <span>{p.motivo}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </section>
  );
}

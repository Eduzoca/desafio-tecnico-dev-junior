import { Check, Clock, Plus, User, Users } from "lucide-react";
import { Reveal } from "./Visual";
import type { Resultado } from "../types";
export function BuscaResultados({
  resultado,
  erros,
  carregando,
}: {
  resultado: Resultado | null;
  erros: string[];
  carregando: boolean;
}) {
  return (
    <section className="resultados" aria-live="polite" aria-busy={carregando}>
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
      {resultado && (
        <>
          <span className="marca">SUA BUSCA</span>
          <h2>
            {resultado.professores.length
              ? `${resultado.professores.length} professor(es) disponíveis`
              : "Nenhum professor encontrado"}
          </h2>
          {!resultado.professores.length && (
            <p>Tente outros dias, uma faixa maior ou uma duração menor.</p>
          )}
          <div className="results-grid">
            {resultado.professores.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <article>
                  <div className="professor">
                    <span className="avatar">
                      <User />
                    </span>
                    <div>
                      <h3>{p.nome}</h3>
                      <p>{p.aulasNaSemana} aula(s) na semana</p>
                    </div>
                    <Check className="eligible-check" />
                  </div>
                  <p className="rotulo">
                    <Clock size={14} /> Horários de início disponíveis
                  </p>
                  <div className="horarios">
                    {p.horarios.map((h) => (
                      <span key={h}>{h}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {resultado.naoElegiveis.length > 0 && (
            <details>
              <summary>
                <span>
                  Professores indisponíveis ({resultado.naoElegiveis.length})
                </span>
                <Plus size={18} />
              </summary>
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

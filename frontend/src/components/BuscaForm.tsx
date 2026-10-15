import { LanguageOption } from "./LanguageFeedback";
import { idiomas, duracoes, buscaInicial } from "../config";
import { useState } from "react";
import { Check, Search, LoaderCircle, CalendarDays } from "lucide-react";
import type { BuscaRequest, DiaSemana } from "../types";
import { diasSemana } from "./ResumoBusca";
export function BuscaForm({
  carregando,
  onSearch,
}: {
  carregando: boolean;
  onSearch: (request: BuscaRequest) => Promise<void>;
}) {
  const [idioma, setIdioma] = useState<string>(buscaInicial.idioma);
  const [dias, setDias] = useState<DiaSemana[]>(buscaInicial.dias);
  const [inicioFaixa, setInicio] = useState(buscaInicial.inicioFaixa);
  const [fimFaixa, setFim] = useState(buscaInicial.fimFaixa);
  const [duracaoMinutos, setDuracao] = useState(buscaInicial.duracaoMinutos);
  const minutos = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };
  const cabeNaFaixa =
    minutos(fimFaixa) - minutos(inicioFaixa) >= duracaoMinutos;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSearch({ idioma, dias, inicioFaixa, fimFaixa, duracaoMinutos });
      }}
    >
      <div className="form-heading">
        <span className="marca">VAMOS COMEÇAR?</span>
        <h2>Encontre seu professor</h2>
        <p>Preencha suas preferências abaixo.</p>
      </div>
      <fieldset disabled={carregando}>
        <fieldset className="idioma-opcoes">
          <legend>Quero aprender</legend>
          {idiomas.map(({ nome: opcao }) => (
            <label key={opcao}>
              <input
                type="radio"
                name="idioma"
                value={opcao}
                checked={idioma === opcao}
                onChange={() => setIdioma(opcao)}
              />
              <LanguageOption idioma={opcao} selecionado={idioma === opcao} />
            </label>
          ))}
        </fieldset>
        <fieldset className="dias">
          <legend>Dias da semana</legend>
          {diasSemana.map(([valor, nome]) => (
            <label key={valor}>
              <input
                type="checkbox"
                checked={dias.includes(valor)}
                onChange={(e) =>
                  setDias(
                    e.target.checked
                      ? [...dias, valor]
                      : dias.filter((d) => d !== valor),
                  )
                }
              />
              {nome}
            </label>
          ))}
        </fieldset>
        <div className="faixa">
          <label>
            A partir de
            <input
              type="time"
              required
              value={inicioFaixa}
              onChange={(e) => setInicio(e.target.value)}
            />
          </label>
          <label>
            Até
            <input
              type="time"
              required
              value={fimFaixa}
              onChange={(e) => setFim(e.target.value)}
            />
          </label>
        </div>
        <label>
          Duração
          <select
            value={duracaoMinutos}
            onChange={(e) => setDuracao(Number(e.target.value))}
          >
            {duracoes.map((d) => (
              <option key={d} value={d}>
                {d} minutos
              </option>
            ))}
          </select>
        </label>
        <div
          className="preferencias-feedback"
          data-warning={!dias.length || !cabeNaFaixa}
          role="status"
        >
          <CalendarDays size={17} aria-hidden="true" />
          <span>
            {!dias.length
              ? "Selecione pelo menos um dia para montar sua semana."
              : !cabeNaFaixa
                ? "A faixa de horário precisa comportar a duração da aula."
                : `Sua semana: ${dias.length} dia(s) · ${dias.length * duracaoMinutos} min de ${idioma}`}
          </span>
        </div>
        <p className="nota">
          <Check size={15} /> O horário de início será o mesmo em todos os dias
          escolhidos.
        </p>
        <button type="submit">
          {carregando ? (
            <LoaderCircle
              className="loading-spinner"
              size={17}
              aria-hidden="true"
            />
          ) : (
            <Search size={17} aria-hidden="true" />
          )}
          {carregando ? "Buscando professores…" : "Encontrar professores"}
        </button>
      </fieldset>
    </form>
  );
}

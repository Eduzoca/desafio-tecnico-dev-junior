import { useState } from "react";
import { Check, Search } from "lucide-react";
import type { BuscaRequest } from "../types";
const semana = [
  ["segunda", "Segunda"],
  ["terca", "Terça"],
  ["quarta", "Quarta"],
  ["quinta", "Quinta"],
  ["sexta", "Sexta"],
  ["sabado", "Sábado"],
  ["domingo", "Domingo"],
];
export function BuscaForm({
  carregando,
  onSearch,
}: {
  carregando: boolean;
  onSearch: (request: BuscaRequest) => Promise<void>;
}) {
  const [idioma, setIdioma] = useState("Espanhol");
  const [dias, setDias] = useState<string[]>(["segunda"]);
  const [inicioFaixa, setInicio] = useState("18:00");
  const [fimFaixa, setFim] = useState("20:00");
  const [duracaoMinutos, setDuracao] = useState(60);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void onSearch({ idioma, dias, inicioFaixa, fimFaixa, duracaoMinutos });
      }}
    >
      <h2>Sua próxima aula</h2>
      <fieldset disabled={carregando}>
        <label>
          Quero aprender
          <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
            {["Inglês", "Espanhol", "Francês"].map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
        <fieldset className="dias">
          <legend>Dias da semana</legend>
          {semana.map(([valor, nome]) => (
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
            {[30, 60, 90].map((d) => (
              <option key={d} value={d}>
                {d} minutos
              </option>
            ))}
          </select>
        </label>
        <p className="nota">
          <Check size={15} /> O horário de início será o mesmo em todos os dias
          escolhidos.
        </p>
        <button type="submit">
          <Search size={17} />
          {carregando ? "Buscando professores…" : "Encontrar professores"}
        </button>
      </fieldset>
    </form>
  );
}

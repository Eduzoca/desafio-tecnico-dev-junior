import { useId, useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { SlidersHorizontal } from "lucide-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import FormControl from "react-bootstrap/FormControl";
import FormSelect from "react-bootstrap/FormSelect";
import type { BuscaRequest, Resultado } from "../types";
import {
  agruparHorarios,
  ordenacoes,
  selecionarProfessores,
  type Ordenacao,
} from "../domain/resultados";
import { PreviaSemanal } from "./PreviaSemanal";

export function ExplorarResultados({
  resultado,
  consulta,
}: {
  resultado: Resultado;
  consulta: BuscaRequest;
}) {
  const [filtroAberto, setFiltroAberto] = useState(false);
  const painelId = useId();
  const [nome, setNome] = useState("");
  const [horario, setHorario] = useState("");
  const [ordem, setOrdem] = useState<Ordenacao>("carga");
  const horarios = agruparHorarios(resultado.professores);
  const professores = selecionarProfessores(
    resultado.professores,
    nome,
    horario,
    ordem,
  );
  return (
    <div className="explorar-resultados" data-filter-open={filtroAberto}>
      <div className="result-filter">
        <Button
          variant="outline-secondary"
          className="filter-toggle"
          aria-expanded={filtroAberto}
          aria-controls={painelId}
          onClick={() => setFiltroAberto(!filtroAberto)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" /> Filtrar resultados
        </Button>
        <Collapse in={filtroAberto}>
          <div id={painelId}>
            <div className="filter-panel p-3">
              <Stack gap={3} className="filtros-resultados">
                <label>
                  Nome do professor
                  <FormControl
                    type="search"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Pesquisar por nome"
                  />
                </label>
                <label>
                  Horário de início
                  <FormSelect
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                  >
                    <option value="">Todos os horários</option>
                    {horarios.map(([inicio, quantidade]) => (
                      <option key={inicio} value={inicio}>
                        {inicio} · {quantidade} professor(es)
                      </option>
                    ))}
                  </FormSelect>
                </label>
                <label>
                  Ordenar por
                  <FormSelect
                    value={ordem}
                    onChange={(e) => setOrdem(e.target.value as Ordenacao)}
                  >
                    {Object.entries(ordenacoes).map(([valor, rotulo]) => (
                      <option key={valor} value={valor}>
                        {rotulo}
                      </option>
                    ))}
                  </FormSelect>
                </label>
              </Stack>
            </div>
          </div>
        </Collapse>
      </div>
      <div className="result-body">
        <div className="result-toolbar">
          <p role="status" aria-label="Contagem dos resultados filtrados">
            Exibindo {professores.length} de {resultado.professores.length}{" "}
            professor(es) disponíveis.
          </p>
        </div>
        {(nome || horario || ordem !== "carga") && (
          <button
            type="button"
            className="acao-resultados"
            onClick={() => {
              setNome("");
              setHorario("");
              setOrdem("carga");
            }}
          >
            Limpar filtros
          </button>
        )}
        {!professores.length && (
          <p>
            Nenhum professor corresponde aos filtros. Limpe-os para ver todas as
            opções da busca.
          </p>
        )}
        <Row xs={1} lg={2} className="g-3 results-cards">
          {professores.map((p) => (
            <Col key={p.id}>
              <article className="professor-card">
                <div className="professor">
                  <div>
                    <h3>{p.nome}</h3>
                    <p>{p.aulasNaSemana} aula(s) na semana</p>
                  </div>
                </div>

                <PreviaSemanal
                  nome={p.nome}
                  horarios={
                    horario
                      ? p.horarios.filter((h) => h === horario)
                      : p.horarios
                  }
                  consulta={consulta}
                />
              </article>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

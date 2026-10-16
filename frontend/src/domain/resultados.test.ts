import { describe, expect, it } from "vitest";
import { agruparHorarios, selecionarProfessores } from "./resultados";

const professores = [
  { id: 7, nome: "José", aulasNaSemana: 3, horarios: ["19:00", "18:00"] },
  { id: 2, nome: "Ana", aulasNaSemana: 1, horarios: ["18:00"] },
];
describe("Exploração dos resultados", () => {
  it("conta professores distintos por horário em ordem cronológica", () => {
    expect(
      agruparHorarios([
        ...professores,
        { id: 9, nome: "Bia", aulasNaSemana: 0, horarios: ["18:00", "18:00"] },
      ]),
    ).toEqual([
      ["18:00", 3],
      ["19:00", 1],
    ]);
    expect(agruparHorarios([])).toEqual([]);
  });
  it("combina filtros sem acentos e não altera a resposta original", () => {
    expect(
      selecionarProfessores(professores, " JOSE ", "19:00", "carga").map(
        (p) => p.id,
      ),
    ).toEqual([7]);
    expect(selecionarProfessores(professores, "Ana", "19:00", "nome")).toEqual(
      [],
    );
    expect(
      selecionarProfessores(professores, "", "", "carga").map((p) => p.id),
    ).toEqual([2, 7]);
    expect(
      selecionarProfessores(professores, "", "", "opcoes").map((p) => p.id),
    ).toEqual([7, 2]);
    expect(professores[0].id).toBe(7);
  });
});

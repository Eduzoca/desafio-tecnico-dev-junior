import { expect, it } from "vitest";
import { agruparSemana } from "./agenda";
import type { DiaSemana, Resultado } from "../types";
it("agrupa por id e dia sem compartilhar os arrays da resposta", () => {
  const respostas: { dia: DiaSemana; resultado: Resultado }[] = [
    {
      dia: "segunda",
      resultado: {
        professores: [
          { id: 1, nome: "Ana", aulasNaSemana: 0, horarios: ["18:00"] },
        ],
        naoElegiveis: [],
      },
    },
    {
      dia: "quarta",
      resultado: {
        professores: [
          { id: 1, nome: "Ana", aulasNaSemana: 0, horarios: ["19:00"] },
        ],
        naoElegiveis: [{ id: 2, nome: "Bruno", motivo: "Agenda bloqueada" }],
      },
    },
  ];
  const agrupado = agruparSemana(respostas);
  expect(agrupado.map((p) => p.nome)).toEqual(["Ana", "Bruno"]);
  expect(agrupado[0].dias).toEqual({ segunda: ["18:00"], quarta: ["19:00"] });
  agrupado[0].dias.segunda?.push("19:30");
  expect(respostas[0].resultado.professores[0].horarios).toEqual(["18:00"]);
  expect(agrupado[1].dias).toEqual({});
});

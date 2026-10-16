import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExplorarResultados } from "./ExplorarResultados";

afterEach(cleanup);
it("filtra por horário e nome, mostra ausência de correspondência e limpa os filtros", async () => {
  render(
    <ExplorarResultados
      consulta={{
        idioma: "Inglês",
        dias: ["segunda"],
        inicioFaixa: "18:00",
        fimFaixa: "21:00",
        duracaoMinutos: 60,
      }}
      resultado={{
        professores: [
          {
            id: 1,
            nome: "José",
            aulasNaSemana: 2,
            horarios: ["18:00", "19:00"],
          },
          { id: 2, nome: "Ana", aulasNaSemana: 0, horarios: ["18:00"] },
        ],
        naoElegiveis: [],
      }}
    />,
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Filtrar resultados" }),
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Horário de início" }),
    "19:00",
  );
  expect(screen.queryByRole("heading", { name: "Ana" })).toBeNull();
  expect(screen.getByRole("heading", { name: "José" })).toBeTruthy();
  await userEvent.type(screen.getByRole("searchbox"), "Ana");
  expect(
    screen.getByRole("status", { name: "Contagem dos resultados filtrados" })
      .textContent,
  ).toContain("Exibindo 0 de 2");
  await userEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
  expect(screen.getByRole("heading", { name: "Ana" })).toBeTruthy();
  expect(
    screen.getByRole("status", { name: "Contagem dos resultados filtrados" })
      .textContent,
  ).toContain("Exibindo 2 de 2");
});

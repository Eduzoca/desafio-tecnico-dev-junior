import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DisponibilidadeSemana } from "./DisponibilidadeSemana";
const consulta = {
  idioma: "Inglês",
  dias: ["segunda"],
  inicioFaixa: "18:00",
  fimFaixa: "20:00",
  duracaoMinutos: 60,
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("consulta os sete dias e mostra horários diferentes sem confundi-los com horários comuns", async () => {
  const mock = vi.fn(async (_url, options) => {
    const request = JSON.parse(options.body);
    expect(request.idioma).toBe("Inglês");
    expect(request.duracaoMinutos).toBe(60);
    const dia = request.dias[0];
    return new Response(
      JSON.stringify({
        professores: ["segunda", "quarta"].includes(dia)
          ? [
              {
                id: 1,
                nome: "Ana",
                aulasNaSemana: 1,
                horarios: [dia === "segunda" ? "18:00" : "19:00"],
              },
            ]
          : [],
        naoElegiveis: ["segunda", "quarta"].includes(dia)
          ? []
          : [
              {
                id: 1,
                nome: "Ana",
                motivo: "Sem horário em comum nos dias pedidos",
              },
            ],
      }),
    );
  });
  vi.stubGlobal("fetch", mock);
  render(<DisponibilidadeSemana consulta={consulta} />);
  await userEvent.click(
    screen.getByRole("button", {
      name: "Ver disponibilidade da semana inteira",
    }),
  );
  await screen.findByText("2 dia(s) com horários livres");
  expect(mock).toHaveBeenCalledTimes(7);
  const article = screen
    .getByRole("heading", { name: "Ana" })
    .closest("article")!;
  expect(within(article).getAllByText("Indisponível")).toHaveLength(5);
  expect(within(article).getByText("18:00")).toBeTruthy();
  expect(within(article).getByText("19:00")).toBeTruthy();
});
it("mostra erro e permite nova tentativa quando um dia falha", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("", { status: 500 })),
  );
  render(<DisponibilidadeSemana consulta={consulta} />);
  await userEvent.click(
    screen.getByRole("button", {
      name: "Ver disponibilidade da semana inteira",
    }),
  );
  await screen.findByText(
    "Não foi possível consultar a semana completa. Tente novamente.",
  );
  expect(
    (
      screen.getByRole("button", {
        name: "Ver disponibilidade da semana inteira",
      }) as HTMLButtonElement
    ).disabled,
  ).toBe(false);
  expect(screen.queryByRole("article")).toBeNull();
});

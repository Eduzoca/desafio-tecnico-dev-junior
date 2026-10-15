import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const fetchMock = vi.fn();
const sucesso = {
  professores: [{ id: 1, nome: "Ana", aulasNaSemana: 1, horarios: ["18:00"] }],
  naoElegiveis: [{ id: 2, nome: "Bruno", motivo: "Não ensina o idioma" }],
};
const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => vi.stubGlobal("fetch", fetchMock));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("Busca de professores", () => {
  it("consulta o idioma selecionado e distingue dias não consultados na agenda", async () => {
    fetchMock.mockResolvedValue(response(sucesso));
    render(<App />);
    await userEvent.click(screen.getByRole("radio", { name: "Francês" }));
    expect(
      screen.getByText("Sua semana: 1 dia(s) · 60 min de Francês"),
    ).toBeTruthy();
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    await screen.findByRole("heading", { name: "Ana" });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).idioma).toBe("Francês");
    expect(screen.getByText("PROFESSORES DE FRANCÊS")).toBeTruthy();
    const slot = screen.getByRole("button", {
      name: "Ver semana de Ana às 18:00",
    });
    await userEvent.click(slot);
    expect(slot.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen.getByRole("list", { name: "Agenda semanal de Ana" }).children
        .length,
    ).toBe(7);
    expect(screen.getAllByText("Não consultado")).toHaveLength(6);
    await userEvent.click(slot);
    expect(
      screen.queryByRole("list", { name: "Agenda semanal de Ana" }),
    ).toBeNull();
  });
  it("mostra a semana do horário escolhido usando os critérios da busca enviada", async () => {
    fetchMock.mockResolvedValue(response(sucesso));
    render(<App />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Quarta" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    await screen.findByRole("heading", { name: "Ana" });
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Duração" }),
      "90",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ver semana de Ana às 18:00" }),
    );
    expect(screen.getAllByText("18:00–19:00")).toHaveLength(2);
    expect(screen.queryByText("18:00–19:30")).toBeNull();
    expect(
      screen.getByText("Prévia de disponibilidade. Nenhuma aula foi agendada."),
    ).toBeTruthy();
  });
  it("envia as preferências e mostra horários, carga e não elegíveis", async () => {
    fetchMock.mockResolvedValue(response(sucesso));
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect(await screen.findByRole("heading", { name: "Ana" })).toBeTruthy();
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/professores/busca");
    expect(JSON.parse(options.body)).toEqual({
      idioma: "Espanhol",
      dias: ["segunda"],
      inicioFaixa: "18:00",
      fimFaixa: "20:00",
      duracaoMinutos: 60,
    });
    expect(screen.getByText("18:00")).toBeTruthy();
    expect(screen.getByText("1 aula(s) na semana")).toBeTruthy();
    await userEvent.click(screen.getByText("Professores indisponíveis (1)"));
    expect(screen.getByText("Bruno")).toBeTruthy();
    expect(screen.getByText("Não ensina o idioma")).toBeTruthy();
  });

  it("exibe estado vazio quando a busca não retorna professores", async () => {
    fetchMock.mockResolvedValue(
      response({ professores: [], naoElegiveis: [] }),
    );
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect(
      await screen.findByRole("heading", {
        name: "Nenhum professor encontrado",
      }),
    ).toBeTruthy();
  });

  it("exibe as mensagens de validação retornadas pela API", async () => {
    fetchMock.mockResolvedValue(
      response({ erros: ["Informe pelo menos um dia."] }, 400),
    );
    render(<App />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Segunda" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Informe pelo menos um dia.",
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).dias).toEqual([]);
  });

  it("permite tentar novamente depois de uma falha de comunicação", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(response(sucesso));
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Não foi possível comunicar com a API",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect(await screen.findByRole("heading", { name: "Ana" })).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("bloqueia o formulário enquanto carrega e limpa resultados anteriores", async () => {
    let concluir!: (value: Response) => void;
    fetchMock.mockResolvedValueOnce(response(sucesso)).mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          concluir = resolve;
        }),
    );
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    await screen.findByRole("heading", { name: "Ana" });
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect(
      screen.getByRole("heading", { name: "Consultando as agendas…" }),
    ).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Ana" })).toBeNull();
    expect(
      screen
        .getByRole("button", { name: "Buscando professores…" })
        .closest("fieldset")?.disabled,
    ).toBe(true);
    concluir(response({ professores: [], naoElegiveis: [] }));
    await waitFor(() =>
      expect(screen.queryByText("Consultando as agendas…")).toBeNull(),
    );
  });

  it("trata respostas de erro do servidor", async () => {
    fetchMock.mockResolvedValue(response({}, 500));
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "Encontrar professores" }),
    );
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Não foi possível concluir a busca",
    );
  });
});

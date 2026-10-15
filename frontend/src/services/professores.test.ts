import { afterEach, expect, it, vi } from "vitest";
import { buscarProfessores } from "./professores";
import { buscaInicial } from "../config";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it.each([
  null,
  {},
  {
    professores: [
      { id: 1, nome: "Ana", aulasNaSemana: 0, horarios: ["99:00"] },
    ],
    naoElegiveis: [],
  },
  {
    professores: [],
    naoElegiveis: [{ id: "1", nome: "Ana", motivo: "Agenda bloqueada" }],
  },
])("rejeita resposta fora do contrato: %j", async (dados) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify(dados))),
  );
  await expect(
    buscarProfessores(buscaInicial, new AbortController().signal),
  ).rejects.toMatchObject({ tipo: "resposta" });
});
it("distingue JSON inválido de falha de rede", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(new Response("<html>erro</html>"))
      .mockRejectedValueOnce(new TypeError("offline")),
  );
  await expect(
    buscarProfessores(buscaInicial, new AbortController().signal),
  ).rejects.toMatchObject({ tipo: "resposta" });
  await expect(
    buscarProfessores(buscaInicial, new AbortController().signal),
  ).rejects.toMatchObject({ tipo: "rede" });
});
it("limpa o timer imediatamente ao cancelar, mesmo se o transporte atrasar", async () => {
  vi.useFakeTimers();
  let responder!: (r: Response) => void;
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          responder = resolve;
        }),
    ),
  );
  const controller = new AbortController();
  const request = buscarProfessores(buscaInicial, controller.signal);
  controller.abort();
  expect(vi.getTimerCount()).toBe(0);
  responder(
    new Response(JSON.stringify({ professores: [], naoElegiveis: [] })),
  );
  await expect(request).rejects.toMatchObject({ name: "AbortError" });
});

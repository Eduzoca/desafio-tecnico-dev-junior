import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useBusca } from "./useBusca";
const consulta = {
  idioma: "Espanhol",
  dias: ["segunda"],
  inicioFaixa: "18:00",
  fimFaixa: "20:00",
  duracaoMinutos: 60,
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it("encerra buscas que excedem 15 segundos e permite nova tentativa", async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    "fetch",
    vi.fn(
      (_: unknown, options: RequestInit) =>
        new Promise((_, reject) => {
          options.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    ),
  );
  const { result } = renderHook(() => useBusca());
  let promessa!: Promise<void>;
  act(() => {
    promessa = result.current.buscar(consulta);
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(15000);
    await promessa;
  });
  expect(result.current.carregando).toBe(false);
  expect(result.current.erros).toEqual([
    "A busca demorou mais que o esperado. Tente novamente.",
  ]);
});

it("uma resposta antiga não substitui a busca mais recente", async () => {
  let responderAntiga!: (response: Response) => void;
  const nova = { professores: [], naoElegiveis: [] };
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            responderAntiga = resolve;
          }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify(nova))),
  );
  const { result } = renderHook(() => useBusca());
  let antiga!: Promise<void>;
  act(() => {
    antiga = result.current.buscar(consulta);
  });
  await act(async () => {
    await result.current.buscar({ ...consulta, idioma: "Francês" });
  });
  await act(async () => {
    responderAntiga(
      new Response(
        JSON.stringify({ professores: [{ id: 99 }], naoElegiveis: [] }),
      ),
    );
    await antiga;
  });
  expect(result.current.resultado).toEqual(nova);
  expect(result.current.consulta?.idioma).toBe("Francês");
});

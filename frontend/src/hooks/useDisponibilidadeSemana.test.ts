import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useDisponibilidadeSemana } from "./useDisponibilidadeSemana";
import { buscaInicial, tempoLimiteBusca } from "../config";
const vazio = () =>
  new Response(JSON.stringify({ professores: [], naoElegiveis: [] }));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
it("descarta a semana anterior quando os filtros mudam durante a consulta", async () => {
  const respostas: Array<(r: Response) => void> = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise<Response>((resolve) => respostas.push(resolve))),
  );
  const view = renderHook(
    ({ consulta }) => useDisponibilidadeSemana(consulta),
    { initialProps: { consulta: { ...buscaInicial, idioma: "Inglês" } } },
  );
  let anterior!: Promise<void>;
  act(() => {
    anterior = view.result.current.consultar();
  });
  view.rerender({ consulta: { ...buscaInicial, idioma: "Francês" } });
  expect(view.result.current.carregando).toBe(false);
  let atual!: Promise<void>;
  act(() => {
    atual = view.result.current.consultar();
  });
  await act(async () => {
    respostas.slice(7).forEach((resolve) => resolve(vazio()));
    await atual;
  });
  await act(async () => {
    respostas.slice(0, 7).forEach((resolve) => resolve(new Response("{}")));
    await anterior;
  });
  expect(view.result.current.professores).toEqual([]);
  expect(view.result.current.erro).toBe("");
});
it("encerra a semana por timeout e cancela as requisições ao desmontar", async () => {
  vi.useFakeTimers();
  const sinais: AbortSignal[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(
      (_url: string, options: RequestInit) =>
        new Promise((_, reject) => {
          sinais.push(options.signal!);
          options.signal!.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    ),
  );
  const view = renderHook(() => useDisponibilidadeSemana(buscaInicial));
  let request!: Promise<void>;
  act(() => {
    request = view.result.current.consultar();
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(tempoLimiteBusca);
    await request;
  });
  expect(view.result.current.erro).toContain("demorou");
  expect(view.result.current.professores).toBeNull();
  act(() => {
    request = view.result.current.consultar();
  });
  view.unmount();
  await request;
  expect(sinais.every((s) => s.aborted)).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

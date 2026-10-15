import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LanguageOption } from "./LanguageFeedback";
const animation = vi.hoisted(() => ({ fromTo: vi.fn(), revert: vi.fn() }));
vi.mock("gsap", () => ({
  gsap: {
    fromTo: animation.fromTo,
    matchMedia: () => ({
      add: (_query: string, callback: () => void) => callback(),
      revert: animation.revert,
    }),
  },
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
it("repete a animação de meio segundo mesmo no idioma já selecionado", () => {
  vi.stubGlobal("matchMedia", vi.fn());
  const view = render(
    <LanguageOption idioma="Inglês" selecionado cliques={0} />,
  );
  animation.fromTo.mockClear();
  view.rerender(<LanguageOption idioma="Inglês" selecionado cliques={1} />);
  expect(animation.fromTo).toHaveBeenCalledTimes(1);
  expect(animation.fromTo.mock.calls[0][0]).toHaveLength(3);
  expect(animation.fromTo.mock.calls[0][2]).toMatchObject({
    duration: 0.5,
    opacity: 0,
  });
  view.rerender(<LanguageOption idioma="Inglês" selecionado cliques={2} />);
  expect(animation.revert).toHaveBeenCalled();
  expect(animation.fromTo).toHaveBeenCalledTimes(2);
});

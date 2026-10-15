import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { HeroScene } from "./HeroScene";
const { create, dispose } = vi.hoisted(() => ({
  create: vi.fn(),
  dispose: vi.fn(),
}));
vi.mock("./heroSceneRenderer", () => ({ createHeroScene: create }));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});
function environment(reduced: boolean) {
  const media = {
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("matchMedia", () => media);
  vi.stubGlobal("WebGL2RenderingContext", class {});
  vi.stubGlobal("ResizeObserver", class {});
  vi.stubGlobal("IntersectionObserver", class {});
  create.mockReturnValue(dispose);
  return media;
}
it("keeps the CSS fallback without creating a scene when reduced motion is requested", () => {
  environment(true);
  render(<HeroScene />);
  expect(create).not.toHaveBeenCalled();
});
it("disposes the scene when reduced motion is enabled and removes its listener on unmount", async () => {
  const media = environment(false);
  const view = render(<HeroScene />);
  await waitFor(() => expect(create).toHaveBeenCalledTimes(1));
  media.matches = true;
  media.addEventListener.mock.calls[0][1]();
  expect(dispose).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(dispose).toHaveBeenCalledTimes(1);
  expect(media.removeEventListener).toHaveBeenCalledWith(
    "change",
    media.addEventListener.mock.calls[0][1],
  );
});

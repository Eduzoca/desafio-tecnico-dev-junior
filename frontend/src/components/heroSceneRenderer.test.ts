import { afterEach, expect, it, vi } from "vitest";
import * as THREE from "three";
import { gsap } from "gsap";
import { createHeroScene } from "./heroSceneRenderer";
const renderer = vi.hoisted(() => ({
  dispose: vi.fn(),
  render: vi.fn(),
  setPixelRatio: vi.fn(),
  setClearColor: vi.fn(),
  setSize: vi.fn(),
}));
vi.mock("three", async (importOriginal) => ({
  ...(await importOriginal<typeof import("three")>()),
  WebGLRenderer: class {
    domElement = document.createElement("canvas");
    dispose = renderer.dispose;
    render = renderer.render;
    setPixelRatio = renderer.setPixelRatio;
    setClearColor = renderer.setClearColor;
    setSize = renderer.setSize;
  },
}));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  document.body.replaceChildren();
});
it("remove listeners, observadores, animações e recursos uma única vez", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  const geometryDispose = vi.spyOn(THREE.BufferGeometry.prototype, "dispose");
  const materialDispose = vi.spyOn(THREE.Material.prototype, "dispose");
  const removeTicker = vi.spyOn(gsap.ticker, "remove");
  const disconnect = vi.fn();
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect = disconnect;
    },
  );
  const surface = document.createElement("div");
  const host = document.createElement("div");
  surface.append(host);
  document.body.append(surface);
  const removeListener = vi.spyOn(surface, "removeEventListener");
  const dispose = createHeroScene(host, surface);
  expect(host.querySelector("canvas")).not.toBeNull();
  dispose();
  dispose();
  expect(renderer.dispose).toHaveBeenCalledTimes(1);
  expect(geometryDispose).toHaveBeenCalledTimes(1);
  expect(materialDispose).toHaveBeenCalledTimes(1);
  expect(disconnect).toHaveBeenCalledTimes(2);
  expect(removeListener).toHaveBeenCalledWith(
    "pointermove",
    expect.any(Function),
  );
  expect(removeListener).toHaveBeenCalledWith(
    "pointerleave",
    expect.any(Function),
  );
  expect(removeTicker).toHaveBeenCalled();
  expect(host.querySelector("canvas")).toBeNull();
});

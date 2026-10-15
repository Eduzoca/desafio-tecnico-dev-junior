import { afterEach, expect, it, vi } from "vitest";
import * as THREE from "three";
import { createGlobe } from "./globeModel";
import { cameraDistance } from "./globeFraming";
import { globeVisual } from "./globeVisual";
afterEach(() => vi.restoreAllMocks());
it.each([0.7, 1, 1.5])(
  "mantém balões completos dentro do enquadramento na proporção %s",
  (aspect) => {
    const context = {
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillText: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    const { globe, dispose } = createGlobe();
    const parent = new THREE.Group();
    parent.add(globe);
    const camera = new THREE.PerspectiveCamera(
      globeVisual.cameraFov,
      aspect,
      0.1,
      50,
    );
    camera.position.z = cameraDistance(aspect);
    camera.updateMatrixWorld();
    for (const progress of [0, 0.5, 1])
      for (const direction of [-1, 0, 1]) {
        globe.rotation.x = progress * globeVisual.rotationX;
        globe.rotation.y = progress * globeVisual.rotationY;
        globe.position.y = progress * globeVisual.floatHeight;
        parent.rotation.set(
          direction * globeVisual.pointerX,
          direction * globeVisual.pointerY,
          0,
        );
        parent.updateMatrixWorld(true);
        for (const child of globe.children) {
          if (!(child instanceof THREE.Sprite)) continue;
          const center = child.getWorldPosition(new THREE.Vector3());
          for (const x of [-1, 1])
            for (const y of [-1, 1]) {
              const corner = center
                .clone()
                .add(
                  new THREE.Vector3(
                    (x * child.scale.x) / 2,
                    (y * child.scale.y) / 2,
                    0,
                  ),
                )
                .project(camera);
              expect(Math.abs(corner.x)).toBeLessThan(1);
              expect(Math.abs(corner.y)).toBeLessThan(1);
            }
        }
      }
    dispose();
  },
);

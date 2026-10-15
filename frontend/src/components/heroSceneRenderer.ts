import { createGlobe } from "./globeModel";
import { globeVisual } from "./globeVisual";
import * as THREE from "three";
import { gsap } from "gsap";

export function createHeroScene(
  host: HTMLDivElement,
  surface: HTMLElement = host,
): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, globeVisual.maxPixelRatio),
  );
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(globeVisual.cameraFov, 1, 0.1, 50);
  camera.position.z = 12;
  const group = new THREE.Group();
  scene.add(group);
  const { globe, dispose: disposeGlobe } = createGlobe();
  group.add(globe);
  const timeline = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
  timeline.to(
    globe.rotation,
    {
      y: globeVisual.rotationY,
      x: globeVisual.rotationX,
      duration: globeVisual.duration,
      ease: "sine.inOut",
    },
    0,
  );
  timeline.to(
    globe.position,
    {
      y: globeVisual.floatHeight,
      duration: globeVisual.duration,
      ease: "sine.inOut",
    },
    0,
  );
  const tiltX = gsap.quickTo(group.rotation, "x", {
    duration: globeVisual.pointerDuration,
    ease: "power2.out",
  });
  const tiltY = gsap.quickTo(group.rotation, "y", {
    duration: globeVisual.pointerDuration,
    ease: "power2.out",
  });

  const pointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !visible || document.hidden || lost)
      return;
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    tiltX(
      Math.max(
        -globeVisual.pointerX,
        Math.min(
          globeVisual.pointerX,
          ((event.clientY - bounds.top) / bounds.height) *
            globeVisual.pointerX *
            2 -
            globeVisual.pointerX,
        ),
      ),
    );
    tiltY(
      Math.max(
        -globeVisual.pointerY,
        Math.min(
          globeVisual.pointerY,
          ((event.clientX - bounds.left) / bounds.width) *
            globeVisual.pointerY *
            2 -
            globeVisual.pointerY,
        ),
      ),
    );
  };
  const reset = () => {
    tiltX(0);
    tiltY(0);
  };
  surface?.addEventListener("pointermove", pointer);
  surface?.addEventListener("pointerleave", reset);
  const render = () => {
    renderer.render(scene, camera);
    host.dataset.sceneReady = "true";
  };
  let visible = false;
  let lost = false;
  const sync = () => {
    gsap.ticker.remove(render);
    if (visible && !document.hidden && !lost) {
      timeline.resume();
      gsap.ticker.add(render);
    } else {
      timeline.pause();
      tiltX.tween.pause();
      tiltY.tween.pause();
    }
  };
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.position.z =
      globeVisual.frameRadius /
      (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
        Math.min(camera.aspect, 1));
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    if (!lost) render();
  });
  resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  intersection.observe(host);
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    delete host.dataset.sceneReady;
    renderer.domElement.style.visibility = "hidden";
    sync();
  };
  const onRestored = () => {
    lost = false;
    renderer.domElement.style.visibility = "visible";
    sync();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.domElement.addEventListener("webglcontextrestored", onRestored);
  document.addEventListener("visibilitychange", sync);
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    resize.disconnect();
    intersection.disconnect();
    document.removeEventListener("visibilitychange", sync);
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
    gsap.ticker.remove(render);
    timeline.kill();
    surface?.removeEventListener("pointermove", pointer);
    surface?.removeEventListener("pointerleave", reset);
    tiltX.tween.kill();
    tiltY.tween.kill();
    disposeGlobe();
    renderer.dispose();
    renderer.domElement.remove();
    delete host.dataset.sceneReady;
  };
}

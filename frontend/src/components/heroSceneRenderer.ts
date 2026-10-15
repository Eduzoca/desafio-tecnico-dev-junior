import * as THREE from "three";
import { gsap } from "gsap";

export function createHeroScene(host: HTMLDivElement): () => void {
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.z = 12;
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.TorusGeometry(1, 0.012, 8, 96);
  const materials = [0xcc213a, 0x0057a5, 0xedc006].map(
    (color) =>
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22 }),
  );
  const rings = materials.map((material, index) => {
    const ring = new THREE.Mesh(geometry, material);
    ring.position.set(
      index === 0 ? -3.4 : index === 1 ? 3.8 : 0.4,
      index === 2 ? -2.5 : 1.1,
      -index,
    );
    ring.scale.setScalar(index === 2 ? 0.6 : 1.9);
    ring.rotation.set(0.4 + index * 0.3, 0.6, index);
    group.add(ring);
    return ring;
  });
  const timeline = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
  rings.forEach((ring, index) => {
    timeline.to(
      ring.rotation,
      { x: "+=0.4", y: "+=0.65", duration: 14 + index * 2, ease: "sine.inOut" },
      0,
    );
    timeline.to(
      ring.position,
      { y: "+=0.3", duration: 14 + index * 2, ease: "sine.inOut" },
      0,
    );
  });
  const render = () => renderer.render(scene, camera);
  let visible = false;
  let lost = false;
  const sync = () => {
    gsap.ticker.remove(render);
    if (visible && !document.hidden && !lost) {
      timeline.resume();
      gsap.ticker.add(render);
    } else timeline.pause();
  };
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
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
    sync();
  };
  const onRestored = () => {
    lost = false;
    sync();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.domElement.addEventListener("webglcontextrestored", onRestored);
  document.addEventListener("visibilitychange", sync);
  return () => {
    resize.disconnect();
    intersection.disconnect();
    document.removeEventListener("visibilitychange", sync);
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
    gsap.ticker.remove(render);
    timeline.kill();
    geometry.dispose();
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}

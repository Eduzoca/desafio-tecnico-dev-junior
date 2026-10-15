import { idiomas } from "../config";
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
  const globe = new THREE.Group();
  globe.position.set(0, 0, 0);
  group.add(globe);
  const geometry = new THREE.TorusGeometry(1.8, 0.009, 6, 96);
  const materials = [
    new THREE.MeshBasicMaterial({
      color: 0x0057a5,
      transparent: true,
      opacity: 0.6,
    }),
  ];
  for (let i = 0; i < 8; i++) {
    const meridian = new THREE.Mesh(geometry, materials[0]);
    meridian.rotation.y = (i * Math.PI) / 8;
    globe.add(meridian);
  }
  for (const latitude of [-0.65, -0.35, 0, 0.35, 0.65]) {
    const ring = new THREE.Mesh(geometry, materials[0]);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = latitude * 1.8;
    ring.scale.setScalar(Math.sqrt(1 - latitude * latitude));
    globe.add(ring);
  }
  globe.rotation.z = -0.18;
  const textures: THREE.CanvasTexture[] = [];
  const labels: THREE.SpriteMaterial[] = [];
  idiomas.forEach(({ saudacao: text, cor }, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 160;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = cor;
    context.beginPath();
    context.roundRect(8, 8, 368, 126, 30);
    context.fill();
    context.beginPath();
    context.moveTo(65, 130);
    context.lineTo(65, 156);
    context.lineTo(95, 130);
    context.fill();
    context.font = "bold 55px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.fillText(text, 192, 72);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
    });
    labels.push(material);
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.65, 0.69, 1);
    sprite.position.set(
      index === 1 ? 1.6 : -1.65,
      index === 0 ? 1.2 : index === 1 ? 0.2 : -1.25,
      1,
    );
    globe.add(sprite);
  });
  const timeline = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
  timeline.to(
    globe.rotation,
    { y: 0.35, x: 0.12, duration: 14, ease: "sine.inOut" },
    0,
  );
  timeline.to(globe.position, { y: 0.12, duration: 14, ease: "sine.inOut" }, 0);
  const tiltX = gsap.quickTo(group.rotation, "x", {
    duration: 0.9,
    ease: "power2.out",
  });
  const tiltY = gsap.quickTo(group.rotation, "y", {
    duration: 0.9,
    ease: "power2.out",
  });
  const surface = host;
  const pointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || !visible || document.hidden || lost)
      return;
    const bounds = host.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    tiltX(
      Math.max(
        -0.15,
        Math.min(
          0.15,
          ((event.clientY - bounds.top) / bounds.height) * 0.3 - 0.15,
        ),
      ),
    );
    tiltY(
      Math.max(
        -0.2,
        Math.min(
          0.2,
          ((event.clientX - bounds.left) / bounds.width) * 0.4 - 0.2,
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
    camera.position.z =
      3.1 /
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
    surface?.removeEventListener("pointermove", pointer);
    surface?.removeEventListener("pointerleave", reset);
    tiltX.tween.kill();
    tiltY.tween.kill();
    geometry.dispose();
    textures.forEach((texture) => texture.dispose());
    labels.forEach((material) => material.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}

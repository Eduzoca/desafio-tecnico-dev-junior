import * as THREE from "three";
import { idiomas } from "../config";
import { globeVisual } from "./globeVisual";
function createGreetings(globe: THREE.Group) {
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
      opacity: globeVisual.labelOpacity,
      depthTest: false,
    });
    labels.push(material);
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(globeVisual.labelWidth, globeVisual.labelHeight, 1);
    sprite.position.set(
      index === 1 ? 1.25 : -1.25,
      index === 0 ? 1.2 : index === 1 ? 0.2 : -1.2,
      0.5,
    );
    globe.add(sprite);
  });
  return () => {
    textures.forEach((texture) => texture.dispose());
    labels.forEach((material) => material.dispose());
  };
}
export function createGlobe() {
  const globe = new THREE.Group();
  globe.position.set(0, 0, 0);

  const geometry = new THREE.TorusGeometry(
    globeVisual.radius,
    globeVisual.lineWidth,
    6,
    96,
  );
  const materials = [
    new THREE.MeshBasicMaterial({
      color: globeVisual.color,
      transparent: true,
      opacity: globeVisual.lineOpacity,
    }),
  ];
  for (let i = 0; i < globeVisual.meridians; i++) {
    const meridian = new THREE.Mesh(geometry, materials[0]);
    meridian.rotation.y = (i * Math.PI) / globeVisual.meridians;
    globe.add(meridian);
  }
  for (const latitude of globeVisual.latitudes) {
    const ring = new THREE.Mesh(geometry, materials[0]);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = latitude * globeVisual.radius;
    ring.scale.setScalar(Math.sqrt(1 - latitude * latitude));
    globe.add(ring);
  }
  globe.rotation.z = -0.18;
  const disposeGreetings = createGreetings(globe);
  return {
    globe,
    dispose() {
      disposeGreetings();
      geometry.dispose();
      materials.forEach((material) => material.dispose());
    },
  };
}

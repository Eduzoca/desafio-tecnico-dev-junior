import { globeVisual } from "./globeVisual";
export function cameraDistance(aspect: number): number {
  const verticalAngle = (globeVisual.cameraFov * Math.PI) / 360;
  const horizontalAngle = Math.atan(Math.tan(verticalAngle) * aspect);

  return (
    globeVisual.frameRadius / Math.sin(Math.min(verticalAngle, horizontalAngle))
  );
}

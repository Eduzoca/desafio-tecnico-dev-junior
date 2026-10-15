import { Globe } from "lucide-react";
import { useEffect, useRef } from "react";

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (
      !host ||
      !window.matchMedia ||
      !window.WebGL2RenderingContext ||
      !window.ResizeObserver ||
      !window.IntersectionObserver
    )
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let generation = 0;
    let cleanup: (() => void) | undefined;
    const update = () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (preference.matches) return;
      void import("./heroSceneRenderer")
        .then(({ createHeroScene }) => {
          if (!disposed && current === generation)
            cleanup = createHeroScene(host, host.closest("main") ?? host);
        })
        .catch(() => {});
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      disposed = true;
      generation++;
      preference.removeEventListener("change", update);
      cleanup?.();
    };
  }, []);
  return (
    <div className="hero-scene" ref={ref} aria-hidden="true">
      <Globe className="globe-fallback" strokeWidth={0.75} />
    </div>
  );
}

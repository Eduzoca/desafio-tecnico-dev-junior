import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { GB, ES, FR } from "country-flag-icons/react/3x2";
import { idiomas } from "../config";
const flags = { GB, ES, FR };
export function LanguageOption({
  idioma,
  selecionado,
}: {
  idioma: string;
  selecionado: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const config = idiomas.find((item) => item.nome === idioma);
  const Flag = config ? flags[config.pais] : null;
  useEffect(() => {
    if (!selecionado || !window.matchMedia) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const icon = root.current?.querySelector("svg");
      const glow = root.current?.querySelector(".language-shine");
      if (icon)
        gsap.fromTo(
          icon,
          { rotation: -8, y: 2 },
          { rotation: 0, y: 0, duration: 0.4, ease: "back.out(2)" },
        );
      if (glow)
        gsap.fromTo(
          glow,
          { xPercent: -160, opacity: 0.7 },
          { xPercent: 160, opacity: 0, duration: 0.65, ease: "power2.out" },
        );
    });
    return () => media.revert();
  }, [selecionado]);
  return (
    <span className="language-option" ref={root}>
      <i className="language-shine" aria-hidden="true" />
      {Flag && <Flag aria-hidden="true" className="language-flag" />}
      {idioma}
    </span>
  );
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { GB, ES, FR } from "country-flag-icons/react/3x2";
import { idiomas } from "../config";
const flags = { GB, ES, FR };
export function LanguageOption({
  idioma,
  selecionado,
  cliques,
}: {
  idioma: string;
  selecionado: boolean;
  cliques: number;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const config = idiomas.find((item) => item.nome === idioma);
  const Flag = config ? flags[config.pais] : null;
  useEffect(() => {
    if (!selecionado || !window.matchMedia) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const icon = root.current?.querySelector(".language-flag");
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
  useEffect(() => {
    if (!cliques || !window.matchMedia) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const bandeiras = root.current?.querySelectorAll(".language-mini-flag");
      if (!bandeiras) return;
      gsap.fromTo(
        bandeiras,
        { x: 0, y: 8, opacity: 1, scale: 0.65, rotation: 0 },
        {
          x: (i: number) => (i - 1) * 16,
          y: -14,
          opacity: 0,
          scale: 1,
          rotation: (i: number) => (i - 1) * 20,
          duration: 0.5,
          ease: "power2.out",
        },
      );
    });
    return () => media.revert();
  }, [cliques]);
  return (
    <span className="language-option" ref={root}>
      <i className="language-shine" aria-hidden="true" />
      {Flag && <Flag aria-hidden="true" className="language-flag" />}
      {idioma}
      {Flag && (
        <i className="language-burst" aria-hidden="true">
          {Array.from({ length: 3 }, (_, i) => (
            <Flag key={i} className="language-mini-flag" />
          ))}
        </i>
      )}
    </span>
  );
}

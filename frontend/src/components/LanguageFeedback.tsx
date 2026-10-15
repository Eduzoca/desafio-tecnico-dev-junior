import { useEffect, useRef } from "react";
import { gsap } from "gsap";
function Flag({ idioma }: { idioma: string }) {
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true">
      {idioma === "Francês" ? (
        <>
          <path fill="#fff" d="M0 0h60v40H0z" />
          <path fill="#002395" d="M0 0h20v40H0z" />
          <path fill="#ed2939" d="M40 0h20v40H40z" />
        </>
      ) : idioma === "Espanhol" ? (
        <>
          <path fill="#aa151b" d="M0 0h60v40H0z" />
          <path fill="#f1bf00" d="M0 10h60v20H0z" />
        </>
      ) : (
        <>
          <path fill="#012169" d="M0 0h60v40H0z" />
          <path stroke="#fff" strokeWidth="9" d="m0 0 60 40M60 0 0 40" />
          <path stroke="#c8102e" strokeWidth="3" d="m0 0 60 40M60 0 0 40" />
          <path stroke="#fff" strokeWidth="13" d="M30 0v40M0 20h60" />
          <path stroke="#c8102e" strokeWidth="7" d="M30 0v40M0 20h60" />
        </>
      )}
    </svg>
  );
}
export function LanguageFeedback({ idioma }: { idioma: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const flags = root.current?.querySelectorAll(".flying-flag");
      if (!flags) return;
      gsap.fromTo(
        flags,
        { x: 0, y: 0, opacity: 0, scale: 0.5, rotation: 0 },
        {
          x: (i: number) => (i - 2) * 52,
          y: (i: number) => -60 - (2 - Math.abs(i - 2)) * 18,
          opacity: 1,
          scale: 1,
          rotation: (i: number) => (i - 2) * 13,
          duration: 0.6,
          stagger: 0.045,
          ease: "power2.out",
        },
      );
      gsap.to(flags, {
        opacity: 0,
        y: "-=20",
        duration: 0.45,
        delay: 1.1,
        stagger: 0.04,
      });
    });
    return () => media.revert();
  }, [idioma]);
  return (
    <div className="language-feedback" ref={root}>
      <span className="language-current">
        <Flag idioma={idioma} />
        <span role="status">{idioma} selecionado</span>
      </span>
      <span className="flag-flight" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span className="flying-flag" key={i}>
            <Flag idioma={idioma} />
          </span>
        ))}
      </span>
    </div>
  );
}

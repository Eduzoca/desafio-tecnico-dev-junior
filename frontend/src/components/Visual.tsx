import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { Star } from "lucide-react";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia || !window.IntersectionObserver) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const animation = gsap.fromTo(
        element,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay,
          ease: "power3.out",
          paused: true,
          clearProps: "opacity,transform",
        },
      );
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animation.play();
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(element);
      return () => observer.disconnect();
    });
    return () => media.revert();
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
export function Stars() {
  return (
    <span className="stars" aria-label="5 estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden="true" />
      ))}
    </span>
  );
}

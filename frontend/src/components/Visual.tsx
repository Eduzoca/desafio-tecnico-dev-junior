import type React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
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

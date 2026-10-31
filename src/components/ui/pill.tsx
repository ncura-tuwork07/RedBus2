import { HTMLAttributes } from "react";

type Tone = "red" | "teal" | "navy" | "white";

// Etiquetas del manual de marca: píldora en mayúsculas, Quicksand Bold, espaciado +0,07 em.
const toneClasses: Record<Tone, string> = {
  red: "bg-primary-500 text-white",
  teal: "bg-turquesa-500 text-white",
  navy: "bg-accent-500 text-white",
  white: "bg-white text-primary-500",
};

export function Pill({
  tone = "red",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.07em] ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}

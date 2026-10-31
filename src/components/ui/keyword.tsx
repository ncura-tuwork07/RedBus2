import { HTMLAttributes } from "react";

type Tone = "red" | "teal" | "navy" | "white";

// "Palabra clave en caja": una palabra del titular sobre una caja de color con esquinas redondeadas.
const toneClasses: Record<Tone, string> = {
  red: "bg-primary-500 text-white",
  teal: "bg-turquesa-500 text-white",
  navy: "bg-accent-500 text-white",
  white: "bg-white text-accent-500",
};

export function Keyword({
  tone = "red",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={`inline-block rounded-[0.28em] px-[0.22em] pb-[0.04em] leading-[1.15] ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}

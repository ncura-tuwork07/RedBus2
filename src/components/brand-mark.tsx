import Image from "next/image";

// Lockup chico para encabezados: el manual manda usar el monograma RB cuando el isologo
// bajaría de 120 px (ahí el nombre del aro deja de leerse). "School of English" va siempre pegado al nombre.
export function BrandMark({
  tone = "dark",
  size = 40,
  className = "",
}: {
  tone?: "dark" | "light";
  size?: number;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/monograma-rb.png"
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-[10px]"
        style={{ width: size, height: size }}
      />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[17px] font-extrabold tracking-tight ${dark ? "text-accent-500" : "text-white"}`}>
          RED BUS
        </span>
        <span className={`mt-1 text-[10px] font-bold uppercase tracking-[0.12em] ${dark ? "text-primary-500" : "text-celeste-200"}`}>
          School of English
        </span>
      </span>
    </span>
  );
}

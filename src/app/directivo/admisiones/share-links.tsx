"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-button";
import { BRAND } from "@/lib/brand";

const LINKS = [
  { label: "Formulario completo", detalle: "El que elige entre alumno nuevo y reinscripción", path: "/admisiones" },
  { label: "Solo alumnos nuevos", detalle: "Abre directo la inscripción", path: "/admisiones?tipo=nuevo" },
  { label: "Solo reinscripción 2027", detalle: "Abre directo la reinscripción de alumnos actuales", path: "/admisiones?tipo=reinscripcion" },
];

export function ShareLinks() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 2000);
    } catch {
      window.prompt("Copiá este enlace:", url);
    }
  }

  return (
    <section className="mb-6 rounded-[20px] border border-neutral-200 bg-white p-5 shadow-sm" aria-labelledby="share-title">
      <h2 id="share-title" className="flex items-center gap-2 text-base font-bold text-accent-500">
        <Link2 className="h-5 w-5" aria-hidden="true" /> Enlaces para compartir
      </h2>
      <p className="mt-1 text-sm text-neutral-600">Mandá solo el formulario, sin la web. Al terminar, la familia vuelve sola a la web oficial.</p>
      <ul className="mt-4 space-y-3">
        {LINKS.map((l) => {
          const url = `${origin}${l.path}`;
          const share = `https://wa.me/?text=${encodeURIComponent(`Completá el formulario de inscripción 2027 de ${BRAND.name}: ${url}`)}`;
          return (
            <li key={l.path} className="flex flex-wrap items-center gap-3 rounded-[14px] bg-neutral-100 px-4 py-3">
              <div className="min-w-[200px] flex-1">
                <p className="text-sm font-bold text-neutral-900">{l.label}</p>
                <p className="break-all text-xs text-neutral-600">{origin ? url : l.path}</p>
                <p className="text-xs text-neutral-500">{l.detalle}</p>
              </div>
              <button
                type="button"
                onClick={() => copy(url)}
                className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-neutral-200 bg-white px-3.5 py-1.5 text-sm font-bold text-neutral-800 hover:bg-neutral-50"
              >
                {copied === url ? <Check className="h-4 w-4 text-success-700" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied === url ? "Copiado" : "Copiar"}
              </button>
              <a
                href={share}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1fa855] px-3.5 py-1.5 text-sm font-bold text-white hover:bg-[#188a45]"
              >
                <WhatsAppIcon className="h-4 w-4" /> Compartir
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

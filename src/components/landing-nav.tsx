"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { BrandMark } from "@/components/brand-mark";

const links = [
  { label: "Cursos", href: "#cursos" },
  { label: "Quiénes somos", href: "#quienes-somos" },
  { label: "Galería", href: "#galeria" },
  { label: "Sedes y contacto", href: "#contacto" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-100/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Red Bus School of English, inicio">
          <BrandMark size={44} />
        </Link>

        <nav className="hidden items-center gap-8 text-[15px] font-semibold text-accent-500 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-primary-500">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LinkButton href="/login" variant="secondary">
            Ingresar al portal
          </LinkButton>
          <LinkButton href="#contacto" variant="primary">
            Inscribirme
          </LinkButton>
        </div>

        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-accent-500 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-neutral-100 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-[15px] font-semibold text-accent-500">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <LinkButton href="/login" variant="secondary" className="w-full">
              Ingresar al portal
            </LinkButton>
            <LinkButton href="#contacto" variant="primary" className="w-full" onClick={() => setOpen(false)}>
              Inscribirme
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}

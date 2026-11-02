import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { AdmisionForm } from "./admision-form";
import type { AdmisionTipo } from "@/lib/admisiones";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Inscripción y reinscripción 2027",
  description: `Formulario de inscripción para alumnos nuevos y reinscripción 2027 de ${BRAND.name}.`,
  robots: { index: false, follow: false },
};

export default async function AdmisionesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo } = await searchParams;
  const initialTipo: AdmisionTipo | null = tipo === "nuevo" ? "nuevo" : tipo === "reinscripcion" ? "reinscripcion" : null;

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="bg-accent-500 text-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" aria-label={`${BRAND.name}, sitio oficial`}>
            <BrandMark tone="light" size={40} />
          </Link>
          <Link href="/" className="text-sm font-bold text-celeste-200 hover:underline">
            Ir al sitio →
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-4">
          <p className="inline-flex rounded-full bg-primary-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.07em]">
            Ciclo lectivo 2027
          </p>
          <h1 className="font-display mt-4 text-[clamp(26px,5vw,40px)] font-extrabold leading-[1.15]">
            Inscripción y reinscripción
          </h1>
          <p className="mt-3 max-w-[520px] text-accent-100">
            Completá el formulario y te escribimos por WhatsApp para confirmar la vacante. Lleva unos 3 minutos.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <div className="-mt-4 rounded-[24px] bg-white p-5 shadow-lg sm:p-8">
          <AdmisionForm initialTipo={initialTipo} />
        </div>
      </main>
    </div>
  );
}

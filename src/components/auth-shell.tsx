import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { LinkButton } from "@/components/ui/link-button";

// Marco común de las pantallas de acceso: encabezado con la marca y una tarjeta centrada.
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="flex h-16 items-center justify-between px-4">
        <Link href="/" aria-label="Red Bus School of English, inicio">
          <BrandMark size={44} />
        </Link>
        <LinkButton href="/login" variant="secondary">
          ← Volver a ingresar
        </LinkButton>
      </header>
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-[24px] bg-white p-8 shadow-lg">{children}</div>
      </div>
    </div>
  );
}

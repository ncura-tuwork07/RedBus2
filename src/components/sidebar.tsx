"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, LayoutDashboard, BarChart3, Camera, Users, School, UserPlus, Wallet, Receipt, LucideIcon } from "lucide-react";

const directivoExtras = [
  { label: "Alumnos", href: "/directivo/alumnos", icon: Users },
  { label: "Admisiones", href: "/directivo/admisiones", icon: UserPlus },
  { label: "Docentes", href: "/directivo/docentes", icon: GraduationCap },
  { label: "Aulas", href: "/directivo/aulas", icon: School },
  { label: "Pagos", href: "/directivo/pagos", icon: Wallet },
  { label: "Gastos", href: "/directivo/gastos", icon: Receipt },
  { label: "Galería", href: "/directivo/galeria", icon: Camera },
  { label: "Reportes", href: "/directivo/reportes", icon: BarChart3 },
];

type Role = "ALUMNO" | "DOCENTE" | "DIRECTIVO";

const roleNav: Record<Role, { label: string; href: string; icon: LucideIcon }> = {
  DIRECTIVO: { label: "Panel de Dirección", href: "/directivo", icon: LayoutDashboard },
  DOCENTE: { label: "Mis aulas", href: "/docente", icon: BookOpen },
  ALUMNO: { label: "Mi panel", href: "/alumno", icon: GraduationCap },
};

const roleOrder: Role[] = ["DIRECTIVO", "DOCENTE", "ALUMNO"];

function navLinkClass(active: boolean) {
  return `relative flex items-center gap-3 rounded-md border-l-[3px] px-3 py-2.5 text-sm transition-colors ${
    active
      ? "border-primary-500 bg-white/8 font-semibold text-white"
      : "border-transparent text-accent-100 hover:bg-white/8 hover:text-white"
  }`;
}

export function Sidebar({ roles, onNavigate }: { roles: Role[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = roleOrder.filter((r) => roles.includes(r)).map((r) => roleNav[r]);

  return (
    <div className="flex h-full w-[232px] flex-col gap-1 bg-accent-600 p-3.5">
      <div className="px-2.5 pb-5 pt-1.5">
        <BrandMark tone="light" size={38} />
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          // "/directivo" es la raíz de todas las pantallas de dirección: solo cuenta como activa en su propia página
          const active = item.href === "/directivo" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={navLinkClass(active)}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        {roles.includes("DIRECTIVO") &&
          directivoExtras.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={navLinkClass(active)}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </div>
  );
}

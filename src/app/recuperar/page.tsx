"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Spinner } from "@/components/ui/spinner";

export default function RecuperarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", dni: "", phone: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/auth/activar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "No se pudo guardar la contraseña.");
      return;
    }
    router.push("/login");
  }

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
        <div className="w-full max-w-sm rounded-[24px] bg-white p-8 shadow-lg">
          <h2 className="font-display text-center text-lg font-extrabold text-accent-500">Activar cuenta / recuperar acceso</h2>
          <p className="mt-1 text-center text-sm text-neutral-500">
            Ingresá los datos con los que te dieron de alta en el instituto y elegí tu contraseña.
          </p>

          {error && (
            <div role="alert" className="mt-4 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" required value={form.dni} onChange={(e) => set("dni", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="11 2233 4455"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Nueva contraseña</Label>
              <PasswordInput
                id="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              {saving && <Spinner className="mr-2" />}
              {saving ? "Guardando…" : "Guardar contraseña"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

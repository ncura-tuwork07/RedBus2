"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export default function OlvidePage() {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/auth/olvide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setSaving(false);
    if (!res) {
      setError("No pudimos conectarnos. Probá de nuevo.");
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "No se pudo enviar el pedido.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-turquesa-50 text-turquesa-700">
            <MailCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="font-display mt-4 text-lg font-extrabold text-accent-500">Revisá tu correo</h1>
          <p className="mt-2 text-sm text-neutral-700">
            Si <strong>{email.trim()}</strong> está registrado, en un momento te llega un enlace para elegir una contraseña nueva. Vale por 1 hora.
          </p>
          <p className="mt-3 text-xs text-neutral-600">¿No aparece? Mirá en spam o correo no deseado.</p>
        </div>
      ) : (
        <>
          <h1 className="font-display text-center text-lg font-extrabold text-accent-500">¿Olvidaste tu contraseña?</h1>
          <p className="mt-1 text-center text-sm text-neutral-600">
            Ingresá el email de tu cuenta y te mandamos un enlace para elegir una nueva.
          </p>

          {error && (
            <div role="alert" className="mt-4 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              {saving && <Spinner className="mr-2" />}
              {saving ? "Enviando…" : "Enviar enlace"}
            </Button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

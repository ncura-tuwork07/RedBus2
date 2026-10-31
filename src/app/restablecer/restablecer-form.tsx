"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { LinkButton } from "@/components/ui/link-button";
import { Spinner } from "@/components/ui/spinner";

const MIN_LENGTH = 8;

export function RestablecerForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (password.length < MIN_LENGTH) {
      setError(`La contraseña tiene que tener al menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/auth/restablecer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }).catch(() => null);
    setSaving(false);
    if (!res) {
      setError("No pudimos conectarnos. Probá de nuevo.");
      return;
    }
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "No se pudo guardar la contraseña.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="font-display mt-4 text-lg font-extrabold text-accent-500">Contraseña actualizada</h1>
        <p className="mt-2 text-sm text-neutral-700">Ya podés ingresar con tu contraseña nueva.</p>
        <LinkButton href="/login" variant="primary" size="lg" className="mt-6 w-full">
          Ingresar
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-center text-lg font-extrabold text-accent-500">Elegí tu nueva contraseña</h1>
      <p className="mt-1 text-center text-sm text-neutral-600">Mínimo {MIN_LENGTH} caracteres.</p>

      {error && (
        <div role="alert" className="mt-4 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña nueva</Label>
          <PasswordInput
            id="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Repetí la contraseña</Label>
          <PasswordInput
            id="confirm"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full">
          {saving && <Spinner className="mr-2" />}
          {saving ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        <Link href="/login" className="font-bold text-primary-500 hover:underline">
          Cancelar
        </Link>
      </p>
    </>
  );
}

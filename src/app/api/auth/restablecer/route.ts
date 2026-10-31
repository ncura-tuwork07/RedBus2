import { NextResponse } from "next/server";
import { MIN_PASSWORD_LENGTH, resetPasswordWithToken } from "@/lib/password-reset-token";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` },
      { status: 400 },
    );
  }

  try {
    const result = await resetPasswordWithToken(token, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("No se pudo restablecer la contraseña", error);
    return NextResponse.json(
      { error: "No pudimos guardar la contraseña. Probá de nuevo en unos minutos." },
      { status: 500 },
    );
  }
}

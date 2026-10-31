import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/password-reset-token";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email : "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 });
  }

  const clientKey = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "desconocida";
  try {
    await requestPasswordReset(email, clientKey);
  } catch (error) {
    console.error("No se pudo procesar el pedido de restablecimiento", error);
  }

  // la misma respuesta exista o no la cuenta
  return NextResponse.json({ ok: true });
}

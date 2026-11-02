import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseAdmision } from "@/lib/admisiones";
import { checkRateLimit } from "@/lib/rate-limit";

// Recibe el formulario público de /admisiones (inscripción nueva o reinscripción 2027).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const parsed = parseAdmision(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { data, edad } = parsed;

  // Un bot completa todos los campos; una persona no ve este. Se responde "ok" sin guardar nada.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const clientKey = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "desconocida";
  const allowed = await checkRateLimit(`admision-ip:${clientKey}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Enviaste varias solicitudes seguidas. Probá de nuevo en unos minutos." },
      { status: 429 },
    );
  }

  // Persona a quien se contacta: el responsable si el alumno es menor; el propio alumno si es mayor.
  const esMenor = edad < 18;
  const contacto = esMenor
    ? data.responsable1
    : {
        nombre: `${data.alumno.nombre} ${data.alumno.apellido}`,
        telefono: data.alumno.telefono,
        email: data.alumno.email,
      };
  const { website: _website, ...detalle } = data;
  void _website;

  try {
    await prisma.lead.create({
      data: {
        name: contacto.nombre,
        phone: contacto.telefono,
        email: contacto.email || null,
        interest: data.cursada.curso || data.actual.situacion,
        message: data.comentarios || null,
        kind: data.tipo === "reinscripcion" ? "REINSCRIPCION" : "INSCRIPCION",
        consentAt: new Date(),
        details: { ...detalle, edad, origen: "formulario-admisiones" } as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("No se pudo guardar la solicitud de admisión", error);
    return NextResponse.json(
      { error: "No pudimos guardar tu solicitud. Probá de nuevo en unos minutos o escribinos por WhatsApp." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

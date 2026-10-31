// Envío de correo con Resend (API REST, sin dependencia extra).
// Variables: RESEND_API_KEY y EMAIL_FROM (ej. "Red Bus School of English <no-reply@tuwork.com.ar>"),
// el remitente tiene que pertenecer a un dominio verificado en Resend.

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail({ to, subject, html, text }: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error("Email no configurado: faltan RESEND_API_KEY o EMAIL_FROM");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });
    if (!res.ok) {
      console.error("Resend rechazó el envío", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("No se pudo contactar a Resend", error);
    return false;
  }
}

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { BrandMark } from "@/components/brand-mark";
import { Input, Label } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";

async function login(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=1");
    }
    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="flex h-16 items-center justify-between px-4">
        <Link href="/" aria-label="Red Bus School of English, inicio">
          <BrandMark size={44} />
        </Link>
        <LinkButton href="/" variant="secondary">
          ← Volver al sitio
        </LinkButton>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-[24px] bg-white p-8 shadow-lg">
          <Image
            src="/brand/isologo.png"
            alt="Red Bus School of English"
            width={128}
            height={128}
            priority
            className="mx-auto h-32 w-32"
          />
          <h2 className="font-display mt-5 text-center text-xl font-extrabold text-accent-500">Ingresá a tu cuenta</h2>
          <p className="mt-1 text-center text-sm text-neutral-600">Portal de alumnos, docentes y dirección.</p>

          {error && (
            <div role="alert" className="mt-4 rounded-lg bg-danger-50 px-3.5 py-2.5 text-sm text-danger-700">
              Email o contraseña incorrectos.
            </div>
          )}

          <form action={login} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/olvide" className="text-xs font-bold text-primary-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <PasswordInput id="password" name="password" required autoComplete="current-password" />
            </div>
            <SubmitButton variant="primary" size="lg" className="w-full" pendingText="Ingresando…">
              Ingresar
            </SubmitButton>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-500">
            ¿Primera vez que entrás?{" "}
            <Link href="/recuperar" className="font-medium text-primary-500 hover:underline">
              Activá tu cuenta y elegí tu contraseña
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

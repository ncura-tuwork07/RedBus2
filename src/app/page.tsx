import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  Heart,
  Landmark,
  MapPin,
  MessageCircle,
  Rocket,
  School,
  Smile,
  Baby,
  type LucideIcon,
} from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { CountUp } from "@/components/ui/count-up";
import { LinkButton } from "@/components/ui/link-button";
import { Pill } from "@/components/ui/pill";
import { Keyword } from "@/components/ui/keyword";
import { LeadForm } from "./lead-form";
import {
  APOYO,
  BRAND,
  CERTIFICACION,
  CURSOS,
  INSTAGRAM,
  MESES,
  SEDES,
  WHATSAPP,
  mapsEmbed,
  mapsLink,
  whatsappLink,
} from "@/lib/brand";

const cursoIconos: LucideIcon[] = [Baby, School, GraduationCap, Rocket];
const cursoTonos = [
  "bg-primary-50 text-primary-500",
  "bg-turquesa-50 text-turquesa-700",
  "bg-accent-50 text-accent-500",
  "bg-celeste-100 text-accent-500",
];

const personalidad: { titulo: string; texto: string; icon: LucideIcon }[] = [
  { titulo: "Cercana", texto: "Hablamos de vos, explicamos fácil y celebramos cada avance.", icon: Heart },
  { titulo: "Alegre", texto: "Colores vivos, humor y juegos para aprender sin miedo.", icon: Smile },
  {
    titulo: "Con acento británico",
    texto: "Londres como universo: colectivo rojo, Big Ben, cabina de teléfono y té.",
    icon: Landmark,
  },
];

// Fotos de ambientación en el estilo del manual (celular, luz cálida, Londres).
// Se usan solo mientras la galería del portal esté vacía; cuando haya fotos reales de las sedes, las reemplazan.
const fotosMarca = [
  { url: "/brand/fotos/colectivo.jpg", caption: "Colectivo rojo de dos pisos en una calle de Londres" },
  { url: "/brand/fotos/bigben.jpg", caption: "El Big Ben al atardecer" },
  { url: "/brand/fotos/cabina.jpg", caption: "Cabina de teléfono roja" },
  { url: "/brand/fotos/cuadernos.jpg", caption: "Cuadernos, lápices y una taza de té sobre el escritorio" },
  { url: "/brand/fotos/te.jpg", caption: "Taza de té con galletitas y un cuaderno" },
  { url: "/brand/fotos/london-eye.jpg", caption: "El London Eye iluminado" },
];

// Mosaico para un ciclo de 6 fotos que llena 4 columnas x 3 filas sin huecos: una grande, dos chicas y tres anchas.
const gallerySpans = ["col-span-2 row-span-2", "", "", "col-span-2", "col-span-2", "col-span-2"];

export const dynamic = "force-dynamic";

// La portada es pública: si la base de datos no responde, se muestra igual con el contenido de marca.
async function cargarDatos() {
  try {
    const [alumnos, docentes, images, testimonials] = await Promise.all([
      prisma.studentProfile.count(),
      prisma.teacherProfile.count(),
      prisma.siteImage.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    ]);
    return { alumnos, docentes, images, testimonials };
  } catch (error) {
    console.error("Portada: no se pudo leer la base de datos, se muestra contenido de marca", error);
    return {
      alumnos: 0,
      docentes: 0,
      images: [] as { id: string; url: string; caption: string | null }[],
      testimonials: [] as { id: string; quote: string; author: string }[],
    };
  }
}

export default async function Home() {
  const { alumnos, docentes, images, testimonials } = await cargarDatos();

  const gallery =
    images.length > 0
      ? images.map((img) => ({ url: img.url, caption: img.caption ?? BRAND.name }))
      : fotosMarca;
  const heroImage = images[0]?.url ?? fotosMarca[0].url;
  const heroAlt = images[0] ? (images[0].caption ?? BRAND.name) : fotosMarca[0].caption;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: BRAND.name,
    description: "Escuela de inglés en José C. Paz: cursos anuales para chicos, adolescentes y adultos, y clases de apoyo escolar.",
    url: BRAND.siteUrl,
    telephone: "+54 9 11 3598-5287",
    sameAs: [INSTAGRAM.url],
    address: SEDES.map((s) => ({
      "@type": "PostalAddress",
      streetAddress: s.direccion,
      addressLocality: "José C. Paz",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    })),
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-accent-500 text-white">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-white/5" />
          <div aria-hidden="true" className="absolute -bottom-40 -left-24 h-[360px] w-[360px] rounded-full bg-white/5" />

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20">
            <div>
              <Pill tone="red">Inscripciones 2027 abiertas</Pill>
              <h1 className="font-display mt-5 text-[clamp(32px,4.8vw,56px)] font-extrabold leading-[1.12]">
                Aprendé inglés con <Keyword tone="red">confianza</Keyword>
              </h1>
              <p className="mt-5 max-w-[500px] text-lg text-accent-100">
                Cursos anuales de marzo a diciembre para chicos, adolescentes y adultos, y clases de apoyo escolar en{" "}
                {BRAND.city}.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <LinkButton href="/admisiones" variant="primary" size="lg">
                  Inscribirme 2027
                </LinkButton>
                <LinkButton href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="white" size="lg">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  WhatsApp {WHATSAPP.display}
                </LinkButton>
                <Link href="/login" className="text-base font-bold text-celeste-200 hover:underline">
                  Ya soy alumno, ingresar →
                </Link>
              </div>

              <ul className="mt-10 grid max-w-[520px] gap-3 text-sm font-semibold text-accent-100 sm:grid-cols-3">
                <li className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 shrink-0 text-celeste-200" aria-hidden="true" />
                  De marzo a diciembre
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-celeste-200" aria-hidden="true" />
                  Dos sedes en {BRAND.city}
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-celeste-200" aria-hidden="true" />
                  Cursos con certificación
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] md:max-w-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={heroAlt}
                fetchPriority="high"
                className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-lg"
              />
              <div className="absolute -bottom-7 -left-3 rounded-full bg-white p-1.5 shadow-lg sm:-left-6">
                <Image
                  src="/brand/isologo.png"
                  alt={BRAND.name}
                  width={132}
                  height={132}
                  className="h-[120px] w-[120px] sm:h-[132px] sm:w-[132px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cursos */}
        <section id="cursos" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Pill tone="teal">Cursos 2027</Pill>
          <h2 className="font-display mt-4 max-w-[640px] text-[clamp(26px,3.4vw,40px)] font-extrabold text-accent-500">
            Un curso para <Keyword tone="teal">cada edad</Keyword>
          </h2>
          <p className="mt-4 max-w-[560px] text-lg text-neutral-700">
            Cursos anuales de marzo a diciembre. Consultá por WhatsApp horarios y vacantes de cada sede.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CURSOS.map((curso, i) => {
              const Icon = cursoIconos[i];
              return (
                <article key={curso.titulo} className="rounded-[24px] bg-white p-6 shadow-sm">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${cursoTonos[i]}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-accent-500">{curso.titulo}</h3>
                  <p className="mt-1 text-neutral-700">{curso.detalle}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 items-center gap-6 rounded-[24px] bg-accent-500 p-7 text-white md:grid-cols-[1fr_auto] md:p-9">
            <div>
              <Pill tone="white">Clases de apoyo</Pill>
              <h3 className="mt-3 text-2xl font-bold">{APOYO.titulo}</h3>
              <p className="mt-2 max-w-[560px] text-accent-100">{APOYO.detalle}</p>
            </div>
            <LinkButton href={whatsappLink("¡Hola! Quiero consultar por las clases de apoyo escolar.")} target="_blank" rel="noopener noreferrer" variant="white" size="lg">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Consultar
            </LinkButton>
          </div>

          <div className="mt-10">
            <p className="text-sm font-bold uppercase tracking-[0.07em] text-neutral-600">El año de cursada</p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Meses de cursada, de marzo a diciembre">
              {MESES.map((mes) => (
                <li
                  key={mes}
                  className={`rounded-[10px] px-3.5 py-2 text-sm font-bold tracking-[0.05em] text-white ${
                    mes === "MAR" || mes === "DIC" ? "bg-primary-500" : "bg-accent-500"
                  }`}
                >
                  {mes}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Certificación */}
        <section className="bg-white py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:text-left">
            <Image
              src="/brand/sello-iscb.png"
              alt={`Sello del ${CERTIFICACION}`}
              width={120}
              height={144}
              className="h-[115px] w-[96px] shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold text-accent-500">Cursos con certificación</h2>
              <p className="mt-1 max-w-[640px] text-neutral-700">
                Los cursos anuales cuentan con certificación del {CERTIFICACION}.
              </p>
            </div>
          </div>
        </section>

        {/* Quiénes somos */}
        <section id="quienes-somos" className="bg-celeste-100 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1.1fr]">
              <div>
                <Pill tone="red">Quiénes somos</Pill>
                <h2 className="font-display mt-4 text-[clamp(26px,3.4vw,40px)] font-extrabold text-accent-500">
                  Una escuela de barrio con acento británico
                </h2>
                <p className="mt-5 text-lg text-neutral-700">
                  {BRAND.name} es una escuela de inglés de {BRAND.city} con cursos para chicos, adolescentes y adultos, y
                  clases de apoyo escolar.
                </p>
                <p className="mt-4 text-lg font-bold text-accent-500">{BRAND.tagline}.</p>
                {(alumnos > 0 || docentes > 0) && (
                  <div className="mt-8 flex gap-10">
                    {alumnos > 0 && (
                      <div>
                        <p className="font-display text-[30px] font-extrabold text-primary-500">
                          <CountUp value={alumnos} />
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.07em] text-neutral-600">Alumnos</p>
                      </div>
                    )}
                    {docentes > 0 && (
                      <div>
                        <p className="font-display text-[30px] font-extrabold text-primary-500">
                          <CountUp value={docentes} />
                        </p>
                        <p className="text-xs font-bold uppercase tracking-[0.07em] text-neutral-600">Profesores</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {personalidad.map((p) => (
                  <article key={p.titulo} className="flex items-start gap-4 rounded-[24px] bg-white p-6 shadow-sm">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-primary-50 text-primary-500">
                      <p.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-accent-500">{p.titulo}</h3>
                      <p className="mt-1 text-neutral-700">{p.texto}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 items-center gap-6 rounded-[24px] bg-accent-500 p-7 text-white md:grid-cols-[1fr_auto] md:p-9">
              <div>
                <h3 className="text-2xl font-bold">Seguí tus clases desde el portal</h3>
                <p className="mt-2 max-w-[560px] text-accent-100">
                  Asistencia, tareas, material de clase y pagos en un solo lugar, para que alumnos y familias sepan cómo viene el proceso.
                </p>
              </div>
              <LinkButton href="/login" variant="white" size="lg">
                Ingresar al portal
              </LinkButton>
            </div>
          </div>
        </section>

        {/* Galería */}
        <section id="galeria" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Pill tone="teal">Galería</Pill>
          <h2 className="font-display mt-4 text-[clamp(26px,3.4vw,40px)] font-extrabold text-accent-500">
            Así se vive <Keyword tone="red">Red Bus</Keyword>
          </h2>

          <div className="mt-10 grid auto-rows-[170px] grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.url + i}
                src={img.url}
                alt={img.caption}
                loading="lazy"
                className={`h-full w-full rounded-[18px] object-cover ${gallerySpans[i % gallerySpans.length]}`}
              />
            ))}
          </div>
        </section>

        {/* Testimonios */}
        {testimonials.length > 0 && (
          <section className="bg-white py-16">
            <div className="mx-auto max-w-6xl px-4">
              <Pill tone="navy">Lo que dicen</Pill>
              <h2 className="font-display mt-4 text-[clamp(26px,3.4vw,40px)] font-extrabold text-accent-500">
                Familias que ya nos conocen
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                {testimonials.map((t) => (
                  <figure key={t.id} className="rounded-[24px] bg-neutral-100 p-6">
                    <blockquote className="text-lg font-semibold leading-snug text-accent-500">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="mt-4 text-sm font-bold text-primary-500">{t.author}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sedes y contacto */}
        <section id="contacto" className="py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
            <div>
              <Pill tone="red">Contacto</Pill>
              <h2 className="font-display mt-4 text-[clamp(26px,3.4vw,40px)] font-extrabold text-accent-500">
                ¿Querés <Keyword tone="teal">sumarte</Keyword>?
              </h2>
              <p className="mt-4 text-lg text-neutral-700">
                Dejanos tus datos y te contamos los horarios disponibles y te ayudamos a elegir el curso.
              </p>

              <div className="mt-6">
                <LeadForm />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <LinkButton href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="primary" size="lg">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  WhatsApp {WHATSAPP.display}
                </LinkButton>
                <a
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-accent-500 hover:text-primary-500"
                >
                  <AtSign className="h-5 w-5" aria-hidden="true" />
                  {INSTAGRAM.handle}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {SEDES.map((sede, i) => (
                <article key={sede.nombre} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
                  <iframe
                    title={`Mapa de ${sede.nombre}: ${sede.direccion}`}
                    src={mapsEmbed(sede.mapa)}
                    width="100%"
                    height="170"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  <div className="p-6">
                    <Pill tone={i === 0 ? "navy" : "red"}>{sede.nombre}</Pill>
                    <h3 className="mt-3 text-xl font-bold text-accent-500">{sede.direccion}</h3>
                    <p className="text-neutral-700">{sede.referencia}</p>
                    <a
                      href={mapsLink(sede.mapa)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:underline"
                    >
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      Cómo llegar
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-accent-700 py-12 text-accent-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[auto_1fr_1fr_1fr]">
            <Image src="/brand/isologo-blanco.png" alt={BRAND.name} width={120} height={120} className="h-[120px] w-[120px]" />
            <div>
              <p className="font-bold text-white">Sedes</p>
              <ul className="mt-3 space-y-2 text-sm">
                {SEDES.map((s) => (
                  <li key={s.nombre}>
                    <span className="font-bold text-celeste-200">{s.nombre}:</span> {s.direccion}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-white">Contacto</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    WhatsApp {WHATSAPP.display}
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    Instagram {INSTAGRAM.handle}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white">Enlaces</p>
              <nav className="mt-3 flex flex-col gap-2 text-sm">
                <a href="#cursos" className="hover:text-white">Cursos</a>
                <a href="#quienes-somos" className="hover:text-white">Quiénes somos</a>
                <a href="#galeria" className="hover:text-white">Galería</a>
                <a href="#contacto" className="hover:text-white">Sedes y contacto</a>
                <Link href="/login" className="hover:text-white">Portal</Link>
              </nav>
            </div>
          </div>
          <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs">
            © 2026 {BRAND.name} · {BRAND.city}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Heart,
  FileText,
  Star,
  Users,
  UserPlus,
  Wifi,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import heroDoctor from "@/assets/hero-doctor.jpg";

const SLIDES = [
  {
    badge: "Portal de Salud Digital",
    title: "Tu salud, centralizada y accesible",
    desc: "Agenda citas, consulta tu historial clínico y descarga tus diagnósticos. Todo en un solo lugar.",
  },
  {
    badge: "Médicos verificados",
    title: "Conecta con especialistas de confianza",
    desc: "Encuentra el profesional adecuado según especialidad, disponibilidad y cercanía.",
  },
  {
    badge: "Recetas digitales",
    title: "Tus recetas siempre contigo",
    desc: "Descarga tus recetas en PDF y compártelas con tu farmacia en segundos.",
  },
  {
    badge: "Privacidad garantizada",
    title: "Tus datos médicos, seguros",
    desc: "Solo tú y tu médico acceden a tu historial. Cifrado y control total.",
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const current = SLIDES[slide];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative isolate overflow-hidden">
        <img
          src={heroDoctor}
          alt="Profesional de la salud atendiendo a un paciente"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/55 to-primary/85" />
        <div className="relative mx-auto flex min-h-[520px] max-w-4xl flex-col items-center justify-center gap-5 px-4 py-24 text-center text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <Heart className="h-3.5 w-3.5 fill-current" /> {current.badge}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {current.title}
          </h1>
          <p className="max-w-xl text-base text-white/90 md:text-lg">{current.desc}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/registro"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary shadow-lg transition hover:scale-105"
            >
              Crear cuenta <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              Iniciar sesión
            </Link>
          </div>

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
          {[
            { icon: Users, v: "500+", l: "Pacientes atendidos" },
            { icon: UserPlus, v: "20+", l: "Médicos registrados" },
            { icon: Wifi, v: "100%", l: "Digital" },
          ].map((s) => (
            <div key={s.l} className="flex items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold leading-none">{s.v}</div>
                <div className="text-sm text-white/80">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">¿Qué puedes hacer?</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              title: "Agenda citas",
              desc: "Busca médicos por especialidad y agenda tu cita en segundos.",
            },
            {
              icon: FileText,
              title: "Historial clínico",
              desc: "Tu historial médico completo, seguro y siempre disponible.",
            },
            {
              icon: Star,
              title: "Médicos favoritos",
              desc: "Guarda a tu médico de confianza para agendar más rápido.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-card p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>SaludDigital © {new Date().getFullYear()}</span>
          </div>
          <span>Hecho con cuidado para tu bienestar.</span>
        </div>
      </footer>
    </div>
  );
}

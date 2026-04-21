import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Calendar, FileText, Star, ShieldCheck, Stethoscope } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="container relative mx-auto grid gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> Plataforma médica certificada
            </span>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Tu salud, centralizada y accesible
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/85">
              Agenda citas, consulta tu historial clínico y mantente conectado con los mejores
              médicos. Todo en un solo lugar, simple y seguro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/registro"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-primary shadow-lg transition hover:scale-105"
              >
                Crear cuenta
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {[
                { icon: Stethoscope, label: "Consultas" },
                { icon: Calendar, label: "Agenda" },
                { icon: FileText, label: "Recetas" },
                { icon: Heart, label: "Cuidado" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-white/15 backdrop-blur-md transition hover:bg-white/25"
                >
                  <c.icon className="h-10 w-10" />
                  <span className="font-medium">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-14 md:grid-cols-3">
          {[
            { v: "500+", l: "Pacientes atendidos" },
            { v: "20+", l: "Médicos registrados" },
            { v: "100%", l: "Digital y seguro" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-4xl font-bold text-primary md:text-5xl">{s.v}</div>
              <div className="mt-2 text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">¿Qué puedes hacer?</h2>
          <p className="mt-3 text-muted-foreground">
            Herramientas pensadas para cuidar de ti y tu familia.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Calendar,
              title: "Agenda citas",
              desc: "Reserva una consulta con los mejores especialistas en pocos clics.",
            },
            {
              icon: FileText,
              title: "Historial clínico",
              desc: "Consulta tus recetas y diagnósticos cuando los necesites.",
            },
            {
              icon: Star,
              title: "Médicos favoritos",
              desc: "Guarda a tus médicos de confianza para acceso rápido.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-6 w-6" />
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

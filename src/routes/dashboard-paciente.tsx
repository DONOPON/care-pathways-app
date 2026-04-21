import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, FileText, Star, Plus, Stethoscope } from "lucide-react";
import { Header } from "@/components/Header";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Cita, Receta, User } from "@/lib/types";

export const Route = createFileRoute("/dashboard-paciente")({
  component: () => (
    <RequireAuth role="paciente">
      <PacienteDashboard />
    </RequireAuth>
  ),
});

function PacienteDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"citas" | "recetas">("citas");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setCitas(storage.getCitas().filter((c) => c.pacienteId === user.id));
    setRecetas(storage.getRecetas().filter((r) => r.pacienteId === user.id));
    setDoctors(storage.getUsers().filter((u) => u.role === "doctor"));
    setFavs(storage.getFavoritos()[user.id] ?? []);
  }, [user]);

  if (!user) return null;

  const pendientes = citas.filter((c) => c.estado === "pendiente" || c.estado === "confirmada");
  const favDoctorId = favs[0];
  const favDoctor = doctors.find((d) => d.id === favDoctorId);

  const toggleFav = (doctorId: string) => {
    const all = storage.getFavoritos();
    const cur = all[user.id] ?? [];
    const next = cur.includes(doctorId) ? cur.filter((d) => d !== doctorId) : [...cur, doctorId];
    all[user.id] = next;
    storage.setFavoritos(all);
    setFavs(next);
  };

  const doctorById = (id: string) => doctors.find((d) => d.id === id);

  return (
    <div className="min-h-screen bg-background">
      <Header variant="app" />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hola, {user.nombre.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground">Este es el resumen de tu salud hoy.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={Calendar}
            label="Citas pendientes"
            value={pendientes.length}
            tone="primary"
          />
          <SummaryCard
            icon={FileText}
            label="Recetas disponibles"
            value={recetas.length}
            tone="accent"
          />
          <SummaryCard
            icon={Star}
            label="Médicos favoritos"
            value={favs.length}
            tone="warning"
          />
        </div>

        {favDoctor && (
          <div className="mt-6 rounded-2xl border bg-gradient-to-r from-primary-soft to-card p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    Médico favorito
                  </p>
                  <p className="text-lg font-semibold">{favDoctor.nombre}</p>
                  <p className="text-sm text-muted-foreground">{favDoctor.especialidad}</p>
                </div>
              </div>
              <Link
                to="/agendar-cita"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Agendar
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <TabBtn active={tab === "citas"} onClick={() => setTab("citas")}>
                Próximas citas
              </TabBtn>
              <TabBtn active={tab === "recetas"} onClick={() => setTab("recetas")}>
                Mis recetas
              </TabBtn>
            </div>
            <Link
              to="/agendar-cita"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Nueva cita
            </Link>
          </div>

          <div className="p-4">
            {tab === "citas" ? (
              citas.length === 0 ? (
                <Empty message="No tienes citas todavía. ¡Agenda la primera!" />
              ) : (
                <ul className="divide-y">
                  {citas.map((c) => (
                    <CitaItem key={c.id} cita={c} doctor={doctorById(c.doctorId)} />
                  ))}
                </ul>
              )
            ) : recetas.length === 0 ? (
              <Empty message="Aún no tienes recetas." />
            ) : (
              <ul className="space-y-2">
                {recetas.map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/recetas/$recetaId"
                      params={{ recetaId: r.id }}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent"
                    >
                      <div>
                        <p className="font-medium">Receta #{r.id.slice(-4).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {r.fecha} · {doctorById(r.doctorId)?.nombre ?? "Médico"} ·{" "}
                          {r.medicamentos.length} medicamento(s)
                        </p>
                      </div>
                      <FileText className="h-5 w-5 text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Médicos disponibles</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => {
              const isFav = favs.includes(d.id);
              return (
                <div
                  key={d.id}
                  className="rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{d.nombre}</p>
                        <p className="text-sm text-muted-foreground">{d.especialidad}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFav(d.id)}
                      aria-label="Marcar favorito"
                      className={`rounded-full p-2 transition ${
                        isFav ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"
                      }`}
                    >
                      <Star className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  <Link
                    to="/agendar-cita"
                    search={{ doctorId: d.id }}
                    className="mt-4 block w-full rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Agendar con este médico
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "primary" | "accent" | "warning";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent text-accent-foreground",
    warning: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
        active ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ message }: { message: string }) {
  return <p className="py-12 text-center text-sm text-muted-foreground">{message}</p>;
}

function CitaItem({ cita, doctor }: { cita: Cita; doctor?: User }) {
  const tone = {
    pendiente: "bg-amber-100 text-amber-700",
    confirmada: "bg-blue-100 text-blue-700",
    completada: "bg-emerald-100 text-emerald-700",
    cancelada: "bg-red-100 text-red-700",
  }[cita.estado];
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="font-medium">{doctor?.nombre ?? "Médico"}</p>
        <p className="text-sm text-muted-foreground">
          {cita.fecha} · {cita.hora} · {doctor?.especialidad}
        </p>
        <p className="mt-1 text-sm">{cita.motivo}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{cita.estado}</span>
    </li>
  );
}

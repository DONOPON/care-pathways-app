import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Calendar,
  Pill,
  Star,
  Plus,
  Stethoscope,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Cita, Receta, User } from "@/lib/types";

export default function DashboardPaciente() {
  return (
    <RequireAuth role="paciente">
      <PacienteDashboard />
    </RequireAuth>
  );
}

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
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Hola, {user.nombre}</h1>
            <p className="text-muted-foreground">Bienvenido a tu portal de salud</p>
          </div>
          <Link
            to="/agendar-cita"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Nueva cita
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={Calendar}
            label="Citas pendientes"
            value={pendientes.length}
            tone="primary"
          />
          <StatCard
            icon={Pill}
            label="Recetas disponibles"
            value={recetas.length}
            tone="success"
          />
          <StatCard
            icon={Star}
            label="Médico favorito"
            value={favs.length > 0 ? "Sí" : "No"}
            tone="accent"
          />
        </div>

        {favDoctor && (
          <div className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
            <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Star className="h-4 w-4 fill-current" /> Médico favorito
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{favDoctor.nombre}</p>
                  <p className="text-sm text-muted-foreground">{favDoctor.especialidad}</p>
                </div>
              </div>
              <Link
                to={`/agendar-cita?doctorId=${favDoctor.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" /> Agendar
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="grid grid-cols-2 rounded-xl bg-muted p-1">
            <TabBtn active={tab === "citas"} onClick={() => setTab("citas")}>
              Próximas citas
            </TabBtn>
            <TabBtn active={tab === "recetas"} onClick={() => setTab("recetas")}>
              Mis recetas
            </TabBtn>
          </div>

          <div className="mt-5">
            {tab === "citas" ? (
              citas.length === 0 ? (
                <Empty message="No tienes citas todavía. ¡Agenda la primera!" />
              ) : (
                <ul className="space-y-3">
                  {citas.map((c) => (
                    <CitaCard key={c.id} cita={c} doctor={doctorById(c.doctorId)} />
                  ))}
                </ul>
              )
            ) : (
              <>
                <p className="mb-3 text-xs text-muted-foreground">
                  Por privacidad, solo se muestran las recetas e indicaciones que tu médico te
                  entregó. El historial clínico completo solo es accesible por el doctor.
                </p>
                {recetas.length === 0 ? (
                  <Empty message="Aún no tienes recetas." />
                ) : (
                  <ul className="space-y-3">
                    {recetas.map((r) => (
                      <RecetaCard
                        key={r.id}
                        receta={r}
                        doctor={doctorById(r.doctorId)}
                        cita={citas.find((c) => c.recetaId === r.id)}
                      />
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Médicos disponibles</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {doctors.map((d) => {
              const isFav = favs.includes(d.id);
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary font-semibold">
                      D
                    </div>
                    <div>
                      <p className="font-semibold">{d.nombre}</p>
                      <p className="text-sm text-primary-glow">{d.especialidad}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFav(d.id)}
                    aria-label="Marcar favorito"
                    className={`rounded-full p-2 transition ${
                      isFav
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-accent"
                    }`}
                  >
                    <Star className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  tone: "primary" | "success" | "accent";
}) {
  const tones = {
    primary: "text-primary",
    success: "text-success",
    accent: "text-accent",
  };
  return (
    <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
      <Icon className={`mx-auto h-7 w-7 ${tones[tone]}`} />
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
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
      className={`rounded-lg py-2.5 text-sm font-semibold transition ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

const ESTADO_META: Record<
  Cita["estado"],
  { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pendiente: {
    label: "Pendiente",
    cls: "bg-accent-soft text-accent",
    icon: AlertCircle,
  },
  confirmada: {
    label: "Confirmada",
    cls: "bg-primary-soft text-primary-glow",
    icon: CheckCircle2,
  },
  completada: {
    label: "Finalizada",
    cls: "bg-success-soft text-success",
    icon: CheckCircle2,
  },
  cancelada: {
    label: "Cancelada",
    cls: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

function CitaCard({ cita, doctor }: { cita: Cita; doctor?: User }) {
  const meta = ESTADO_META[cita.estado];
  const Icon = meta.icon;
  return (
    <li className="rounded-xl border bg-card p-5 shadow-sm">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.cls}`}
      >
        <Icon className="h-3.5 w-3.5" /> {meta.label}
      </span>
      <p className="mt-3 font-semibold">{cita.motivo}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" /> {doctor?.nombre ?? "Médico"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> {cita.fecha}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {cita.hora}
        </span>
      </div>
    </li>
  );
}

function RecetaCard({
  receta,
  doctor,
  cita,
}: {
  receta: Receta;
  doctor?: User;
  cita?: Cita;
}) {
  return (
    <li className="rounded-xl border bg-card p-5 shadow-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success">
        <CheckCircle2 className="h-3.5 w-3.5" /> Finalizada
      </span>
      <p className="mt-3 font-semibold">{cita?.motivo ?? "Consulta médica"}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" /> {doctor?.nombre ?? "Médico"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" /> {receta.fecha}
        </span>
        {cita && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {cita.hora}
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-accent/30 bg-accent-soft p-4">
        <p className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          <Pill className="h-4 w-4" /> Receta médica:
        </p>
        {receta.medicamentos.map((m, i) => (
          <p key={i} className="text-sm text-foreground/80">
            {m.nombre} — {m.dosis} {m.frecuencia}.
          </p>
        ))}
        {receta.indicaciones && (
          <p className="mt-1 text-sm text-foreground/80">{receta.indicaciones}</p>
        )}
      </div>

      <Link
        to={`/recetas/${receta.id}`}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
      >
        <Pill className="h-4 w-4" /> Descargar receta (PDF)
      </Link>
    </li>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Calendar, Clock, Stethoscope } from "lucide-react";
import { Header } from "@/components/Header";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Cita, User } from "@/lib/types";

const HORARIOS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const Route = createFileRoute("/agendar-cita")({
  validateSearch: (search: Record<string, unknown>) => ({
    doctorId: typeof search.doctorId === "string" ? search.doctorId : undefined,
  }),
  component: () => (
    <RequireAuth role="paciente">
      <Agendar />
    </RequireAuth>
  ),
});

function Agendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [doctors, setDoctors] = useState<User[]>([]);
  const [especialidad, setEspecialidad] = useState("");
  const [doctorId, setDoctorId] = useState(search.doctorId ?? "");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");
  const [busyHours, setBusyHours] = useState<string[]>([]);

  useEffect(() => {
    setDoctors(storage.getUsers().filter((u) => u.role === "doctor"));
  }, []);

  useEffect(() => {
    if (search.doctorId) {
      const d = storage.getUsers().find((u) => u.id === search.doctorId);
      if (d?.especialidad) setEspecialidad(d.especialidad);
    }
  }, [search.doctorId]);

  const especialidades = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.especialidad).filter(Boolean) as string[])),
    [doctors],
  );

  const filteredDoctors = useMemo(
    () => (especialidad ? doctors.filter((d) => d.especialidad === especialidad) : doctors),
    [doctors, especialidad],
  );

  useEffect(() => {
    if (!doctorId || !fecha) {
      setBusyHours([]);
      return;
    }
    const taken = storage
      .getCitas()
      .filter((c) => c.doctorId === doctorId && c.fecha === fecha && c.estado !== "cancelada")
      .map((c) => c.hora);
    setBusyHours(taken);
  }, [doctorId, fecha]);

  const today = new Date().toISOString().slice(0, 10);
  const isToday = fecha === today;
  const nowHM = new Date().toTimeString().slice(0, 5);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user || !doctorId || !fecha || !hora || !motivo.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    if (busyHours.includes(hora)) {
      setError("Ese horario ya está ocupado.");
      return;
    }
    const nueva: Cita = {
      id: `c-${Date.now()}`,
      pacienteId: user.id,
      doctorId,
      fecha,
      hora,
      motivo: motivo.trim(),
      estado: "pendiente",
    };
    const all = storage.getCitas();
    all.push(nueva);
    storage.setCitas(all);
    navigate({ to: "/dashboard-paciente" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header variant="app" />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold">Agendar nueva cita</h1>
        <p className="mt-1 text-muted-foreground">Encuentra el horario perfecto para ti.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <Field label="Especialidad" icon={Stethoscope}>
            <select
              value={especialidad}
              onChange={(e) => {
                setEspecialidad(e.target.value);
                setDoctorId("");
              }}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Todas las especialidades</option>
              {especialidades.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Médico">
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Selecciona un médico</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre} — {d.especialidad}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fecha" icon={Calendar}>
            <input
              type="date"
              required
              min={today}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </Field>

          {fecha && doctorId && (
            <Field label="Horarios disponibles" icon={Clock}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {HORARIOS.map((h) => {
                  const taken = busyHours.includes(h);
                  const past = isToday && h <= nowHM;
                  const disabled = taken || past;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={disabled}
                      onClick={() => setHora(h)}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        hora === h
                          ? "border-primary bg-primary text-primary-foreground"
                          : disabled
                            ? "cursor-not-allowed border-dashed bg-muted/40 text-muted-foreground/50 line-through"
                            : "bg-background hover:border-primary hover:bg-primary-soft"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          <Field label="Motivo de consulta">
            <textarea
              required
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
              placeholder="Describe brevemente el motivo de tu consulta..."
            />
          </Field>

          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard-paciente" })}
              className="flex-1 rounded-lg border bg-background py-2.5 font-medium hover:bg-accent"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Confirmar cita
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {label}
      </label>
      {children}
    </div>
  );
}

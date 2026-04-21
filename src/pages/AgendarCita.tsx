import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Calendar, Clock, Search, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Cita, User } from "@/lib/types";

const HORARIOS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

export default function AgendarCita() {
  return (
    <RequireAuth role="paciente">
      <Agendar />
    </RequireAuth>
  );
}

function Agendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get("doctorId") ?? "";

  const [doctors, setDoctors] = useState<User[]>([]);
  const [especialidad, setEspecialidad] = useState("");
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");
  const [busyHours, setBusyHours] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setDoctors(storage.getUsers().filter((u) => u.role === "doctor"));
  }, []);

  useEffect(() => {
    if (initialDoctorId) {
      const d = storage.getUsers().find((u) => u.id === initialDoctorId);
      if (d?.especialidad) setEspecialidad(d.especialidad);
    }
  }, [initialDoctorId]);

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
    setSuccess(true);
    setTimeout(() => navigate("/dashboard-paciente"), 1400);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Header variant="app" />
        <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-success">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">¡Cita agendada!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Redirigiendo a tu dashboard...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header variant="app" />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold">Agendar Cita</h1>
        <p className="mt-1 text-muted-foreground">Selecciona especialidad, médico, fecha y hora</p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <Field label="Especialidad">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={especialidad}
                onChange={(e) => {
                  setEspecialidad(e.target.value);
                  setDoctorId("");
                }}
                className="w-full appearance-none rounded-lg border bg-background py-2.5 pl-9 pr-3 text-sm"
              >
                <option value="">Todas las especialidades</option>
                {especialidades.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Médico" required>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
              className="w-full appearance-none rounded-lg border bg-background px-3 py-2.5 text-sm"
            >
              <option value="">Seleccionar médico</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre} — {d.especialidad}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fecha" required>
            <input
              type="date"
              required
              min={today}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
            />
          </Field>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">
                Hora <span className="text-destructive">*</span>
              </label>
              {fecha && doctorId && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-success" /> Disponible
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50" /> Ocupado
                  </span>
                </div>
              )}
            </div>
            {!fecha || !doctorId ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Selecciona médico y fecha para ver horarios disponibles
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {HORARIOS.map((h) => {
                  const taken = busyHours.includes(h);
                  const past = isToday && h <= nowHM;
                  const disabled = taken || past;
                  const selected = hora === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={disabled}
                      onClick={() => setHora(h)}
                      className={`rounded-lg border py-2 text-sm font-medium transition ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : disabled
                            ? "cursor-not-allowed border-dashed bg-muted/40 text-muted-foreground/50"
                            : "border-success/40 bg-success-soft text-success hover:border-success"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Field label="Motivo de consulta" required>
            <textarea
              required
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
              placeholder="Describe brevemente el motivo..."
            />
          </Field>

          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Calendar className="h-4 w-4" /> Agendar cita
          </button>
        </form>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard-paciente")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Volver al dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Calendar, ClipboardList, Save, X } from "lucide-react";
import { Header } from "@/components/Header";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Cita, Receta, User } from "@/lib/types";

export default function DashboardDoctor() {
  return (
    <RequireAuth role="doctor">
      <DoctorDashboard />
    </RequireAuth>
  );
}

function DoctorDashboard() {
  const { user } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<User[]>([]);
  const [editing, setEditing] = useState<Cita | null>(null);

  const reload = () => {
    if (!user) return;
    setCitas(
      storage
        .getCitas()
        .filter((c) => c.doctorId === user.id)
        .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora)),
    );
    setPacientes(storage.getUsers().filter((u) => u.role === "paciente"));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const pacienteName = (id: string) => pacientes.find((p) => p.id === id)?.nombre ?? "Paciente";

  const updateEstado = (cita: Cita, estado: Cita["estado"]) => {
    const all = storage.getCitas();
    const idx = all.findIndex((c) => c.id === cita.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], estado };
      storage.setCitas(all);
      reload();
    }
  };

  const pendientes = citas.filter((c) => c.estado !== "completada" && c.estado !== "cancelada");
  const completadas = citas.filter((c) => c.estado === "completada");

  return (
    <div className="min-h-screen bg-background">
      <Header variant="app" />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Hola, {user.nombre.split(" ")[1] ?? user.nombre} 🩺</h1>
        <p className="text-muted-foreground">Panel del médico — {user.especialidad}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="Citas pendientes" value={pendientes.length} icon={Calendar} />
          <Stat label="Atendidas" value={completadas.length} icon={ClipboardList} />
          <Stat label="Total pacientes" value={new Set(citas.map((c) => c.pacienteId)).size} icon={ClipboardList} />
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-xl font-semibold">Citas asignadas</h2>
          <div className="rounded-2xl border bg-card shadow-sm">
            {citas.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No tienes citas asignadas todavía.
              </p>
            ) : (
              <ul className="divide-y">
                {citas.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{pacienteName(c.pacienteId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {c.fecha} · {c.hora} · {c.motivo}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          {
                            pendiente: "bg-accent-soft text-accent",
                            confirmada: "bg-primary-soft text-primary-glow",
                            completada: "bg-success-soft text-success",
                            cancelada: "bg-destructive/10 text-destructive",
                          }[c.estado]
                        }`}
                      >
                        {c.estado}
                      </span>
                      {c.estado === "pendiente" && (
                        <button
                          onClick={() => updateEstado(c, "confirmada")}
                          className="rounded-md bg-primary-glow px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-glow/90"
                        >
                          Confirmar
                        </button>
                      )}
                      {c.estado !== "completada" && c.estado !== "cancelada" && (
                        <>
                          <button
                            onClick={() => setEditing(c)}
                            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                          >
                            Atender
                          </button>
                          <button
                            onClick={() => updateEstado(c, "cancelada")}
                            className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-accent"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {editing && (
          <AtenderModal
            cita={editing}
            paciente={pacientes.find((p) => p.id === editing.pacienteId)}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              reload();
            }}
          />
        )}
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function AtenderModal({
  cita,
  paciente,
  onClose,
  onSaved,
}: {
  cita: Cita;
  paciente?: User;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [diagnostico, setDiagnostico] = useState(cita.diagnostico ?? "");
  const [observaciones, setObservaciones] = useState(cita.observaciones ?? "");
  const [meds, setMeds] = useState<Receta["medicamentos"]>([
    { nombre: "", dosis: "", frecuencia: "" },
  ]);
  const [indicaciones, setIndicaciones] = useState("");

  const addMed = () =>
    setMeds((m) => [...m, { nombre: "", dosis: "", frecuencia: "" }]);
  const updateMed = (i: number, field: keyof Receta["medicamentos"][number], value: string) =>
    setMeds((m) => m.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));
  const removeMed = (i: number) => setMeds((m) => m.filter((_, idx) => idx !== i));

  const guardar = () => {
    const validMeds = meds.filter((m) => m.nombre.trim());
    let recetaId: string | undefined;
    if (validMeds.length > 0) {
      const receta: Receta = {
        id: `r-${Date.now()}`,
        citaId: cita.id,
        pacienteId: cita.pacienteId,
        doctorId: cita.doctorId,
        fecha: new Date().toISOString().slice(0, 10),
        medicamentos: validMeds,
        indicaciones: indicaciones.trim(),
      };
      const recetas = storage.getRecetas();
      recetas.push(receta);
      storage.setRecetas(recetas);
      recetaId = receta.id;
    }

    const all = storage.getCitas();
    const idx = all.findIndex((c) => c.id === cita.id);
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        diagnostico,
        observaciones,
        recetaId: recetaId ?? all[idx].recetaId,
        estado: "completada",
      };
      storage.setCitas(all);
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-card p-4">
          <div>
            <h2 className="text-lg font-semibold">Atender consulta</h2>
            <p className="text-sm text-muted-foreground">
              {paciente?.nombre} · {cita.fecha} {cita.hora}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Motivo</label>
            <p className="rounded-md bg-muted/50 p-2 text-sm">{cita.motivo}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Diagnóstico</label>
            <textarea
              rows={2}
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              className="w-full rounded-lg border bg-background p-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Observaciones</label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full rounded-lg border bg-background p-2 text-sm"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Receta (opcional)</label>
              <button
                type="button"
                onClick={addMed}
                className="text-xs font-medium text-primary hover:underline"
              >
                + Agregar medicamento
              </button>
            </div>
            <div className="space-y-2">
              {meds.map((m, i) => (
                <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border p-2 sm:grid-cols-12">
                  <input
                    placeholder="Medicamento"
                    value={m.nombre}
                    onChange={(e) => updateMed(i, "nombre", e.target.value)}
                    className="rounded-md border bg-background px-2 py-1.5 text-sm sm:col-span-4"
                  />
                  <input
                    placeholder="Dosis"
                    value={m.dosis}
                    onChange={(e) => updateMed(i, "dosis", e.target.value)}
                    className="rounded-md border bg-background px-2 py-1.5 text-sm sm:col-span-3"
                  />
                  <input
                    placeholder="Frecuencia"
                    value={m.frecuencia}
                    onChange={(e) => updateMed(i, "frecuencia", e.target.value)}
                    className="rounded-md border bg-background px-2 py-1.5 text-sm sm:col-span-4"
                  />
                  <button
                    type="button"
                    onClick={() => removeMed(i)}
                    className="rounded-md border px-2 py-1.5 text-xs hover:bg-accent sm:col-span-1"
                    aria-label="Quitar"
                  >
                    <X className="mx-auto h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <textarea
              rows={2}
              value={indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
              placeholder="Indicaciones generales..."
              className="mt-2 w-full rounded-lg border bg-background p-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm hover:bg-accent">
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" /> Guardar y completar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

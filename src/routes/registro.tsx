import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/registro")({
  component: RegisterPage,
});

const ESPECIALIDADES = [
  "Medicina General",
  "Cardiología",
  "Pediatría",
  "Dermatología",
  "Ginecología",
  "Neurología",
  "Psiquiatría",
  "Traumatología",
];

function RegisterPage() {
  const { user, ready, register } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("paciente");
  const [especialidad, setEspecialidad] = useState(ESPECIALIDADES[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) {
      navigate({ to: user.role === "doctor" ? "/dashboard-doctor" : "/dashboard-paciente" });
    }
  }, [ready, user, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const u = register({
      nombre,
      email,
      password,
      role,
      ...(role === "doctor" ? { especialidad } : {}),
    });
    if (!u) {
      setError("Ya existe una cuenta con ese correo.");
      return;
    }
    navigate({ to: u.role === "doctor" ? "/dashboard-doctor" : "/dashboard-paciente" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-soft to-background p-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-primary">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold">SaludDigital</span>
        </Link>

        <h1 className="text-center text-2xl font-bold">Crear Cuenta</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Únete a tu portal de salud digital
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Nombre completo">
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="Juan Pérez"
            />
          </Field>

          <Field label="Correo electrónico">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="tu@correo.com"
            />
          </Field>

          <Field label="Contraseña">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
              placeholder="Mínimo 6 caracteres"
            />
          </Field>

          <Field label="Soy">
            <div className="grid grid-cols-2 gap-2">
              {(["paciente", "doctor"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition ${
                    role === r
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>

          {role === "doctor" && (
            <Field label="Especialidad">
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary/30 focus:ring-2"
              >
                {ESPECIALIDADES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          )}

          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

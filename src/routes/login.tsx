import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Heart, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) {
      navigate({ to: user.role === "doctor" ? "/dashboard-doctor" : "/dashboard-paciente" });
    }
  }, [ready, user, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const u = login(email, password);
    if (!u) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    navigate({ to: u.role === "doctor" ? "/dashboard-doctor" : "/dashboard-paciente" });
  };

  const fillDemo = (kind: "paciente" | "doctor") => {
    setEmail(kind === "paciente" ? "paciente@demo.com" : "doctor@demo.com");
    setPassword("demo1234");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-soft to-background p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 text-primary">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold">SaludDigital</span>
        </Link>

        <h1 className="text-center text-2xl font-bold">Iniciar Sesión</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Bienvenido de vuelta a tu portal de salud
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Cuentas demo</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo("paciente")}
              className="flex-1 rounded-md bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              Paciente
            </button>
            <button
              type="button"
              onClick={() => fillDemo("doctor")}
              className="flex-1 rounded-md bg-background px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

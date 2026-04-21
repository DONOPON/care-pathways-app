import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Heart, LogIn } from "lucide-react";
import { Header } from "@/components/Header";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex flex-col items-center px-4 py-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">Accede a tu portal de salud</p>

        <div className="mt-6 w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Correo electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary-glow/30 focus:ring-2"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none ring-primary-glow/30 focus:ring-2"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-primary hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-6 w-full max-w-md rounded-xl border bg-muted/40 p-4 text-sm">
          <p className="mb-2 font-semibold">Cuentas demo:</p>
          <p>
            <span className="text-muted-foreground">Paciente:</span>{" "}
            <span className="text-primary">paciente@demo.com / demo1234</span>
          </p>
          <p>
            <span className="text-muted-foreground">Doctor:</span>{" "}
            <span className="text-primary">doctor@demo.com / demo1234</span>
          </p>
        </div>
      </main>
    </div>
  );
}

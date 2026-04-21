import { Link } from "@tanstack/react-router";
import { Heart, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Props {
  variant?: "public" | "app";
}

export function Header({ variant = "public" }: Props) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          SaludDigital
        </Link>

        <nav className="flex items-center gap-2">
          {variant === "public" && !user && (
            <>
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-medium hover:bg-white/10"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-white/90"
              >
                Registrarse
              </Link>
            </>
          )}
          {user && (
            <>
              <span className="hidden text-sm md:inline">Hola, {user.nombre.split(" ")[0]}</span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium hover:bg-white/25"
              >
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

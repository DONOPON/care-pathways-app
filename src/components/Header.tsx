import { Link } from "react-router-dom";
import { Heart, LogOut, User as UserIcon } from "lucide-react";
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          SaludDigital
        </Link>

        <nav className="flex items-center gap-3">
          {variant === "public" && !user && (
            <>
              <Link
                to="/login"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-white/90"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-white/90"
              >
                Registrarse
              </Link>
            </>
          )}
          {user && (
            <>
              <span className="hidden items-center gap-2 text-sm md:inline-flex">
                <UserIcon className="h-4 w-4" />
                {user.nombre.split(" ").slice(0, 2).join(" ")}
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium capitalize">
                  {user.role}
                </span>
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/15"
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

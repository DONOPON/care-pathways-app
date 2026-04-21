import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

/**
 * Guards a subtree by role. Redirects via useEffect — never during render.
 */
export function RequireAuth({ role, children }: { role?: Role; children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (role && user.role !== role) {
      navigate(user.role === "doctor" ? "/dashboard-doctor" : "/dashboard-paciente");
    }
  }, [ready, user, role, navigate]);

  if (!ready || !user || (role && user.role !== role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }
  return <>{children}</>;
}

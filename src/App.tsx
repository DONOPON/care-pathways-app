import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import DashboardPaciente from "./pages/DashboardPaciente";
import DashboardDoctor from "./pages/DashboardDoctor";
import AgendarCita from "./pages/AgendarCita";
import RecetaPage from "./pages/RecetaPage";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/dashboard-paciente" element={<DashboardPaciente />} />
        <Route path="/dashboard-doctor" element={<DashboardDoctor />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/recetas/:recetaId" element={<RecetaPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Heart className="h-4 w-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Download, ArrowLeft, Pill } from "lucide-react";
import jsPDF from "jspdf";
import { Header } from "@/components/Header";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Receta, User } from "@/lib/types";

export const Route = createFileRoute("/recetas/$recetaId")({
  ssr: false,
  component: () => (
    <RequireAuth>
      <RecetaPage />
    </RequireAuth>
  ),
});

function RecetaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { recetaId } = Route.useParams();
  const [receta, setReceta] = useState<Receta | null>(null);
  const [doctor, setDoctor] = useState<User | null>(null);
  const [paciente, setPaciente] = useState<User | null>(null);

  useEffect(() => {
    const r = storage.getRecetas().find((x) => x.id === recetaId);
    if (!r) {
      navigate({ to: "/dashboard-paciente" });
      return;
    }
    if (user && r.pacienteId !== user.id && user.role !== "doctor") {
      navigate({ to: "/dashboard-paciente" });
      return;
    }
    setReceta(r);
    const users = storage.getUsers();
    setDoctor(users.find((u) => u.id === r.doctorId) ?? null);
    setPaciente(users.find((u) => u.id === r.pacienteId) ?? null);
  }, [recetaId, user, navigate]);

  if (!receta) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(20);
    doc.setTextColor(40, 80, 200);
    doc.text("SaludDigital — Receta Médica", 20, y);
    y += 10;
    doc.setDrawColor(40, 80, 200);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Receta #: ${receta.id.toUpperCase()}`, 20, y);
    doc.text(`Fecha: ${receta.fecha}`, 140, y);
    y += 8;
    doc.text(`Paciente: ${paciente?.nombre ?? ""}`, 20, y);
    y += 8;
    doc.text(`Médico: ${doctor?.nombre ?? ""} (${doctor?.especialidad ?? ""})`, 20, y);
    y += 12;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Medicamentos:", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    receta.medicamentos.forEach((m, i) => {
      doc.text(`${i + 1}. ${m.nombre}`, 22, y);
      y += 6;
      doc.setTextColor(80);
      doc.text(`   Dosis: ${m.dosis}  ·  ${m.frecuencia}`, 22, y);
      doc.setTextColor(20);
      y += 8;
    });

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Indicaciones:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(receta.indicaciones, 170);
    doc.text(lines, 20, y);

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Documento generado por SaludDigital", 20, 285);

    doc.save(`receta-${receta.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header variant="app" />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/dashboard-paciente"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>

        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b bg-primary-soft p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Receta médica
                </p>
                <p className="font-bold">#{receta.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Download className="h-4 w-4" /> Descargar PDF
            </button>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Paciente</p>
                <p className="font-medium">{paciente?.nombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="font-medium">{receta.fecha}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Médico</p>
                <p className="font-medium">{doctor?.nombre}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Especialidad</p>
                <p className="font-medium">{doctor?.especialidad}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Pill className="h-4 w-4 text-primary" /> Medicamentos
              </h3>
              <ul className="space-y-2">
                {receta.medicamentos.map((m, i) => (
                  <li key={i} className="rounded-lg border bg-background p-3">
                    <p className="font-medium">{m.nombre}</p>
                    <p className="text-sm text-muted-foreground">
                      {m.dosis} · {m.frecuencia}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Indicaciones</h3>
              <p className="rounded-lg bg-muted/50 p-3 text-sm">{receta.indicaciones}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

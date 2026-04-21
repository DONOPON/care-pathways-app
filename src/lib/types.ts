export type Role = "paciente" | "doctor";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  role: Role;
  especialidad?: string;
}

export interface Cita {
  id: string;
  pacienteId: string;
  doctorId: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  motivo: string;
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  diagnostico?: string;
  observaciones?: string;
  recetaId?: string;
}

export interface Receta {
  id: string;
  citaId: string;
  pacienteId: string;
  doctorId: string;
  fecha: string;
  medicamentos: { nombre: string; dosis: string; frecuencia: string }[];
  indicaciones: string;
}

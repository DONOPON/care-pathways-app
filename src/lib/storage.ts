import type { User, Cita, Receta } from "./types";

const KEYS = {
  users: "sd_users",
  session: "sd_session",
  citas: "sd_citas",
  recetas: "sd_recetas",
  favoritos: "sd_favoritos",
  seeded: "sd_seeded_v2",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (u: User[]) => write(KEYS.users, u),
  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (id: string | null) => write(KEYS.session, id),
  getCitas: () => read<Cita[]>(KEYS.citas, []),
  setCitas: (c: Cita[]) => write(KEYS.citas, c),
  getRecetas: () => read<Receta[]>(KEYS.recetas, []),
  setRecetas: (r: Receta[]) => write(KEYS.recetas, r),
  getFavoritos: () => read<Record<string, string[]>>(KEYS.favoritos, {}),
  setFavoritos: (f: Record<string, string[]>) => write(KEYS.favoritos, f),
  isSeeded: () => read<boolean>(KEYS.seeded, false),
  markSeeded: () => write(KEYS.seeded, true),
};

export function seedIfEmpty(): void {
  if (storage.isSeeded()) return;

  const users: User[] = [
    {
      id: "u-paciente-demo",
      nombre: "Pedro Ramírez",
      email: "paciente@demo.com",
      password: "demo1234",
      role: "paciente",
    },
    {
      id: "u-doc-maria",
      nombre: "Dra. María García",
      email: "doctor@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Cardiología",
    },
    {
      id: "u-doc-juan",
      nombre: "Dr. Juan Pérez",
      email: "juan@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Medicina General",
    },
    {
      id: "u-doc-ana",
      nombre: "Dra. Ana López",
      email: "ana@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Dermatología",
    },
    {
      id: "u-doc-carlos",
      nombre: "Dr. Carlos Ruiz",
      email: "carlos@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Pediatría",
    },
    {
      id: "u-doc-laura",
      nombre: "Dra. Laura Martínez",
      email: "laura@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Neurología",
    },
    {
      id: "u-doc-roberto",
      nombre: "Dr. Roberto Sánchez",
      email: "roberto@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Traumatología",
    },
  ];

  const citas: Cita[] = [
    {
      id: "c-1",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doc-juan",
      fecha: "2026-04-15",
      hora: "10:30",
      motivo: "Chequeo general",
      estado: "pendiente",
    },
    {
      id: "c-2",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doc-ana",
      fecha: "2026-04-20",
      hora: "14:00",
      motivo: "Revisión dermatológica",
      estado: "pendiente",
    },
    {
      id: "c-3",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doc-ana",
      fecha: "2026-04-30",
      hora: "15:00",
      motivo: "me duele el pie",
      estado: "pendiente",
    },
    {
      id: "c-4",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doc-maria",
      fecha: "2026-05-05",
      hora: "09:00",
      motivo: "Seguimiento cardiológico",
      estado: "confirmada",
    },
    {
      id: "c-5",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doc-maria",
      fecha: "2026-04-10",
      hora: "09:00",
      motivo: "Control cardíaco",
      estado: "completada",
      diagnostico: "Hipertensión leve controlada",
      observaciones: "Mantener dieta hiposódica",
      recetaId: "r-1",
    },
  ];

  const recetas: Receta[] = [
    {
      id: "r-1",
      citaId: "c-5",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doc-maria",
      fecha: "2026-04-10",
      medicamentos: [
        { nombre: "Losartán 50mg", dosis: "1 comprimido", frecuencia: "cada 24h por 30 días" },
        { nombre: "Acido acetilsalicílico 100mg", dosis: "1 comprimido", frecuencia: "al día tras el almuerzo" },
      ],
      indicaciones: "Dieta hiposódica y caminar 30 min diarios.",
    },
  ];

  storage.setUsers(users);
  storage.setCitas(citas);
  storage.setRecetas(recetas);
  storage.setFavoritos({ "u-paciente-demo": ["u-doc-maria"] });
  storage.markSeeded();
}

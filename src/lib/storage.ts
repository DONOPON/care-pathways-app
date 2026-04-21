import type { User, Cita, Receta } from "./types";

const KEYS = {
  users: "sd_users",
  session: "sd_session",
  citas: "sd_citas",
  recetas: "sd_recetas",
  favoritos: "sd_favoritos",
  seeded: "sd_seeded_v1",
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
  // users
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (u: User[]) => write(KEYS.users, u),
  // session
  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (id: string | null) => write(KEYS.session, id),
  // citas
  getCitas: () => read<Cita[]>(KEYS.citas, []),
  setCitas: (c: Cita[]) => write(KEYS.citas, c),
  // recetas
  getRecetas: () => read<Receta[]>(KEYS.recetas, []),
  setRecetas: (r: Receta[]) => write(KEYS.recetas, r),
  // favoritos: { [pacienteId]: doctorId[] }
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
      nombre: "María García",
      email: "paciente@demo.com",
      password: "demo1234",
      role: "paciente",
    },
    {
      id: "u-doctor-demo",
      nombre: "Dr. Carlos Ramírez",
      email: "doctor@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Cardiología",
    },
    {
      id: "u-doctor-2",
      nombre: "Dra. Ana López",
      email: "ana@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Pediatría",
    },
    {
      id: "u-doctor-3",
      nombre: "Dr. Luis Mendoza",
      email: "luis@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Dermatología",
    },
    {
      id: "u-doctor-4",
      nombre: "Dra. Sofía Torres",
      email: "sofia@demo.com",
      password: "demo1234",
      role: "doctor",
      especialidad: "Medicina General",
    },
  ];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const citas: Cita[] = [
    {
      id: "c-1",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doctor-demo",
      fecha: fmt(tomorrow),
      hora: "10:00",
      motivo: "Chequeo cardiológico de rutina",
      estado: "pendiente",
    },
    {
      id: "c-2",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doctor-2",
      fecha: fmt(today),
      hora: "16:00",
      motivo: "Consulta general",
      estado: "completada",
      diagnostico: "Cuadro gripal leve",
      observaciones: "Reposo y abundante hidratación",
      recetaId: "r-1",
    },
  ];

  const recetas: Receta[] = [
    {
      id: "r-1",
      citaId: "c-2",
      pacienteId: "u-paciente-demo",
      doctorId: "u-doctor-2",
      fecha: fmt(today),
      medicamentos: [
        { nombre: "Paracetamol 500mg", dosis: "1 tableta", frecuencia: "Cada 8 horas por 3 días" },
        { nombre: "Vitamina C", dosis: "1 tableta", frecuencia: "Una vez al día por 7 días" },
      ],
      indicaciones: "Tomar con abundante agua. Evitar exposición al frío.",
    },
  ];

  storage.setUsers(users);
  storage.setCitas(citas);
  storage.setRecetas(recetas);
  storage.setFavoritos({ "u-paciente-demo": ["u-doctor-demo"] });
  storage.markSeeded();
}

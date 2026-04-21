# SaludDigital

Portal de salud digital construido con **React + Vite + TanStack Router** (SPA pura).
Persistencia simulada con `localStorage` — sin backend.

## Scripts

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # genera ./dist
npm run preview
```

## Cuentas demo (precargadas)

- **Paciente:** `paciente@demo.com` / `demo1234`
- **Doctor:** `doctor@demo.com` / `demo1234`

## Despliegue en GitHub Pages

El proyecto está preparado para GitHub Pages **sin configuración adicional**.

1. Sube el repo a GitHub (cualquier nombre, ej. `portal-salud`).
2. En *Settings → Pages*, elige **GitHub Actions** como Source.
3. Haz push a `main`. El workflow `.github/workflows/deploy.yml` se encarga del resto.

La app quedará disponible en:
```
https://<usuario>.github.io/<nombre-del-repo>/
```

### ¿Qué cambiar si renombras el repo?

**Nada en el código.** El workflow detecta automáticamente el nombre del repo
y construye con `VITE_BASE="/<nombre-del-repo>/"`.

Si compilas localmente para servir bajo un subpath, usa:

```bash
VITE_BASE="/portal-salud/" npm run build
```

### ¿Por qué hash routing?

Usamos `createHashHistory` de TanStack Router. Las URLs se ven así:

```
https://usuario.github.io/portal-salud/#/login
https://usuario.github.io/portal-salud/#/dashboard-paciente
```

Esto garantiza:
- ✅ Recargar cualquier ruta funciona sin trucos de `404.html`.
- ✅ Funciona en cualquier hosting estático (GitHub Pages, Netlify, S3...).
- ✅ Compatible 100% con Lovable.

## Estructura

```
src/
├── components/       # Header, RequireAuth
├── lib/              # auth, storage, types
├── routes/           # rutas (file-based, TanStack Router)
│   ├── __root.tsx
│   ├── index.tsx                  → /
│   ├── login.tsx                  → /login
│   ├── registro.tsx               → /registro
│   ├── dashboard-paciente.tsx     → /dashboard-paciente
│   ├── dashboard-doctor.tsx       → /dashboard-doctor
│   ├── agendar-cita.tsx           → /agendar-cita
│   └── recetas.$recetaId.tsx      → /recetas/:recetaId
├── router.tsx        # router con hash history
├── main.tsx          # entry
└── styles.css        # design system (Tailwind v4)
```

## Notas técnicas

- **Sin navegación en render**: redirecciones por sesión hechas dentro de `useEffect`.
- **Sin loops de render**: dependencias de `useEffect` revisadas.
- **`localStorage`**: ver `src/lib/storage.ts` (claves prefijadas `sd_`).
- **PDF de recetas**: `jsPDF` (cliente).

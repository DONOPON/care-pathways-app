# SaludDigital

Portal de salud digital construido sobre **TanStack Start** (React 19 + Vite + SSR),
con persistencia simulada en `localStorage` (sin backend)...

## Scripts

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # build SSR (Cloudflare Worker compatible)
npm run preview
```

## Cuentas demo

- **Paciente:** `paciente@demo.com` / `demo1234`
- **Doctor:** `doctor@demo.com` / `demo1234`

## Despliegue

### Lovable
Funciona out-of-the-box. Pulsa **Publish**.

### GitHub Pages / hosting estático
TanStack Start es SSR. Para GitHub Pages hay dos opciones:

1. **Recomendado**: usa Cloudflare Pages, Vercel o Netlify (soportan el bundle generado por `npm run build`).
2. **GitHub Pages estricto**: el build incluye `dist/client/` con HTML estático. Sirve esa carpeta.
   Si renombras el repo, define la base con `VITE_BASE="/<repo>/"` antes del build.

> Nota: hash routing puro requiere reconvertir el proyecto a SPA Vite plano,
> lo cual rompe la compatibilidad con el runtime de Lovable. Manténte con el SSR
> para Lovable y usa un host compatible si necesitas algo distinto a GitHub Pages.

## Estructura

```
src/
├── components/       Header, RequireAuth
├── lib/              auth, storage, types
├── routes/           rutas (file-based)
│   ├── __root.tsx
│   ├── index.tsx                  → /
│   ├── login.tsx                  → /login
│   ├── registro.tsx               → /registro
│   ├── dashboard-paciente.tsx     → /dashboard-paciente
│   ├── dashboard-doctor.tsx       → /dashboard-doctor
│   ├── agendar-cita.tsx           → /agendar-cita
│   └── recetas.$recetaId.tsx      → /recetas/:recetaId
├── router.tsx
└── styles.css
```

## Notas técnicas

- Todas las redirecciones por sesión están en `useEffect` (sin nav en render).
- `localStorage` está protegido con guard `typeof window` en `src/lib/storage.ts`.
- Recetas → PDF con `jsPDF`.

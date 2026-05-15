# Plan: Electrolineras Valle de Aburrá

## Estado actual
- Código completo en branch `claude/create-web-project-rnDWv` del repo `angiefrancop/BorisChernyClaudeMarkdown`
- Build verificado y funcionando
- **Pendiente:** mover el código al repo correcto `angiefrancop/electrolineras-valle-aburra`

---

## Paso 1 — Mover el código al repo correcto

Desde GitHub Codespaces (o terminal en tu máquina):

```bash
git rm CLAUDE.md
git commit -m "chore: remove unrelated file"
git remote set-url origin https://github.com/angiefrancop/electrolineras-valle-aburra
git branch -m main
git push -u origin main
```

---

## Paso 2 — Configurar Supabase (base de datos en la nube)

1. Crear cuenta en https://supabase.com (gratis)
2. Crear nuevo proyecto (región: South America / São Paulo es la más cercana)
3. En el SQL Editor, ejecutar el archivo `supabase/migrations/001_initial_schema.sql`
4. Copiar Project URL y anon key desde Settings → API
5. Crear archivo `.env` en la raíz del proyecto:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Sin esto la app funciona en modo local (localStorage en el dispositivo).

---

## Paso 3 — Correr localmente

```bash
npm install
npm run dev
```

Abrir http://localhost:5173 en el navegador.

---

## Paso 4 — Desplegar en producción (Vercel)

1. Ir a https://vercel.com → Import Project → seleccionar `electrolineras-valle-aburra`
2. En Environment Variables agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Deploy — Vercel detecta Vite automáticamente

La app queda en una URL pública tipo `electrolineras-valle-aburra.vercel.app`.

---

## Stack del proyecto

| Capa | Tecnología |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS (mobile-first) |
| Mapa | React Leaflet + OpenStreetMap |
| Estado | Zustand |
| Formularios | React Hook Form + Zod |
| Base de datos | Supabase (PostgreSQL) |
| Almacenamiento fotos | Supabase Storage |
| Iconos | Lucide React |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── layout/       Header, BottomNav
│   ├── map/          MapView, StationMarker
│   └── station/      StationCard, StationDetail, StationForm, FilterPanel
├── pages/            MapPage, ListPage, AddEditPage, StationDetailPage
├── services/         stations.ts  ← capa de datos (Supabase + localStorage)
├── store/            useStationsStore.ts  ← estado global Zustand
├── types/            index.ts  ← tipos + labels de conectores y servicios
└── lib/              supabase.ts
supabase/
└── migrations/       001_initial_schema.sql
```

---

## Funcionalidades implementadas (v1)

- [x] Mapa interactivo con pines verde/rojo según estado
- [x] Agregar electrolinera con todos los campos
- [x] Editar y eliminar electrolinera
- [x] Tipos de conector: Tipo 1, Tipo 2, CCS1, CCS2, CHAdeMO, GB/T, Tesla/NACS
- [x] Estado: en servicio / fuera de servicio
- [x] Costo por kWh, total de cargadores, potencia por conector
- [x] Horario (24/7 o con rango de horas)
- [x] Servicios adicionales (WiFi, lavadero, café, tienda, etc.)
- [x] Notas personales
- [x] Fotos desde cámara del móvil
- [x] Abrir en Google Maps, Waze y Apple Maps
- [x] Filtros por empresa, tipo de conector, estado
- [x] Búsqueda en vista de lista
- [x] Modo local (localStorage) sin configuración

## Posibles mejoras futuras (v2)

- [ ] Autenticación multi-usuario (Supabase Auth)
- [ ] Compartir perfil público de una electrolinera
- [ ] Reporte de estado por la comunidad
- [ ] PWA (instalable en el móvil como app nativa)
- [ ] Historial de visitas personales
- [ ] Exportar datos a CSV/GPX

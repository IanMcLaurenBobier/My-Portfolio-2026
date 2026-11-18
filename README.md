# Ian Mc Lauren "Mac" Bobier — Developer & IT Infrastructure Portfolio

A dark dashboard-style personal developer portfolio built with **React**, **TypeScript**, **Tailwind CSS**, **Three.js**, **GSAP**, and an **Express REST API** (paired with complete **PHP Laravel 11** backend source code in `backend-laravel/`).

## Architecture Overview

- **Interactive Frontend (`src/`)**:
  - **Bento Dashboard Grid (`BentoDashboard.tsx`)**: Asymmetric 12-column responsive layout featuring an interactive Three.js procedural 3D workstation centerpiece (`TerminalCore3D.tsx`), live Philippine Standard Time (`Asia/Manila`) clock, interactive technology stack inspector, project collage card, and reusable CSS animated patterns.
  - **Projects & Case Studies (`ProjectsSection.tsx`, `ProjectModal.tsx`)**: Highlights DPMIS Lite, HyperDiaSense, Lapse Through Time, and additional academic builds, with an authenticated management drawer (`AdminModal.tsx`).
  - **DOST-FNRI Experience & Education (`ExperienceSection.tsx`)**: Structured breakdown across IT Support & Troubleshooting, Networking & Infrastructure, and IFNRI Web Development.
  - **Networking Topology Lab (`NetworkTopologySection.tsx`)**: Interactive SVG office topology demonstration with animated packet flow, VLAN inspection, and simulated ping test.
  - **Developer Playground (`PlaygroundSection.tsx`)**: Functional command shell, live REST API & JSON inspector, and CSS pattern previewer.
  - **Theme & Accessibility Controls (`UtilityToolbar.tsx`)**: 5 circular accent themes (Red, Blue, Purple, Green, Orange), Reduced Motion toggle, High Contrast toggle, and procedural Web Audio feedback toggle.
- **Runtime Backend (`server.ts`)**:
  - Serves the Vite/React frontend on port `3000` and exposes `/api/health`, `/api/projects`, `/api/contact`, `/api/messages`, and `/api/admin/verify`.
- **Laravel 11 Backend Reference (`backend-laravel/`)**:
  - Complete Laravel API implementation (`routes/api.php`, controllers, `FormRequest` validation, Eloquent models, migrations, and CORS config) matching the same REST contract for MySQL deployment.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Build & Lint

```bash
npm run lint
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Service health & architecture metadata |
| `GET` | `/api/projects` | Public | List portfolio projects (`?category=Featured`) |
| `GET` | `/api/projects/:slug` | Public | Fetch single project details |
| `POST` | `/api/contact` | Public | Validate & store contact form inquiry |
| `POST` | `/api/admin/verify` | Public | Verify admin passcode |
| `POST` | `/api/projects` | Admin (`X-Admin-Token`) | Add a new project entry |
| `DELETE` | `/api/projects/:id` | Admin (`X-Admin-Token`) | Remove a project entry |
| `GET` | `/api/messages` | Admin (`X-Admin-Token`) | List submitted contact inquiries |

## Laravel 11 Backend Setup (`backend-laravel/`)

See `backend-laravel/README.md` for Composer installation, MySQL migration commands, Sanctum token configuration, and CORS setup.

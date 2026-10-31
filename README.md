# NEXUS — Interactive Command Center

A cinematic 3D portfolio built with **Next.js (App Router)**, **React Three Fiber**, **drei**, **GSAP + ScrollTrigger**, **Zustand**, **Tailwind CSS** and **TypeScript**. Visitors fly through a sci-fi command hub and eight stations (Profile, Education, Experience, Skills, Projects, Certificates, Achievements, Contact) either on an automatic tour or by scrolling.

All professional content is also real, server-rendered HTML (search engines, screen readers, no-JS and no-WebGL visitors), and every project has its own page at `/projects/<slug>`.

> The included content is **fictional sample data**. Replace it using the guides below.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build && npm start
```

Requires Node 20+. Copy `.env.example` to `.env.local` if you want real contact-form delivery (optional).

## How the experience works

| Piece | Location |
| --- | --- |
| Master tour timeline, modes (`idle` / `auto` / `scroll` / `paused`), ScrollTrigger, seeking | `src/lib/tour/tourEngine.ts` |
| Camera shots, timing, focus presets, station layout | `src/config/cameraPaths.ts` |
| Camera curves (CatmullRomCurve3) and per-frame rig | `src/lib/camera/cameraCurves.ts`, `src/components/world/CameraRig.tsx` |
| Focus / intro layers blended into the rig | `src/lib/camera/rigState.ts` |
| 3D world (hub, floor, trails, particles) | `src/components/world/` |
| Eight stations (3D scene + HTML panel each) | `src/components/stations/` |
| HUD, landing, finale, loader | `src/components/tour/` |
| Shared UI (panels, modal, images, forms) | `src/components/ui/` |
| App state (phase, mode, selection, quality) | `src/stores/nexusStore.ts` |

**One timeline, one camera.** A single GSAP timeline writes the camera's position along the shot list. Auto mode plays it, scroll mode seeks it from ScrollTrigger progress, station buttons tween its playhead. Modes are mutually exclusive, so switching never loses progress. Selecting an object adds a *focus layer* (a blend toward a close-up pose) rather than a second animation system. Camera values live in mutable refs, never React state.

## Replace the sample content

All content is typed and lives in `src/data/`. Each file has `REPLACE` comments.

- **Photograph** — save your image as `public/photos/portrait.webp` (about 800×1000, face in the upper half). It is cover-fitted, never stretched. If missing, a generated avatar is used.
- **Name, title, bio, socials, e-mail, SEO text** — `src/data/profile.ts`.
- **Résumé** — save as `public/resume/resume.pdf`. Until it exists, résumé buttons become "Request Résumé" mailto links.
- **Education** — add objects to `src/data/education.ts`. Logos go in `public/logos/` and are referenced as `"/logos/name.svg"`.
- **Experience** — add objects to `src/data/experience.ts`; `relatedProjects` takes project slugs.
- **Skills** — edit `src/data/skills.ts`. Names must match the `technologies` in your projects so "projects using this skill" links work. No percentage bars.
- **Projects** — add to `src/data/projects.ts`. Each gets `/projects/<slug>` with SEO metadata and JSON-LD. Screenshots go in `public/projects/<slug>/` and are listed in `images`.
- **Certificates** — put PDFs and previews in `public/certificates/`, reference them in `src/data/certificates.ts`.
- **Achievements** — `src/data/achievements.ts`; optional images in `public/achievements/`.

Missing images, PDFs and logos degrade to generated placeholders or hidden links, never errors. Whether a file exists is resolved on the server at build time (`src/lib/assets.ts`).

## Camera paths

Edit `src/config/cameraPaths.ts`:

- `SHOTS` — ordered camera positions and look-at targets. `space: "station"` uses coordinates local to a station (+Z toward the hub); `via` adds waypoints for curved fly-throughs.
- `TOUR_TIMING` — travel seconds, reading time per station, scroll length.
- `FOCUS` — close-up distances used when selecting items.
- `WORLD.ringRadius` and `src/config/stations.ts` (`angle`) — where stations sit.

## Colours and typography

Colours: `src/config/theme.ts` (feeds Tailwind and the 3D scene). Fonts (Space Grotesk, Inter, JetBrains Mono) are self-hosted through `@fontsource-variable/*`; see `tailwind.config.ts`.

## Contact form

The form posts to `/api/contact`. Without configuration the API answers honestly that nothing was sent and the form offers a prefilled `mailto:` draft. To deliver mail, create a [Resend](https://resend.com) account and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (see `.env.example`). Secrets stay on the server. To use another provider, replace the `fetch` call in `src/app/api/contact/route.ts`.

## Accessibility, motion and performance

- Skip link, semantic landmarks, visible focus, labelled controls, accessible modal (focus trap, Esc).
- Keyboard: `←`/`→` previous/next station (auto/paused/idle), `Space` pause/resume, `Esc` leave a focused item. A text view (HUD button) renders the complete portfolio as a normal page; it is also used automatically when WebGL is unavailable.
- `prefers-reduced-motion`: shorter camera travel, no drift/parallax/ambient motion, no animated bars.
- Quality tiers (`src/lib/quality.ts`): high / medium / low change pixel ratio, particle count, bloom and detail. `PerformanceMonitor` lowers pixel ratio and the tier when frame rate drops.
- Shared geometries and materials (`src/lib/materials.ts`), instancing for pillars, drawers and data bars, shader pre-compilation before the intro, GSAP/ScrollTrigger cleanup on unmount.

## Deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel choose **Add New → Project**, import the repo (framework preset: Next.js; defaults work).
3. Add environment variables: `NEXT_PUBLIC_SITE_URL` (your production URL, used for canonical URLs, sitemap and Open Graph) and optionally the three contact variables.
4. Deploy. `sitemap.xml`, `robots.txt` and Open Graph images are generated automatically.

## Project structure

```
src/
  app/            routes, metadata, sitemap, robots, /api/contact, /projects/[slug]
  components/
    world/        R3F scene pieces
    stations/     per-station 3D + HTML panels, text-view page
    tour/         HUD, loader, landing, finale, controller
    ui/           shared UI
  config/         theme, stations, camera paths
  data/           editable portfolio content
  hooks/  lib/  stores/  types/
```

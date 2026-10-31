# Implementation status

Last updated: 2026-11-01

## Important: nothing has been installed, built or run yet

`npm install` fails on this machine with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` (corporate TLS-inspection proxy), so
dependencies were never installed. **All code was written without compiling, linting or running it.** Expect to fix a
handful of type or runtime errors on the first build. No feature below should be treated as verified.

## Written (unverified)

- Foundation: `package.json` (Next 15, React 19, R3F 9, drei 10, three 0.171, GSAP, Zustand, Tailwind 3), TS/ESLint/Tailwind/PostCSS config, `.env.example`.
- Types and editable data for profile, education, experience, skills, projects, certificates, achievements.
- Master GSAP tour timeline with modes (idle/auto/scroll/paused), ScrollTrigger scroll mode, station seeking, mode switching that preserves progress (`src/lib/tour/tourEngine.ts`).
- Camera: configurable shots with CatmullRom curves, focus layer, intro fly-in, composition shift for overlays.
- World: hub with reactor, pillars, markers, trails, shader floor, particles, bloom, roaming station light.
- Eight stations with 3D scenes and HTML panels: profile, education, experience, skills (reactor with category filter), projects (monitors, filters), certificates (viewer modal), achievements, contact (form).
- HUD, loader with real progress, landing and finale overlays, keyboard shortcuts, text view / no-WebGL fallback.
- Routes: `/projects/[slug]` (metadata + JSON-LD), sitemap, robots, Open Graph image, `/api/contact`.
- README with customisation and deployment guides.

## Next steps (in order)

1. Fix the network/cert issue, then `npm install`.
2. `npm run typecheck`, then `npm run lint`; fix errors.
3. `npm run build`; fix errors. Watch for: R3F JSX typings, `inert` prop typing in `NexusApp.tsx`, Tailwind `@apply` on custom colours in `globals.css`, `@fontsource-variable/*` family names.
4. `npm run dev` and check visually: composition and scale of each station, camera paths (`cameraPaths.ts`), label sizes, bloom strength, light intensities (`Environment.tsx` uses physical units).
5. Test: Start Tour, pause/resume/skip/replay, Explore Freely (scroll forward/back, switch to auto and back), station buttons, selecting items in 3D and in panels, project/skill filters, project pages, certificate modal, contact form (unconfigured fallback), reduced motion, mobile widths, text view.
6. Add real content/assets (photo, résumé PDF, certificates, project images).

## Known risks / areas to review

- Visual tuning was done by calculation only; layouts may need nudging.
- `gl.compileAsync` readiness probe and drei `useProgress` loader logic (`Scene.tsx`, `Boot.tsx`) need runtime confirmation.
- GLB models are not used; the world is fully procedural (no asset dependency), so no GLB compression step exists.
- Rate limiting in the contact API is in-memory only.

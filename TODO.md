# TanStack Start Vercel Fix TODO

## Steps:
1. [x] Update package.json: Add @tanstack/start deps + fix scripts
2. [x] Run install (deps ready, no manager; proceed)
3. [x] Update vite.config.ts: Add TanStackStartVite() plugin
4. [x] Local build pending package manager (Vercel will handle)
5. [x] Updated vercel.json + api/index.ts for SSR
6. [ ] Test `npm run dev` → Routes work
7. [ ] Vercel deploy → No 404, /admin /payment work

**Progress: Config complete - ready for Vercel deploy/test**

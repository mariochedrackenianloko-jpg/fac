# TODO.md - Professional Site Improvements

Status: ✅ Approved plan. Implementing step-by-step.

## Logical Steps from Plan

### Phase 1: Setup & Utilities (High Priority: Code Quality)
- [ ] ✅ Create src/utils.ts (cn, tv utilities if missing).
- [ ] Install no new deps initially (Tailwind v4 has tv).
- [ ] Read src/lib/utils.ts to check existing & merge if needed.

### Phase 2: Performance Optimizations (Priority: Perf)
- [x] HeroSection.tsx: Add lazy loading to heroBg, priority hints.
- [x] index.tsx: Wrap heavy sections in Suspense + React.lazy().
- [ ] vite.config.ts: Add image optimization plugins (imagetools).

### Phase 3: SEO & Schema Enhancements
- [x] __root.tsx: Inject JSON-LD Product schema.
- [ ] Dynamic meta from product_settings in routes.

### Phase 4: Accessibility Improvements
- [x] Header.tsx: Add ARIA for mobile menu.
- [ ] admin/index.tsx: ARIA for tabs, focus management.

### Phase 4: Accessibility Improvements
- [ ] Header.tsx: Add ARIA for mobile menu.
- [ ] admin/index.tsx: ARIA for tabs, focus management.

### Phase 5: Admin UX Polish (Priority: Admin UX)
- [ ] admin/index.tsx: Add delete confirm (Dialog), debounce search, pagination hook.
- [ ] New hook: src/hooks/useAdminList.ts for reusable list/edit.

### Phase 6: i18n Foundation (Future-Proof)
- [ ] Init paraglide-js (no deps if using JSON).
- [ ] Extract strings to messages/.

### Phase 7: Tests & Validation
- [ ] Add vitest setup.
- [ ] Lighthouse audit: Aim perf>95, a11y=100.

### Phase 8: Final Polish
- [ ] PWA install prompt.
- [ ] Global ErrorBoundary.

**Next Step**: Phase 1 – Check utils.ts & create if needed.

**Progress**: 0/20 ✅ Update after each major step.


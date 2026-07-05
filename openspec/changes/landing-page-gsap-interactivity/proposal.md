# Proposal: Landing Page GSAP Interactivity

## Intent

Create a public landing page that helps business and operations teams understand Know.ly before conversion. The page should explain how scattered knowledge becomes actionable agents, using the existing visual system and subtle GSAP interactivity to feel premium without getting in the way.

## Product Decisions

- Public brand is `Know.ly` only.
- Primary CTA routes to `/auth`.
- Metrics/social proof remain conceptual and clearly labeled; no validated-proof claims.

## Scope

### In Scope
- Replace redirect-only `app/page.tsx` with public landing content: hero, problem gap, product promise, agent workflow, preview/metrics placeholders, benefits, and CTA.
- Add reusable landing sections styled with existing shadcn/Tailwind tokens and dark mode.
- Add premium subtle motion: reveals, light parallax, ambient orbs, and microinteractions with reduced-motion support.

### Out of Scope
- Auth flow changes, dashboard behavior, pricing, CMS, lead capture backend, or real analytics data.

## Capabilities

### New Capabilities
- `public-landing-page`: Public marketing experience for learning the product promise before conversion, including content hierarchy and accessible motion.

### Modified Capabilities
- None.

## Approach

Use `app/page.tsx` as the public entry and keep dashboard modules unchanged. Compose presentational landing sections around existing tokens, `MarvaIsotype`, and a lightweight `components/landing/ambient-orb.tsx`. Add `gsap` as an implementation dependency and isolate animation setup in client components/hooks using transforms, `autoAlpha`, cleanup, and `gsap.matchMedia()` for `prefers-reduced-motion`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `app/page.tsx` | Modified | Public landing replaces redirect. |
| `components/landing/*` | New | Landing sections and motion wrappers. |
| `package.json` | Modified | Add GSAP dependency. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Motion distracts from understanding | Medium | Keep animation subtle and disable/reduce via media query. |
| Placeholder metrics imply unsupported proof | Medium | Label placeholders clearly or omit until confirmed. |
| Brand naming regresses | Low | Keep public copy on `Know.ly` only. |

## Rollback Plan

Revert `app/page.tsx`, remove `components/landing/*`, and remove `gsap` if no longer referenced. Dashboard routes remain unaffected.

## Dependencies

- `gsap` package for client-side motion.
- Existing design tokens in `app/globals.css` and shadcn component conventions.

## Success Criteria

- [ ] Public visitors can understand the product promise before conversion.
- [ ] Landing content includes hero, problem, promise, workflow, preview/metrics, benefits, and CTA.
- [ ] Motion respects `prefers-reduced-motion` and does not block content access.
- [ ] Dashboard experience remains unchanged.

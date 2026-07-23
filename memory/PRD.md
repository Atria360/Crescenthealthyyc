# PRD — Complete Care (Calgary Healthcare Hub)

## Original Problem Statement
Single-page healthcare hub for three sister brands in Calgary — Pharmasave Dominion Drugs
(#D31245), Crescent Medical Centre (#1B4F9C→#1FA48A + gold), The Physio Studio
(#1E3A5F + sage #9BB8A5). Premium, airy, kinetic design. Hero with a "What do you need
today?" picker that scrolls to + highlights the matching brand card; three brand cards with
"More info" expanders; contact strip; rotating testimonial; "About the family" manifesto;
floating "Message us" form; sticky mobile bar. Award-worthy (Awwwards-level) motion with
framer-motion + Lenis. User wants: Supabase DB, a full CMS admin panel, direct email (not
Emergent). Design first, database later.

## User Choices
- DB: **Supabase** (Postgres) — credentials pending from user.
- Email: **direct** (not Emergent) — deferred; form saves to admin inbox for now.
- Booking/website links: "#" placeholders (user will supply real URLs).
- Images: AI-generated branded interiors + AI gradient hero background.
- [VERIFY] fields: filled with sensible placeholders (user will edit via CMS).
- Testimonials: editable via admin (Phase 2); static samples for now.

## Architecture
- Frontend: React 19 (CRA/craco), TailwindCSS, framer-motion, Lenis, shadcn/ui, sonner.
- **Multi-page** app via react-router-dom. Routes: `/` (Home), `/practice/:key` (BrandPage),
  `/blog` (BlogIndex), `/blog/:slug` (BlogPost). Shared chrome in `components/Layout.jsx`
  (Navbar, Footer, MessageForm slide-over, StickyMobileBar) via `<Outlet context={{openForm}}>`.
- Fonts: Cabinet Grotesk (headings), Manrope (body), Playfair Display (accents).
- Backend: FastAPI, `/api` prefix. Interim messages store in MongoDB (to migrate to Supabase).
- Content model: `/app/frontend/src/data/siteContent.js` (brands/hero/faq/testimonials/about),
  `data/brandContent.js` (per-brand intro/services/faq for brand pages), `data/blog.js`
  (5 articles). All will be CMS-driven in Phase 2.

## User Personas
- Calgary resident needing a prescription, doctor, or physio — wants the right practice fast.
- Existing patient wanting to call/book/get directions quickly (mobile-first).
- Practice owner/admin (Phase 2) editing all site content + reading messages.

## Core Requirements (static)
- One calm page, four sections, brand colors as accents only on a warm neutral canvas.
- Interactive picker → scroll + highlight; per-brand cards with expanders; contact + reviews.
- Floating contact form (no PHI) with brand dropdown; sticky mobile bar.
- Premium, purposeful motion throughout.

## Implemented (2026-06 — multi-page refactor)
- ✅ Converted single page → multi-page with react-router-dom (App.js + Layout with Outlet).
- ✅ Home hero = 3 vertical brand panels (crescent left, pharmasave middle, physio right) with
  logos, badges, hours, address, Book/primary + Call + "More info" links; "Complete Care /
  Under One Roof" headline pushed below the panels.
- ✅ Dedicated brand pages `/practice/:key`: brand-colored hero + logo + tagline, intro, quick
  facts card (hours/address/phone + directions + website), services grid, per-brand FAQ
  accordion, embedded location map, CTA band with "Message this practice" (opens slide-over
  prefilled to brand). Invalid key → redirect to /.
- ✅ Blog: `/blog` index (featured + grid) and `/blog/:slug` reader (cover, meta, body, related).
  Invalid slug → redirect to /blog.
- ✅ ScrollToTop on route change (Lenis-aware). Navbar + Footer nav wired to all routes.
- ✅ Frontend testing agent: 100% pass, zero bugs (iteration_4.json).

## Implemented (2026-06)
- ✅ Kinetic hero: masked line-by-line headline reveal, parallax AI gradient bg, picker.
- ✅ Picker scrolls to + highlights matching brand card.
- ✅ Three brand cards: image, logo, one-liner, badges, hours, address, primary + Call, expander.
- ✅ Contact strip (tap-to-call + Google Maps directions), rotating testimonials (prev/next/dots).
- ✅ "About the family" numbered manifesto + editorial marquee, gradient-divider motif.
- ✅ Footer (3 logos, tagline, privacy). Navbar (scroll-aware).
- ✅ Floating "Message us" slide-over form + validation + success state; POST /api/messages.
- ✅ Sticky mobile bar (Book / Message / Directions). Lenis smooth scroll.
- ✅ Backend: POST/GET /api/messages (MongoDB interim). Tested 100% backend + frontend.

## Backlog (prioritized)
### P0 (next)
- Supabase integration: create tables (site_content, brand_cards, testimonials, messages,
  admin_users), migrate messages from Mongo, drive frontend content from API.
- Admin CMS: JWT auth login + dashboard; editors for hero/brands/testimonials/about/footer;
  message inbox (read/unread/delete). Route `/admin`.
### P1
- Direct email on new message (SMTP creds from user).
- Replace "#" links with real booking/website URLs; swap placeholder phones/hours/addresses.
- Swap AI interiors for real location photos when provided.
### P2
- Image uploads for CMS (object storage), SEO/meta + Open Graph, analytics,
  real Google reviews integration, accessibility audit pass.

## Next Tasks
1. [PAUSED for user review] Multi-page site complete + tested. User asked to stop & review.
2. CMS decision pending ("decide later"): either Supabase (needs URL + service_role key +
   admin email/password) OR no-credentials alternative (JWT auth + MongoDB-backed CMS).
3. Build `/admin` CMS (auth + content editors for hero/brands/blog/testimonials + message inbox).
4. Wire direct email on new message (SMTP creds from user).
5. Replace "#" booking links + placeholder phones with real values; swap AI photos for real ones.

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
- Fonts: Cabinet Grotesk (headings), Manrope (body), Playfair Display (accents).
- Backend: FastAPI, `/api` prefix. Interim messages store in MongoDB (to migrate to Supabase).
- Content model: `/app/frontend/src/data/siteContent.js` (will be CMS-driven in Phase 2).

## User Personas
- Calgary resident needing a prescription, doctor, or physio — wants the right practice fast.
- Existing patient wanting to call/book/get directions quickly (mobile-first).
- Practice owner/admin (Phase 2) editing all site content + reading messages.

## Core Requirements (static)
- One calm page, four sections, brand colors as accents only on a warm neutral canvas.
- Interactive picker → scroll + highlight; per-brand cards with expanders; contact + reviews.
- Floating contact form (no PHI) with brand dropdown; sticky mobile bar.
- Premium, purposeful motion throughout.

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
1. Collect Supabase URL + service_role key + desired admin email/password.
2. Build Supabase schema + backend data layer; point content + messages at Supabase.
3. Build `/admin` CMS (auth + content editors + inbox).
4. Wire direct email + real links/photos.

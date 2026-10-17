# Crescent Wellness Centre

Marketing site and CMS for Crescent Wellness Centre — Pharmasave, Crescent Medical Centre and The Physio Studio in downtown Calgary.

- **Frontend** — React (Create React App + CRACO, Tailwind, Framer Motion) in `frontend/`
- **API** — FastAPI in `backend/`, served as a Vercel Python function from `api/index.py`
- **Database** — Supabase Postgres, reached through the Supavisor transaction pooler

Site and API share one origin in production: the site at `/`, the API at `/api/*` (see `vercel.json`).

## Deployment

Pushing to GitHub triggers a Vercel build. Required project environment variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `postgresql://crescent_api.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET` | Long random string used to sign admin session tokens |

The API connects as the dedicated `crescent_api` database role, which only has the table privileges the API needs. Row Level Security is enabled on every table with no policies for `anon` or `authenticated`, so the Supabase Data API cannot read or write site data.

## Local development

```bash
# API
python -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
cp backend/.env.example backend/.env   # then fill in values
cd backend && uvicorn server:app --reload --port 8000

# Frontend (in another terminal)
cd frontend
yarn install
REACT_APP_BACKEND_URL=http://localhost:8000 yarn start
```

Set `CORS_ORIGINS=http://localhost:3000` in `backend/.env` when the frontend dev server runs on a different port. With `SEED_ON_STARTUP=1`, the API creates the admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`), default site content and blog posts in an empty database.

API tests run against a live server:

```bash
API_BASE_URL=http://localhost:8000 TEST_ADMIN_EMAIL=... TEST_ADMIN_PASSWORD=... pytest backend/tests
```

## Admin

The CMS is at `/admin`. It edits site content, blog posts, and the contact-form inbox. Content saved there is served from the database; `frontend/src/data` holds the fallback copy used if the API is unreachable.

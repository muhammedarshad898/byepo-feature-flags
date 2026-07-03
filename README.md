# Byepo Feature Flags

A small multi-tenant feature flag management system with three front-end apps and a Node.js backend.

## Overview

This repo contains:
- `Backend/` - Express API server with MongoDB persistence
- `frontend-super-admin/` - Super Admin UI for creating organizations
- `frontend-org-admin/` - Organization Admin UI for signup, login, and feature-flag management
- `frontend-user/` - End User UI for checking whether a feature is enabled for an organization

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Frontend: React (Vite), React Bootstrap, Bootswatch, Axios, React Router, React Toastify

## System flow

1. Super Admin logs in and creates organizations.
2. Organization Admin signs up under a selected organization and logs in.
3. Organization Admin creates feature flags for their organization and toggles them.
4. End User chooses an organization and feature, then checks whether that feature is enabled.

## Roles

- **Super Admin**
  - Hardcoded credentials are seeded via `Backend/SuperAdminCreation.js`
  - Can create and list organizations
- **Organization Admin**
  - Can signup, login, and manage feature flags scoped to their own organization
- **End User**
  - Can check feature status for a selected organization, without an account (see End User authentication below)

## End User authentication

The assignment specification requires signup/login for Organization Admins but does not mention any authentication requirement for End Users. This was treated as an intentional gap rather than an oversight, and the following decision was made:

End Users are unauthenticated. Instead of a login flow, the End User UI provides a public dropdown to select an organization (fetched from a public endpoint), followed by a dropdown of that organization's feature flags. This keeps the End User flow lightweight and matches the assignment's framing of End Users as simply needing to "check whether specific features are enabled for their organization," without requiring an account.

This decision was made deliberately to avoid over-scoping the assignment with unrequired authentication, while still satisfying the core requirement: an End User can check a feature's status scoped correctly to a specific organization.

## Design decisions

- **Feature flags are scoped to the organization, not the individual admin who created them.** Since multiple Organization Admins can belong to the same org, all flag queries and mutations use `orgId`, not `userId` — any admin in an org can manage that org's flags, similar to shared workspace permissions.
- **Three separate front-end apps**, one per role, rather than a single app with conditional UI. This mirrors the different trust levels between Super Admin (internal), Org Admin (authenticated customer), and End User (public/anonymous), and avoids role-based conditional rendering in one codebase.
- **Duplicate flag keys are prevented per organization** using a compound unique index on `(key, orgId)` — the same key can exist across different organizations (expected, multi-tenant), but not twice within the same organization.

## Super Admin credentials

- Email: `admin@byepo.com`
- Password: `admin123`

## Backend setup

1. Install dependencies:
```bash
   cd Backend
   npm install
```

2. Create `.env` in `Backend/` with:
```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/byepo-feature-flag
   JWT_SECRET=secret123
```

3. Start MongoDB locally or point `MONGODB_URI` to Atlas.

4. Seed the Super Admin account:
```bash
   node Backend/SuperAdminCreation.js
```

5. Start the backend server:
```bash
   cd Backend
   node server.js
```

## Frontend setup

Each frontend app uses Vite and should point to the backend API URL using `VITE_API_URL`.

Note: each frontend runs on Vite's default port (5173). Run one at a time, or set a custom port per app using `--port` (e.g. `npm run dev -- --port 5174`).

### Super Admin UI

1. `cd frontend-super-admin`
2. `npm install`
3. Create `.env` with `VITE_API_URL=http://localhost:5000`
4. `npm run dev`

### Organization Admin UI

1. `cd frontend-org-admin`
2. `npm install`
3. Create `.env` with `VITE_API_URL=http://localhost:5000`
4. `npm run dev`

### End User UI

1. `cd frontend-user`
2. `npm install`
3. Create `.env` with `VITE_API_URL=http://localhost:5000`
4. `npm run dev`

## Backend routes

- `POST /api/auth/signup` - Org Admin signup
- `POST /api/auth/login` - Login for Super Admin or Org Admin
- `GET /api/public/organizations` - List organizations
- `GET /api/public/flags?orgId=...` - List flags for org
- `GET /api/public/check?orgId=...&key=...` - Check feature status
- `POST /api/superadmin/organizations` - Create organization (Super Admin only)
- `GET /api/superadmin/organizations` - List organizations (Super Admin only)
- `POST /api/flags` - Create feature flag (Org Admin only)
- `GET /api/flags` - List feature flags for org (Org Admin only)
- `PATCH /api/flags/:id` - Update feature flag enabled state (Org Admin only)
- `DELETE /api/flags/:id` - Delete feature flag (Org Admin only)

## Quick verification

1. Seed and start the backend
2. Log into Super Admin UI → create an organization
3. Sign up on Org Admin UI, selecting that organization → log in
4. Create a feature flag, toggle it enabled
5. On End User UI, select the same organization and feature → confirm status matches

## Self-assessment

- **Performance:** Lightweight CRUD app; no heavy computation. MongoDB queries are scoped/indexed appropriately (compound index on flags).
- **Readability & Maintainability:** Routes, controllers, models, and middleware are separated by concern. Each frontend app is a small, focused single-purpose React app.
- **Stability:** Backend validates required fields and role-based access on every protected route; duplicate flags and duplicate organizations are handled explicitly with clear error messages.
- **Testability:** Controllers are separated from routing logic, and endpoints were manually verified end-to-end using Postman (auth, org creation, flag CRUD, public check) before frontend integration.

## Notes

- The backend uses JWT authentication and role-based middleware.
- The `FeatureFlag` model has a compound index to enforce unique `(key, orgId)` values.
- If duplicate flag entries already exist in MongoDB, remove duplicates before creating the unique index.
- Add nested `.env` files to root `.gitignore` using `**/.env`.
- `node_modules/` is excluded via `.gitignore` in each app; run `npm install` in each folder after cloning.

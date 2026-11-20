# CRM Frontend

React single-page app for the Teller CRM backend. It covers contacts, deals (pipeline), tasks, activity log, and reports.

## Tech Stack

- React 19 and TypeScript
- Vite 8 (dev server and production build)
- TanStack Query for server state (caching, mutations)
- Zustand for client state (auth, UI, notifications)
- React Router for routing
- Tailwind CSS v4 (design tokens in `src/index.css` under `@theme`)
- Axios for HTTP
- Lucide React for icons
- oxlint for linting

## Project Structure

```
src/
├── components/
│   ├── common/       # Shared UI: Modal, Sidebar, Header, form fields, toasts
│   ├── features/     # Create/edit forms for contacts, deals, tasks
│   └── layouts/      # DashboardLayout (shell + lazy-loaded routes)
├── pages/            # Route-level pages (login, dashboard, contacts, deals, tasks, activity, reports)
├── hooks/            # TanStack Query hooks per resource
├── services/
│   └── api.ts        # Axios client and endpoint methods
├── store/
│   ├── authStore.ts  # Login state, token in localStorage
│   └── uiStore.ts    # Sidebar, modal, toast notifications
└── types/index.ts    # Entity and API types
```

## Setup

```bash
npm install
cp .env.example .env   # optional; see Environment below
```

## Scripts

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Type-check (tsc -b) and production build into dist/
npm run preview   # Serve the production build locally
npm run lint      # oxlint
```

## Environment

| Variable            | Default                      | Purpose                    |
|---------------------|------------------------------|----------------------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/v1`   | Base URL of the API        |

The Teller backend serves the UI and the API from one origin. Its build script sets `VITE_API_BASE_URL=/v1` so the bundle calls the same host.

## Running Against Teller

Start the backend on port 3000 (its default), then run `npm run dev`. On first run, Teller creates an admin account and writes the generated password to `teller-admin-password.txt` next to the executable. Sign in with that password, then delete the file.

To build the UI into the Teller binary, run `./build.sh` in the Teller repo.

## Authentication

- `POST /auth/login` stores the returned token and user in localStorage.
- Every request sends `Authorization: Bearer <token>`.
- A 401 response clears the token and redirects to `/login`.

## Query and Mutation Behavior

- Queries are cached for 5 minutes (`staleTime`) and garbage-collected after 10.
- Mutations raise toasts through a global `MutationCache`. A mutation can set `meta.successMessage` or `meta.errorMessage` to customize the text.
- List filters are sent as comma-separated values (for example `?status=open,in_progress`). Empty values are dropped.

## Accessibility

- Modals use `role="dialog"`, `aria-modal`, and a labelled title. Escape closes them.
- Icon-only buttons have accessible names.
- The main navigation is a labelled `<nav>` and marks the current page with `aria-current`.
- Page routes are code-split with `React.lazy`.

## Known Gaps

- No automated tests. Vitest and Testing Library are listed in `package.json` but not configured.
- No Prettier config or format script.
- Contacts, deals, and tasks have no detail pages yet; only list views and modals exist.
- No CI pipeline.

## License

TBD

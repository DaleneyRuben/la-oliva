# Deployment

The repository deploys three Vercel projects from one GitHub repository:

| Project             | Vercel project name | Root directory                           | Build command                  | Output directory               |
| ------------------- | ------------------- | ---------------------------------------- | ------------------------------ | ------------------------------ |
| Staff frontend      | `la-oliva-frontend` | `frontend`                               | `yarn build:staff`             | `dist`                         |
| Public registration | `catering-la-oliva` | `frontend`                               | `yarn build:public`            | `dist`                         |
| Shared backend      | `la-oliva-backend`  | repository root (existing configuration) | existing backend configuration | existing backend configuration |

The frontend projects intentionally share `frontend/vercel.json`. Its SPA rewrite sends route
requests to `index.html`, and its `relatedProjects` entry makes the matching backend Preview URL
available to both frontend builds. `vite/resolveApiUrl.ts` uses that related backend for Preview
builds and falls back to `VITE_API_URL` when no matching Preview exists.

## Local development

Run `yarn dev` at the repository root. This remains one combined frontend at
`http://localhost:3000`, with both `/login` and `/registro`, and one backend at
`http://localhost:4000`. Separate local frontend servers are not required.

## Environment variables

Configure the staff frontend with:

- `VITE_API_URL`: the production backend URL including `/api`.

Configure the public frontend with only:

- `VITE_API_URL`: the production backend URL including `/api`.

Do not add JWT, database, Upstash, or other backend secrets to either frontend project. Every
variable prefixed with `VITE_` is compiled into browser-delivered JavaScript and is public.

Configure the backend with:

- `CORS_STAFF_ORIGIN`: the exact canonical production origin of the staff frontend.
- `CORS_PUBLIC_ORIGIN`: the exact canonical production origin of the public frontend.

The backend always accepts `http://localhost:3000`. Preview access is restricted to the exact
Vercel hostname families for `la-oliva-frontend` and `catering-la-oliva` in the
`fernando-daleney-s-projects` team. Renaming either Vercel project or moving it to another team
requires updating the anchored patterns in `backend/src/app.ts`; arbitrary `*.vercel.app` origins
must not be allowed.

## Build isolation

`yarn build:staff` and `yarn build:public` select different HTML entry modules at Vite build time.
The public entry does not import the staff router, `AuthProvider`, React Query client, login, or
authenticated route modules. The combined `src/main.tsx` entry is reserved for local development.

This frontend split reduces accidental staff-code exposure in the public artifact. Backend
authentication and role authorization remain mandatory and are the security authority.

## Rollout order

1. Create `catering-la-oliva` from the same repository with the public settings above, but do not
   promote it yet.
2. Add `CORS_STAFF_ORIGIN` and `CORS_PUBLIC_ORIGIN` to the existing backend project before the code
   deployment. The old backend ignores them, so this is backward compatible.
3. Retain `VITE_API_URL` in the staff project and change its build command to
   `yarn build:staff`.
4. Connect both frontend projects to `la-oliva-backend` as a Vercel Related Project. Confirm a PR
   creates paired Preview deployments and each frontend Preview calls the related backend Preview.
5. Merge only after CI and both frontend Preview smoke tests pass. Vercel then deploys the shared
   backend and both production frontend artifacts from `main`.
6. Verify the staff canonical URL serves `/login` and redirects `/registro` to `/login`. Verify
   the public canonical URL serves `/registro` while `/login` resolves to `/registro`.
7. Remove the obsolete backend `CORS_ORIGIN` variable after the new backend deployment is healthy.

If custom domains are used, set the two backend CORS variables to those canonical origins instead
of the generated `vercel.app` origins.

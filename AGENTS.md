# AGENTS.md

## Scope
- SvelteKit starter kit template for building DiligenceFabric-powered applications. Uses `@ubti/diligence-fabric-sdk` for API integration.

## Start Here
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Type check: `npm run check`
- Lint & format: `npm run lint`, `npm run format`

## Project Layout
- `src/lib/components/` — shared DF UI components (keep for template sync)
- `src/lib/server/DF/` — server-side DF integration logic
- `src/routes/` — SvelteKit file-based routing
- `src/routes/(dfauth)/` — authentication flow pages
- `src/routes/(base)/` — main app layout and pages
- `src/hooks.server.ts` — server hooks (auth middleware)
- `src/params/` — route parameter matchers

## Working Rules
- **SvelteKit 1.x** with Svelte 4, TypeScript 5, and Vite 4
- **Tailwind CSS** for styling; Flowbite Svelte for component library
- **MSAL** (`@azure/msal-browser`) handles Azure AD authentication
- **DF SDK** (`@ubti/diligence-fabric-sdk`) is the standard API client — do not write raw API calls
- **Prettier + ESLint** for formatting (`.prettierrc` + `.eslintrc.cjs`)
- Menu location configurable via `PUBLIC_MENU_LOCATION` env var (`top` or `side`)
- Keep `src/lib/components/` and `src/lib/server/DF/` intact for template upgrades
- Environment config in `.env` (copy from `env.sample`)
- Adapter: `@sveltejs/adapter-node` or `svelte-adapter-azure-swa` for deployment

## Validation
```bash
npm run check
npm run lint
npm run build
```

## References
- [README.md](README.md) — setup, upgrade, and deployment guide
- [env.sample](env.sample) — required environment variables

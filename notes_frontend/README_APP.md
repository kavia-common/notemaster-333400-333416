# NoteMaster Frontend

Routes:
- `/` landing
- `/login` sign in
- `/register` sign up
- `/app` authenticated notes experience

Environment variables (already present in `.env`):
- `NEXT_PUBLIC_API_BASE`: backend base URL used by `src/lib/api.ts`

Auth:
- Token is stored in `localStorage` under `nm_token`.
- `src/components/auth/Guard.tsx` redirects unauthenticated users to `/login`.

API integration:
- `src/lib/api.ts` is the only module that should be adapted to backend endpoint shapes.
- If backend isn't ready, mock mode is used as a fallback; you can force it with `NEXT_PUBLIC_USE_MOCK=true`.

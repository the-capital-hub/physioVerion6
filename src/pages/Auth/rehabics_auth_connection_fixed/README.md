# Rehabics Auth connection fix

## Frontend
1. Replace your existing `src/.../Auth.jsx` with this `Auth.jsx` (keep its current path).
2. In the frontend root, create/update `.env`:
   `VITE_API_URL=http://localhost:5000/api`
3. Restart Vite after changing `.env`:
   `npm run dev`

## Backend
The supplied backend mounts auth routes at:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- Health check: `GET /api/health`

Start the backend from its backend folder using its configured script (`npm run dev` if available). It requires a valid MongoDB URI and JWT_SECRET in the backend `.env`.

## CORS
The backend currently permits only `FRONTEND_URL` (default `http://localhost:5173`). If Vite runs on another port, set the backend `.env` to the exact frontend origin, for example:
`FRONTEND_URL=http://localhost:5174`
Then restart the backend.

## Admin role
The public registration endpoint only accepts `patient` and `physiotherapist`. Create an admin through the backend's trusted admin creation flow; do not expose admin registration publicly.

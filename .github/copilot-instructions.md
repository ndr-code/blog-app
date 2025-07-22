# Copilot Instructions for blog-app

## Project Overview

- This is a Next.js (App Router) blog application using TypeScript and Tailwind CSS.
- The app integrates with an external REST API: https://blogger-wph-api-production.up.railway.app/api/
- Main features: Home, Search, Detail, Write/Edit Post, Profile, Register, Login.
- UI follows a Figma design (see README for link).

## Architecture & Key Patterns

- Pages are in `src/app/` using Next.js App Router conventions (`page.tsx`, `layout.tsx`, etc.).
- API routes are in `src/app/api/` and act as proxies to the external API, handling auth and error formatting.
- Components are organized by type: `src/components/pages/` (page views), `src/components/ui/` (UI elements), `src/components/layout/` (layout parts).
- Contexts for global state (auth, comments, tooltips) are in `src/context/`.
- Custom hooks for data fetching and UI logic are in `src/hooks/`.
- Utility functions (API helpers, formatting) are in `src/utils/`.

## Data Flow & API Integration

- All API calls from the frontend go through `/api/*` Next.js routes, which forward requests to the external API and inject Authorization headers if available.
- Auth token is managed in React context (`AuthContext`) and synced to localStorage.
- Posting data (e.g., creating a post) uses `FormData` and always includes the `Authorization` header if logged in.
- Error responses from the backend are normalized in API route handlers using `handleApiError`.

## Developer Workflow

- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Build for production: `npm run build`
- Deploy: Vercel (see README for live link)
- No custom test scripts; manual testing via UI and API responses.

## Project-Specific Conventions

- Use TypeScript for all code (including API routes).
- Use Tailwind CSS for all styling; avoid inline styles.
- Use React context for global state (auth, comments, tooltips).
- Use custom hooks for all data fetching and mutation logic.
- All API requests from client components should go through `/api/*` routes, not directly to the external API.
- For file uploads (images), use `FormData` and ensure the backend expects `multipart/form-data`.
- Tags for posts are sent as either a JSON string or as repeated `tags[]` fields, depending on backend requirements.
- Error handling: always surface backend error messages to the user and log details to the console for debugging.

## Key Files & Directories

- `src/app/` - Next.js pages and API routes
- `src/components/pages/` - Main page views (HomeView, WritePostView, etc.)
- `src/components/ui/` - Reusable UI components
- `src/context/AuthContext.tsx` - Auth state and token management
- `src/hooks/useAuth.ts` - Auth hook for accessing context
- `src/utils/apiUtils.ts` - API helpers for fetch and error handling
- `src/app/api/posts/route.ts` - Proxy for post creation, handles FormData and auth

## Example: Creating a Post

- Use the `WritePostView` component and submit via `/api/posts`.
- Always include the `Authorization` header if logged in.
- Send image as a file in `FormData`.
- Tags can be sent as a JSON string or as repeated fields (check backend docs).
- Handle errors by displaying the backend message and logging details.

---

If any conventions or workflows are unclear, please ask for clarification or provide feedback to improve these instructions.

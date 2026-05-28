# BengkelPro Frontend (Next.js + Tailwind CSS v4)

This package contains the Next.js App Router frontend for BengkelPro, designed with a premium, mobile-first dark-themed motorcycle sparepart catalog.

## Tech Stack

*   **Core**: Next.js App Router, React 19, TypeScript
*   **Styling**: Tailwind CSS v4, custom utility layers (glassmorphism, radial gradient overlays, CSS variable theme tokens)
*   **State Management**: Zustand 5
*   **Icons**: Lucide React
*   **Notifications**: Sonner (embedded with custom layout styling)
*   **Animations**: Framer Motion

---

## Folder Reorganization (Clean Architecture)

We maintain modularity by isolating responsibilities into clear layers:

*   **`src/domain/`**: Enterprise core entities (pure structures, types, and schema validations). Contains `api.ts`, `auth.ts`, `product.ts`, `cart.ts`, and `order.ts`.
*   **`src/data/`**: Gateways and infrastructure. Handles networking requests via `api/httpClient.ts`, `api/authApi.ts`, and wraps business features in `services/`.
*   **`src/presentation/`**: Visual layers and interaction states.
    *   `components/layout/` - Shared layouts like `MobileNav`, headers, footers.
    *   `components/product/` - Product displays and category scrolls.
    *   `components/ui/` - Primitives and reusable helpers like `EmptyState` or `Toaster`.
    *   `hooks/` - Shared interaction helpers like `useDebounce`.
    *   `stores/` - Local client store instances managed by Zustand.
*   **`src/lib/`**: Context-free helpers like currency formatters and WhatsApp message compilers.

---

## Key Scripts

Navigate to `/frontend` and use the following scripts for development:

*   **Start Development Server**:
    ```bash
    npm run dev
    ```
    Runs the dev environment with Turbopack enabled on port `3000`.
*   **Production Build Compilation**:
    ```bash
    npm run build
    ```
    Creates an optimized static page bundle.
*   **TypeScript Verification**:
    ```bash
    npx tsc --noEmit
    ```
    Typechecks the entire codebase.

---

## Design System & Themes

The styling is handled entirely within `globals.css` using custom theme mappings compatible with Tailwind CSS v4:
*   `--background`: `#060912` (Vibrant deep dark)
*   `--card`: `#0F1421` (Refined card container surface)
*   `--primary`: `#E11D48` (Crimson red brand color)
*   `--border`: `rgba(255,255,255,0.07)` (Semi-transparent boundaries)
*   `.glass`: Backdrop-filter glassmorphism overlay utility
*   `.shadow-glow`: Dynamic box shadow glow styling for active buttons

All responsive elements are optimized for small touch screens (375px–430px) as well as desktops.

# Tailor AI Design System Specification

This document serves as the absolute, comprehensive single source of truth for the visual, structural, and behavioral design language of **Tailor AI**. It captures the exact MVP implementation to ensure that all future modifications, new components, or pages remain pixel-perfect and aligned with the established "enterprise-grade SaaS" visual identity.

---

## 1. Design Philosophy

Tailor AI is designed with an **Enterprise-Grade SaaS** aesthetic, reminiscent of leading platforms like Vercel and Stripe. The interface prioritizes high-fidelity subscription intelligence, presenting complex analytical insights with high clarity, clean visual structures, and refined typography.

*   **Aesthetic Tone:** Clean, minimal, professional, data-first, trustworthy, and modern.
*   **Architectural Honesty:** High contrast, zero unrequested clutter or decorative terminal lines. Margins and rails are completely clean. Elements are humble and literal.
*   **Visual Balance:** Abundant negative space combined with high information density within data components.
*   **Container Identity:** Employs a bespoke `.glass-card` layout using soft backgrounds, fine border weights, and high-quality background blur filters to sit elegantly over the clean gradient canvas.

---

## 2. Color System

Every color used is registered under the application's Tailwind CSS configuration (`@theme` inside `src/index.css`).

### Primary & Brand Colors
*   **Primary (Main Text & Deep Accents):** `#091426` (Tailwind Class: `text-primary`, `bg-primary`)
*   **Brand / Accent Indigo:** `#4b41e1` (Tailwind Class: `text-secondary`, `bg-secondary`)
*   **Tertiary (Dark Navy Canvas Detail):** `#001624` (Tailwind Class: `text-tertiary`, `bg-tertiary`)

### Backgrounds & Surfaces
*   **Main App Background:** `#f8f9ff` (Tailwind Class: `bg-background` or `bg-surface`) - A cold, premium light blue/off-white that keeps the dashboard feeling light and airy.
*   **Container Lowest (Pure White cards):** `#ffffff` (Tailwind Class: `bg-surface-container-lowest`)
*   **Container Low (Light Slate/Blue grey):** `#eff4ff` (Tailwind Class: `bg-surface-container-low`)
*   **Container Standard:** `#e5eeff` (Tailwind Class: `bg-surface-container`)
*   **Container High:** `#dce9ff` (Tailwind Class: `bg-surface-container-high`)
*   **Container Highest:** `#d3e4fe` (Tailwind Class: `bg-surface-container-highest`)
*   **Primary Container (Deep Slate):** `#1e293b` (Tailwind Class: `bg-primary-container`)

### Muted & Outline Colors
*   **Outline Standard (Fine Borders):** `#75777d` (Tailwind Class: `border-outline`)
*   **Outline Variant (Softer Borders):** `#c5c6cd` (Tailwind Class: `border-outline-variant`)
*   **Solid Text Secondary (On Surface Variant):** `#45474c` (Tailwind Class: `text-on-surface-variant`)
*   **Muted Text (Slate/Grey):** `#8590a6` or `#cbd5e1`

### Semantic Feedback Colors
*   **Success (Low Risk / High Health):**
    *   Text / Icons: `text-emerald-700` (`#047857`)
    *   Backgrounds: `bg-emerald-50` (`#ecfdf5`)
    *   Borders: `border-emerald-200/60`
    *   Solid Indicators: `bg-emerald-500`
*   **Warning (Medium Risk / Warning State):**
    *   Text / Icons: `text-amber-700` (`#b45309`)
    *   Backgrounds: `bg-amber-50` (`#fffbeb`)
    *   Borders: `border-amber-200/60`
    *   Solid Indicators: `bg-amber-500`
*   **Error / Danger (High Risk / Failure):**
    *   Text / Icons: `text-red-700` (`#b91c1c`)
    *   Backgrounds: `bg-red-50` (`#fef2f2`)
    *   Borders: `border-red-200/60`
    *   Solid Indicators: `bg-red-500`

---

## 3. Typography

The type scale is meticulously mapped inside `src/index.css` under utility classes, leveraging **Manrope** for headlines and display, and **Inter** for standard interface and body elements.

| Style Name | Font Family | Size | Line Height | Weight | Letter Spacing | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Large** | Manrope | 48px | 56px | 700 (Bold) | `-0.02em` | `font-display-lg text-display-lg` |
| **Headline Large**| Manrope | 32px | 40px | 600 (Semibold)| `-0.01em` | `font-headline-lg text-headline-lg` |
| **Headline Medium**| Manrope | 24px | 32px | 600 (Semibold)| `normal` | `font-headline-md text-headline-md` |
| **Title Large** | Inter | 20px | 28px | 600 (Semibold)| `normal` | `font-title-lg text-title-lg` |
| **Body Large** | Inter | 16px | 24px | 400 (Regular) | `normal` | `font-body-lg text-body-lg` |
| **Body Medium** | Inter | 14px | 20px | 400 (Regular) | `normal` | `font-body-md text-body-md` |
| **Label Medium** | Inter | 12px | 16px | 600 (Semibold)| `0.05em` | `font-label-md text-label-md` |
| **Mono Medium** | Inter | 14px | 20px | 500 (Medium) | `normal` | `font-mono-md text-mono-md` |

---

## 4. Iconography

Tailor AI relies exclusively on vector icon systems to guarantee sharpness and performance.

### Standard Icons (Lucide React & Google Symbols)
*   **Lucide React:** Used across generic interface states, charts, and actions.
*   **Material Symbols Outlined:** Standard utility navigation icons mapped via custom Google Web fonts.
    *   *Treatment Rules:* Sizes should strictly be constrained to standard sizes (`text-base` for inline or small UI elements, `text-lg` or `!text-[18px]` inside navigation buttons, `text-2xl` for display indicators).
    *   *Active States:* Navigational and control icons use fill properties on active states:
        ```css
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        ```

---

## 5. Component Patterns

All UI elements must fit into five core structural components to maintain structural harmony.

### 5.1. Navigation
*   **Sidebar (220px Fixed):**
    *   *Structural Container:* `h-screen w-[220px] flex-shrink-0 bg-surface border-r border-outline-variant flex flex-col p-4 gap-3 sticky top-0`
    *   *Brand Header:* Text size `text-xl` tracking-tight primary text paired with a descriptive subtitle in `text-[11px] font-medium text-on-surface-variant`.
    *   *Navigation Row Item:* `flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-left text-sm cursor-pointer`
    *   *Active State:* `bg-indigo-50 text-indigo-700 font-semibold`
    *   *Inactive State:* `text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900`
*   **Floating Profile Control (Sidebar Bottom):**
    *   *Container:* `p-2.5 bg-surface-container-low rounded-lg flex items-center gap-2 cursor-pointer hover:bg-surface-container transition-colors`
    *   *User Headshot:* `w-8 h-8 rounded-full object-cover`

### 5.2. Cards
*   **The Glass Card Container (`.glass-card`):**
    *   *CSS Styling:*
        ```css
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        ```
    *   *Anatomy:* Typically wrapped inside `rounded-xl overflow-hidden border border-white/30`. Padding is optimized for information density: standard card uses `p-5` or `p-6`.

### 5.3. Tables
*   **Container Pattern:** Tables are wrapped inside a `.glass-card` layout with `rounded-xl overflow-hidden shadow-sm`.
*   **Table Headers (thead):**
    *   *Styling:* `px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 cursor-pointer group bg-slate-50`
*   **Table Rows (tbody tr):**
    *   *Styling:* `border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer transition-colors duration-150`
    *   *Text Treatment:* Company primary name uses `text-sm font-semibold text-slate-900`, secondary domains use `text-xs text-slate-500`.

### 5.4. Badges
All badges are built using "soft backgrounds + colored borders + colored text" treatments.

*   **Risk Badges:**
    *   *Low Risk:* `bg-emerald-50 text-emerald-700 border border-emerald-200/60` (With an inline `w-1.5 h-1.5 rounded-full bg-emerald-500` dot).
    *   *Medium Risk:* `bg-amber-50 text-amber-700 border border-amber-200/60` (With an inline `w-1.5 h-1.5 rounded-full bg-amber-500` dot).
    *   *High Risk:* `bg-red-50 text-red-700 border border-red-200/60` (With an inline `w-1.5 h-1.5 rounded-full bg-red-500` dot).
*   **Plan Badges:**
    *   *Treatment:* `px-2 py-0.5 bg-slate-100 rounded text-[10px] text-gray-600 font-semibold uppercase`

### 5.5. Charts
*   **Recharts Integration:** Chart visualizers inherit CSS theme-defined variables dynamically.
    *   *Colors:* Tooltips leverage `.glass-card` styling for background consistency. Line and Area paths use `--color-secondary` (`#4b41e1`) with subtle, translucent gradients.

---

## 6. Animation Guidelines

Animations are implemented strictly via `motion/react` (the modern successor to Framer Motion) to guide layout transitions and state changes gracefully.

*   **Page / Route Transitions:** Route-level containers use fade-in-up animations to establish entering fluidity:
    ```typescript
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // Elegant out-quart ease
    ```
*   **Toast and Popup Banners:** Enter from top-center, exit upward:
    ```typescript
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    ```
*   **Micro-interactions (Hover):** Transition effects on lists, rows, and buttons must utilize a uniform duration and curve:
    *   *Class:* `transition-all duration-150 ease-out` (For hover elevation/bg shifts).

---

## 7. File Structure & Conventions

Consistency in path structures is essential for seamless code generation and building.

*   `/src/main.tsx` - Main React root bootstrapped with Vite.
*   `/src/App.tsx` - Root app component controlling layout and stateful client-side routing (`currentView` state).
*   `/src/index.css` - Single entry point for global styling, theme configurations, custom CSS classes, and font declarations.
*   `/src/components/` - Extracted, reusable UI and layout elements (e.g., `Sidebar.tsx`, `LandingLogo.tsx`, `HealthRing.tsx`, `Footer.tsx`).
*   `/src/pages/` - Core view definitions (e.g., `Dashboard.tsx`, `Customers.tsx`, `CustomerDetails.tsx`, `Insights.tsx`, `Settings.tsx`, `LoginPage.tsx`).
*   `/tsconfig.json` & `/package.json` - Type configuration and project dependency managers. Custom types should strictly live inside `/src/types.ts` or `/types.d.ts`.

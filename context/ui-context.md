# UI Context

## Theme

MGK Architects uses a single-mode, high-contrast, editorial stark minimalist design language. The interface uses pure white backgrounds, absolute black typography, and large blocks of solid black reserved exclusively for high-impact structural panels (such as the footer and the slide-out navigation menu). The system does not support dark mode, relying instead on clean geometries, extreme negative space, and refined typographical layouts to establish elegance.

## Colors

All components must strictly use these semantic tokens as CSS variables mapped inside `@theme` — no hardcoded hex values are allowed in the components.

| Role                     | CSS Variable        | Value     | Description |
| :---                     | :---                | :---      | :--- |
| **Page background**      | `--bg-base`         | `#ffffff` | Pure White; used for the primary website canvas. |
| **Surface background**   | `--bg-surface`      | `#ffffff` | Pure White; used for cards, popups, and dialogs. |
| **Contrast background**  | `--bg-contrast`     | `#000000` | Solid Black; strictly reserved for the footer and slide-out navigation overlay. |
| **Selection background** | `--bg-selected`     | `#f4f4f5` | Zinc-100; a very subtle light gray used as a background indicator for active form choices. |
| **Primary text**         | `--text-primary`    | `#000000` | Solid Black; used for all main headings, labels, and body copy. |
| **Muted text**           | `--text-muted`      | `#71717a` | Zinc-500; a medium gray used for descriptions, subtexts, and default placeholders (safely meets WCAG 4.5:1 contrast requirements). |
| **Primary accent**       | `--accent-primary`  | `#000000` | Solid Black; used for active interactives, links, and buttons. |
| **Default border**       | `--border-default`  | `#e4e4e7` | Zinc-200; a fine, subtle, muted gray used for default borders and form underlines. |
| **Active border**        | `--border-active`   | `#000000` | Solid Black; used for borders or underlines when focused, active, or successfully filled. |
| **Scrollbar thumb**      | `--scrollbar-thumb` | `#d6d3d1` | Stone-300; used specifically for custom scrollbar indicator thumbs. |

## Typography

The platform utilizes a single, high-end sans-serif font family: **LT Superior**. No serif, hovers, or system fonts are permitted for primary text.

| Role               | Font        | Variable      | Weights |
| :---               | :---        | :---          | :--- |
| **UI & Body text** | LT Superior | `--font-sans` | Normal (`400`), Medium (`500`), Semibold (`600`), Bold (`700`) |
| **Code/mono**      | System Mono | `--font-mono` | Normal (`400`) — used strictly for technical subtext identifiers |

## Border Radius

The system implements a unified design system. The public frontend uses strictly razor-sharp 90-degree corners to represent raw architectural forms. The Payload CMS Admin Panel uses its standard, highly legible rounded system interface out of the box.

| Context | Public Frontend (Vercel) | Admin CMS (Payload Native) | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **Inline / small UI** | `0px` (`rounded-none`) | System Default | Small buttons, badges |
| **Cards / panels** | `0px` (`rounded-none`) | System Default | Project cards, text areas |
| **Modals / sidebars** | `0px` (`rounded-none`) | System Default | Sidebars, overlay boxes |

## Component Library

- **100% Custom Frontend**: The public website does not use pre-made component libraries (such as shadcn/ui or Radix). All public UI elements, headers, footers, and contact forms are built completely from scratch using raw Tailwind CSS v4 utility classes to ensure an un-bloated, highly optimized, and unique visual identity.
- **Admin CMS Panel**: The admin environment is served natively by Payload CMS v3, providing a secure, polished, and fully responsive user interface without requiring custom frontend coding.

## Layout & Image Patterns

- **Split-Screen Viewport**: The public Contact Page uses a split-screen layout (the left 45.7vw is a static, high-res site photograph; the right 38.2vw is dedicated to clean, vertically aligned contact forms and success messages).
- **Muted Underline Inputs**: Public form text inputs use a bottom border only (`border-b`). The default state is a subtle muted gray (`--border-default`), transitioning to solid black (`--border-active`) when focused or successfully filled.
- **Aspect-Ratio Locking**: To prevent **Cumulative Layout Shift (CLS)** during image loading, all portfolio images must be placed inside containers with fixed aspect-ratio properties (such as `aspect-video` or `aspect-[16/10]`) and use a default skeleton background (`bg-zinc-100`).

## Icons

- **SVG Inline Iconography**: The public frontend does not import heavy third-party icon libraries. All icons must be written directly as raw inline SVGs inside your React code, using stroke-based paths, custom stroke weights, and a default size of `size-5` (`h-5 w-5` or 20px).

## Z-Index Layer Hierarchy

To prevent overlapping, clipping, or hiding bugs, you must strictly follow this stacking order:
- **`z-50` (Alert Modals / Notifications)**: Active message alerts or form success panels.
- **`z-40` (Slide-Out Panels)**: Custom mobile/desktop navigation menu, footer wrappers.
- **`z-30` (Header / Navbar)**: Top main navigation bar.
- **`z-10` (Foreground Content)**: Public forms, portfolio grids, normal page layouts.
- **`z-0` (Base Canvas)**: Background page colors.

## Interactive Micro-Interactions

- **Button Hover Opacity**: Hovering over any active button or click-target must smoothly lower its opacity (transitioning from `opacity-100` to `opacity-50` using `transition-all duration-300 hover:opacity-50 cursor-pointer`).
- **Input Focus Transitions**: When an input or textarea gains focus or is successfully filled, its border must smoothly transition from a muted gray (`--border-default`) to a solid, highly visible black (`--border-active`).
- **Accessibility Focus Rings**: Bypassing browser focus outlines with `outline-none` is permitted *only* if you write a custom, high-contrast visual replacement (such as darkening the bottom border `border-black` or adding a custom black outline) to ensure keyboard navigation remains completely visible.

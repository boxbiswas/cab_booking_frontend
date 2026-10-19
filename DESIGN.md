# HopIn Design System

**Theme:** Peach Glow (light mode)
**Stack:** React + Vite, Tailwind CSS 3.4+
**Tagline:** *Hop in. Go anywhere.*

HopIn is a cab-booking app for riders and drivers. The visual language is warm, friendly and energetic, built on translucent glass surfaces floating over a soft peach-to-cream gradient. It should feel like a modern lifestyle brand while staying clear and trustworthy during a ride.

---

## 1. Design Principles

1. **Warm, not loud.** Coral leads, rose and gold support. Large areas stay soft and calm.
2. **Glass with purpose.** Blur and transparency separate layers (map, panels, modals). Never use glass decoratively on top of glass.
3. **Legibility first.** Panels over the map use at least 60% white opacity. Text contrast beats aesthetics.
4. **One primary action per screen.** Book, Accept, Pay. It is always the coral button.
5. **Status is color plus icon plus text.** Never color alone.
6. **Thumb-friendly.** Primary actions sit in the bottom third on mobile, minimum 44px touch targets.

---

## 2. Brand

| Item | Value |
|---|---|
| Name | HopIn (capital H, capital I) |
| Logo mark | Rounded-square coral gradient tile with a white upward "hop" arrow or car-door glyph |
| Wordmark | `HopIn` in Plus Jakarta Sans ExtraBold, tracking `-0.02em`, color `ink-900`, with "In" optionally in `primary-500` |
| Min clear space | Height of the "H" on all sides |
| Favicon / app icon | Mark only, on a coral gradient |

---

## 3. Color Tokens

### 3.1 Brand palette

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#FFF3EE` | Tinted backgrounds, hover fills |
| `primary-100` | `#FFE3D8` | Selected card tint |
| `primary-200` | `#FFC9B5` | Borders on active elements |
| `primary-300` | `#FFAA8F` | Illustrations, disabled primary |
| `primary-400` | `#FF9171` | Hover highlights |
| **`primary-500`** | **`#FF7A59`** | **Brand coral. Gradients, icons, focus rings, large accents** |
| `primary-600` | `#E8532E` | Buttons with white text, links |
| `primary-700` | `#C9411F` | Pressed state, small link text |
| `secondary-50` | `#FFF1F5` | Soft rose backgrounds |
| `secondary-200` | `#FFD0DC` | Rose borders |
| **`secondary-400`** | **`#FF9EB5`** | **Rose. Secondary buttons, gradient stops, chips** |
| `secondary-600` | `#E0577C` | Rose text on light surfaces |
| `accent-50` | `#FFF8E8` | Highlight backgrounds |
| `accent-200` | `#FFE3A8` | Gold borders |
| **`accent-400`** | **`#FFC46B`** | **Golden yellow. Ratings, promo badges, highlights** |
| `accent-600` | `#C9871A` | Gold text on light surfaces |

### 3.2 Neutrals (warm)

| Token | Hex | Usage |
|---|---|---|
| `ink-900` | `#3B2A2A` | Headings |
| `ink-700` | `#5C4A4A` | Strong body, labels |
| `ink-500` | `#7A6A6A` | Body text |
| `ink-400` | `#A39494` | Placeholders, captions |
| `ink-300` | `#C9BDBD` | Disabled text |
| `ink-200` | `#E8DFDF` | Dividers |
| `cream-50` | `#FFFBF7` | Page base |
| `cream-100` | `#FFF5EC` | Gradient end |

### 3.3 Semantic and ride-status colors

| Status | Text/Icon | Soft background | Icon |
|---|---|---|---|
| `REQUESTED` | `#B7791F` | `#FFF4D6` | clock |
| `ACCEPTED` | `#2563EB` | `#E3EDFF` | check |
| `DRIVER_ARRIVING` | `#0891B2` | `#DDF6FB` | navigation arrow |
| `IN_PROGRESS` | `#7C3AED` | `#EEE6FF` | car |
| `COMPLETED` | `#059669` | `#DCF7EC` | check-circle |
| `CANCELLED` | `#E11D48` | `#FFE1E8` | x-circle |
| `SOS / EMERGENCY` | `#DC2626` | `#FFE0E0` | shield-alert (with pulse) |

Generic feedback: success `#059669`, warning `#D97706`, error `#E11D48`, info `#2563EB`.

### 3.4 Gradients

```css
--bg-app: linear-gradient(135deg, #FFE3D0 0%, #FFD6E0 45%, #FFF5EC 100%);
--grad-primary: linear-gradient(135deg, #FF7A59 0%, #E8532E 100%);
--grad-primary-soft: linear-gradient(135deg, #FFB199 0%, #FF9EB5 100%);
--grad-accent: linear-gradient(135deg, #FFC46B 0%, #FF9E5E 100%);
--grad-glass-sheen: linear-gradient(145deg, rgba(255,255,255,.75), rgba(255,255,255,.35));
```

**Background mesh:** layer 2 to 3 blurred blobs over `--bg-app` (coral at top-left, rose at right, gold at bottom) with `blur-3xl` and 30 to 40% opacity. Keep them `fixed`, `pointer-events-none`, and `-z-10`.

---

## 4. Glassmorphism Recipe

| Level | Use | Background | Blur | Border | Shadow |
|---|---|---|---|---|---|
| **Glass-1 (subtle)** | Nav bar, chips, list rows | `bg-white/40` | `backdrop-blur-md` | `border-white/50` | `shadow-glass-sm` |
| **Glass-2 (card)** | Default cards, forms | `bg-white/55` | `backdrop-blur-xl` | `border-white/60` | `shadow-glass` |
| **Glass-3 (strong)** | Panels over the map, bottom sheets, modals | `bg-white/70` | `backdrop-blur-2xl` | `border-white/70` | `shadow-glass-lg` |
| **Glass-tint** | Selected or highlighted card | `bg-primary-50/70` | `backdrop-blur-xl` | `border-primary-200/70` | `shadow-glow` |

Rules:
- Always pair blur with a 1px light border. The border defines the glass edge.
- Add an inner top highlight: `shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`.
- Never nest Glass-2 or higher inside another glass surface. Use solid `white/60` or a tint instead.
- Fallback when `backdrop-filter` is unsupported: `bg-white/90`.
- Over the map, use Glass-3 only.

---

## 5. Tailwind Configuration

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF3EE', 100: '#FFE3D8', 200: '#FFC9B5', 300: '#FFAA8F',
          400: '#FF9171', 500: '#FF7A59', 600: '#E8532E', 700: '#C9411F',
        },
        secondary: {
          50: '#FFF1F5', 200: '#FFD0DC', 400: '#FF9EB5', 600: '#E0577C',
        },
        accent: {
          50: '#FFF8E8', 200: '#FFE3A8', 400: '#FFC46B', 600: '#C9871A',
        },
        ink: {
          900: '#3B2A2A', 700: '#5C4A4A', 500: '#7A6A6A',
          400: '#A39494', 300: '#C9BDBD', 200: '#E8DFDF',
        },
        cream: { 50: '#FFFBF7', 100: '#FFF5EC' },
        status: {
          requested: '#B7791F', accepted: '#2563EB', arriving: '#0891B2',
          progress: '#7C3AED', completed: '#059669', cancelled: '#E11D48',
          sos: '#DC2626',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h1': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h2': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h3': ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h4': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        'xl': '1rem', '2xl': '1.25rem', '3xl': '1.75rem', '4xl': '2.25rem',
      },
      boxShadow: {
        'glass-sm': '0 4px 16px rgba(232, 83, 46, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass': '0 8px 32px rgba(232, 83, 46, 0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass-lg': '0 16px 48px rgba(232, 83, 46, 0.14), inset 0 1px 0 rgba(255,255,255,0.85)',
        'glow': '0 8px 28px rgba(255, 122, 89, 0.35)',
        'glow-sm': '0 4px 14px rgba(255, 122, 89, 0.30)',
        'sos': '0 0 0 0 rgba(220, 38, 38, 0.5)',
      },
      backgroundImage: {
        'app': 'linear-gradient(135deg, #FFE3D0 0%, #FFD6E0 45%, #FFF5EC 100%)',
        'primary-grad': 'linear-gradient(135deg, #FF7A59 0%, #E8532E 100%)',
        'primary-soft': 'linear-gradient(135deg, #FFB199 0%, #FF9EB5 100%)',
        'accent-grad': 'linear-gradient(135deg, #FFC46B 0%, #FF9E5E 100%)',
      },
      keyframes: {
        'sos-pulse': {
          '0%':   { boxShadow: '0 0 0 0 rgba(220,38,38,0.55)' },
          '70%':  { boxShadow: '0 0 0 18px rgba(220,38,38,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(220,38,38,0)' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'sos-pulse': 'sos-pulse 1.6s ease-out infinite',
        'sheet-up': 'sheet-up 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'shimmer': 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
```

---

## 6. Global CSS (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { -webkit-tap-highlight-color: transparent; }
  body {
    @apply bg-app bg-fixed text-ink-500 font-sans antialiased min-h-screen;
  }
  h1, h2, h3, h4 { @apply font-display text-ink-900; }
  :focus-visible { @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-cream-50; }
  ::selection { background: #FFC9B5; color: #3B2A2A; }
}

@layer components {
  /* ---------- Glass surfaces ---------- */
  .glass-1 { @apply bg-white/40 backdrop-blur-md border border-white/50 shadow-glass-sm; }
  .glass-2 { @apply bg-white/55 backdrop-blur-xl border border-white/60 shadow-glass; }
  .glass-3 { @apply bg-white/70 backdrop-blur-2xl border border-white/70 shadow-glass-lg; }
  .glass-tint { @apply bg-primary-50/70 backdrop-blur-xl border border-primary-200/70 shadow-glow-sm; }

  @supports not (backdrop-filter: blur(1px)) {
    .glass-1, .glass-2, .glass-3, .glass-tint { @apply bg-white/90; }
  }

  /* ---------- Cards ---------- */
  .card { @apply glass-2 rounded-3xl p-5 sm:p-6; }
  .card-interactive {
    @apply card transition duration-200 hover:-translate-y-0.5 hover:shadow-glass-lg cursor-pointer;
  }
  .card-selected { @apply glass-tint rounded-3xl p-5 ring-2 ring-primary-500/60; }

  /* ---------- Buttons ---------- */
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-2xl px-6 h-12
           font-display font-semibold text-base transition duration-200
           active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none;
  }
  .btn-primary { @apply btn bg-primary-grad text-white shadow-glow hover:shadow-glow-sm hover:brightness-105; }
  .btn-secondary { @apply btn glass-2 text-ink-900 hover:bg-white/80; }
  .btn-rose { @apply btn bg-secondary-400 text-ink-900 hover:bg-secondary-400/90; }
  .btn-ghost { @apply btn text-primary-600 hover:bg-primary-50/80; }
  .btn-danger { @apply btn bg-status-cancelled text-white hover:brightness-105; }
  .btn-sm { @apply h-10 px-4 text-sm rounded-xl; }
  .btn-lg { @apply h-14 px-8 text-lg rounded-2xl; }
  .btn-icon { @apply h-11 w-11 p-0 rounded-full glass-2 text-ink-700 hover:text-primary-600; }

  /* ---------- Inputs ---------- */
  .input {
    @apply w-full h-12 px-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70
           text-ink-900 placeholder:text-ink-400 shadow-[inset_0_1px_2px_rgba(59,42,42,0.04)]
           transition focus:bg-white/90 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/15 focus:outline-none;
  }
  .input-error { @apply border-status-cancelled focus:ring-status-cancelled/15; }
  .label { @apply block mb-1.5 text-sm font-medium text-ink-700; }
  .help { @apply mt-1.5 text-xs text-ink-400; }
  .error-text { @apply mt-1.5 text-xs font-medium text-status-cancelled; }

  /* ---------- Chips and badges ---------- */
  .chip { @apply inline-flex items-center gap-1.5 rounded-full px-3 h-8 text-sm font-medium glass-1 text-ink-700; }
  .chip-active { @apply chip bg-primary-500 text-white border-transparent shadow-glow-sm; }
  .badge { @apply inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold; }
  .badge-requested { @apply badge bg-[#FFF4D6] text-status-requested; }
  .badge-accepted { @apply badge bg-[#E3EDFF] text-status-accepted; }
  .badge-arriving { @apply badge bg-[#DDF6FB] text-status-arriving; }
  .badge-progress { @apply badge bg-[#EEE6FF] text-status-progress; }
  .badge-completed { @apply badge bg-[#DCF7EC] text-status-completed; }
  .badge-cancelled { @apply badge bg-[#FFE1E8] text-status-cancelled; }
  .badge-sos { @apply badge bg-[#FFE0E0] text-status-sos; }

  /* ---------- Skeleton ---------- */
  .skeleton {
    @apply rounded-2xl bg-[length:800px_100%] animate-shimmer;
    background-image: linear-gradient(90deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,.75) 50%, rgba(255,255,255,.35) 100%);
  }
}
```

---

## 7. Typography

| Role | Font | Weight | Size (desktop / mobile) | Color |
|---|---|---|---|---|
| Display (landing hero) | Plus Jakarta Sans | 800 | 48 / 34 px | `ink-900` |
| H1 | Plus Jakarta Sans | 800 | 36 / 28 px | `ink-900` |
| H2 | Plus Jakarta Sans | 700 | 28 / 22 px | `ink-900` |
| H3 | Plus Jakarta Sans | 700 | 22 / 19 px | `ink-900` |
| H4 / card title | Plus Jakarta Sans | 600 | 18 px | `ink-900` |
| Body | Inter | 400 | 16 px | `ink-500` |
| Body strong | Inter | 500 to 600 | 16 px | `ink-700` |
| Small / meta | Inter | 400 | 14 px | `ink-500` |
| Caption | Inter | 500 | 12 px | `ink-400` |
| Fare / price | Plus Jakarta Sans | 800 | 28 to 40 px, tabular numbers | `ink-900` |
| OTP / codes / plates | JetBrains Mono | 500 | 18 px, `tracking-widest` | `ink-900` |

Notes: use `tabular-nums` on fares, timers, and ETAs. Body line-height is 1.6, headings 1.15 to 1.3. Maximum reading width is `max-w-prose`.

---

## 8. Spacing, Layout and Radius

- **Base unit:** 4px (Tailwind default scale).
- **Page padding:** `px-4` mobile, `px-6` tablet, `px-8` desktop.
- **Card padding:** `p-5` mobile, `p-6` desktop.
- **Section gap:** `space-y-6` mobile, `space-y-8` desktop.
- **Container:** `max-w-7xl mx-auto`.
- **Grid:** 4 columns mobile, 8 tablet, 12 desktop.

| Element | Radius |
|---|---|
| Buttons, inputs | `rounded-2xl` (20px) |
| Cards | `rounded-3xl` (28px) |
| Bottom sheets, modals | `rounded-t-4xl` / `rounded-4xl` (36px) |
| Chips, badges, avatars | `rounded-full` |
| Map controls | `rounded-full` |

**Breakpoints:** `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Design mobile-first.

---

## 9. Iconography and Imagery

- **Icon set:** Lucide (`lucide-react`), 1.75px stroke, rounded caps.
- **Sizes:** 16 (inline), 20 (buttons, inputs), 24 (nav), 32+ (empty states).
- **Color:** `ink-500` default, `primary-500` active.
- **Illustrations:** soft, rounded, flat shapes using the brand palette. No harsh outlines.
- **Avatars:** circular, 2px white border, soft shadow. Initials fallback on `primary-soft` gradient.
- **Map markers:** pickup is a coral pin with a white center, drop-off is an ink-900 pin with a white center, driver is a coral car icon in a white circle with a pulsing ring, stops are numbered rose circles.

---

## 10. Motion

| Interaction | Animation | Duration / easing |
|---|---|---|
| Hover on card | translate up 2px, shadow grows | 200ms ease-out |
| Button press | scale 0.98 | 100ms |
| Bottom sheet enter | slide up 24px and fade | 320ms `cubic-bezier(0.22,1,0.36,1)` |
| Modal enter | fade and scale from 0.97 | 200ms |
| Driver marker move | linear interpolation between GPS points | 1000ms |
| Skeleton | shimmer sweep | 1.4s linear loop |
| SOS button | red pulse ring | 1.6s loop |
| Route draw | stroke dash reveal | 600ms |

Respect `prefers-reduced-motion`: disable translate, scale, and pulse effects, and keep only opacity fades.

---

## 11. Component Specifications

### 11.1 App shell and navigation
- **Top bar (desktop):** `glass-1`, sticky, `h-16`, logo left, nav center, notifications bell and avatar right.
- **Bottom tab bar (mobile):** `glass-3`, fixed, `rounded-t-3xl`, 4 tabs (Home, Rides, Wallet or Earnings, Profile). Active tab uses a coral icon and a small coral dot.
- **Notification bell:** `btn-icon` with a coral unread dot (`h-2.5 w-2.5`, white ring).

### 11.2 Map screen (rider home)
- Full-bleed map with a light, warm-toned tile style (OpenStreetMap or a light Carto variant).
- **Floating search panel:** `glass-3 rounded-3xl`, `top-4 inset-x-4`, desktop width `w-[420px]` left-aligned.
- Contains: pickup input (coral dot), destination input (ink dot), a "+ Add stop" ghost button, and a dotted connector line between inputs.
- **Bottom sheet (booking):** `glass-3 rounded-t-4xl`, with a drag handle (`h-1.5 w-10 rounded-full bg-ink-200`).
- Map controls (zoom, locate me): vertical stack of `btn-icon` on the right.

### 11.3 Ride type selector
- Horizontal scroll of cards (Auto, Hatchback, Sedan, SUV): `card-interactive`, `min-w-[132px]`, vehicle illustration, name, ETA, and fare.
- Selected: `card-selected` with a coral check badge top-right.
- Fare in `font-display font-extrabold text-xl`.

### 11.4 Fare estimate
- `glass-2` card with rows: base fare, distance, time, promo discount (accent-600 with a tag icon), and total.
- Total row is separated by a dashed `ink-200` divider, in `text-2xl font-extrabold`.
- Promo input: `.input` with an attached `btn-rose btn-sm` "Apply" button. Valid code shows a green check and an accent badge.

### 11.5 Confirm ride button
- `btn-primary btn-lg w-full`, label "Confirm HopIn", fare shown right-aligned inside the button.
- Loading state: spinner replaces the label and the button is disabled.

### 11.6 Ride status card (rider, active ride)
- `glass-3` bottom sheet. Header with status badge and ETA.
- A 4-step progress stepper (Requested, Accepted, Arriving, In progress) using coral for completed steps and `ink-200` for upcoming steps.
- Driver row: avatar, name, rating (star in `accent-400`), vehicle make, color, and plate (JetBrains Mono chip).
- Actions: Call and Message (`btn-icon`), Cancel (`btn-ghost`, text `status-cancelled`), SOS (`btn-icon` red).

### 11.7 Driver dashboard
- **Availability toggle:** large pill switch, 64x36px. On state uses `primary-grad` and the label "You're online". Off state uses `bg-ink-200` and "You're offline".
- **Stats row:** 3 `glass-2` tiles (Today's earnings, Rides, Rating). Numbers use `font-display font-extrabold text-2xl`.
- **Incoming ride request card:** `glass-tint` with pickup and drop-off summary, distance, fare in large type, and a countdown ring (`accent-400`). Accept is `btn-primary`, Decline is `btn-secondary`.

### 11.8 Payments
- Payment method list: `card-interactive` rows with brand icon, masked label (`•••• 4242`), and a default badge in rose.
- Payment result screen: centered `glass-3` card with a 72px status circle. Success is emerald with a check, failure is rose with an x.
- Receipt: white `glass-3` sheet with a dashed tear-line, fare breakdown, route summary, and a "Download" `btn-secondary` plus "Email receipt" `btn-ghost`.

### 11.9 Ride history
- `RideHistoryCard`: `card-interactive` with date, route (two lines with coral and ink dots), fare, and status badge. List grouped by month using small caption headers.
- Filter chips at top (All, Completed, Cancelled) using `chip` and `chip-active`.

### 11.10 Ratings and reviews
- 5 large stars (40px), filled with `accent-400` and empty with `ink-200`, with a gentle scale animation on select.
- Feedback `textarea` uses `.input` with `h-28 py-3`.
- Review items on the driver profile: `glass-2` cards with avatar, stars, date, and text.

### 11.11 Emergency SOS
- Floating circular button, 56px, `bg-status-sos text-white animate-sos-pulse`, shield icon.
- Confirmation modal: `glass-3`, red-tinted icon, "Send emergency alert?" with `btn-danger` and `btn-secondary`. Requires an explicit tap to confirm.
- After trigger: red-tinted banner (`bg-[#FFE0E0]`) pinned at top: "Emergency alert sent. Your contacts can see your live location."

### 11.12 Support tickets
- Ticket card shows category icon, subject, and status chip (Open is amber, In progress is blue, Resolved is emerald, Closed is gray).
- Admin response is displayed in a `glass-tint` block with the label "HopIn Support".

### 11.13 Notifications
- Dropdown or page of `glass-1` rows. Unread rows have a left coral bar (`border-l-4 border-primary-500`) and a bolder title.
- Type icon in a circular soft-tinted container matching the status color.

### 11.14 Modals, toasts, empty and loading states
- **Modal:** overlay `bg-ink-900/30 backdrop-blur-sm`, panel `glass-3 rounded-4xl p-6 max-w-md`, `animate-fade-in`.
- **Toast:** top-center on mobile, top-right on desktop. `glass-3 rounded-2xl` with a colored leading icon, auto-dismiss at 4s.
- **Empty state:** centered soft illustration, H3, one-line body, and a primary action.
- **Loading:** skeleton blocks that match the final layout. Use spinners only inside buttons.
- **Error state:** rose-tinted `glass-2` card with a retry button and a plain-language message.

---

## 12. Screen Inventory and Layout Notes

| Screen | Layout notes |
|---|---|
| Landing / Login / Register | Split on desktop (hero illustration left, `glass-3` form right). Single column on mobile. Role selector (Rider or Driver) uses two large selectable cards. |
| Rider home | Full-screen map, floating search panel, booking bottom sheet. |
| Active ride | Map with route and live driver marker, status bottom sheet. |
| Driver home | Map with availability toggle and stats, incoming request card slides up. |
| Ride history and details | List with filters, detail view with map snapshot, fare, payment status, and receipt actions. |
| Payments / Wallet | Payment methods list, add method flow, earnings summary for drivers. |
| Profile | Avatar header card, editable form in `glass-2`, driver vehicle info card, reviews list. |
| Support | Ticket list, new ticket form, ticket detail thread. |
| Admin | Table-style `glass-2` panels, ticket management with status filters. |

---

## 13. Accessibility

- **Contrast:** `ink-900` on glass or cream exceeds 7:1. `ink-500` body text exceeds 4.5:1 on white and cream surfaces. White text on `primary-500` alone does not meet AA for small text, so white text on coral must use the `primary-600` to `primary-700` gradient (`btn-primary`) with 16px+ semibold, or use `ink-900` text on `primary-500`.
- **Never** place `ink-400` text on glass over the map. Use `ink-500` or darker.
- **Focus:** visible 2px coral ring with offset on every interactive element.
- **Touch targets:** at least 44x44px.
- **Status:** always combine color, icon, and text label.
- **Forms:** visible labels, `aria-invalid` and `aria-describedby` on errors.
- **Map:** provide a text alternative (pickup, drop-off, ETA) alongside the visual map.
- **Motion:** honor `prefers-reduced-motion`.
- **Screen readers:** live regions (`aria-live="polite"`) for ride status changes, `assertive` for SOS.

---

## 14. Do and Don't

| Do | Don't |
|---|---|
| Use coral only for the single primary action and key accents | Use coral, rose, and gold all at full strength on one screen |
| Keep glass panels at 60%+ white over maps | Put low-opacity text panels over busy map areas |
| Use soft, warm-tinted shadows | Use pure black or gray drop shadows |
| Keep generous spacing and large radii | Mix sharp corners with rounded ones |
| Show skeletons that match the layout | Block the screen with full-page spinners |
| Pair status colors with icons and labels | Rely on color alone |

---

## 15. Implementation Checklist

1. Install fonts (Plus Jakarta Sans, Inter, JetBrains Mono) and `lucide-react`.
2. Paste the Tailwind config (Section 5) and global CSS (Section 6).
3. Add the fixed background mesh blobs once in `App.jsx` or `AppLayout`.
4. Build primitives first: `Card`, `Button`, `Input`, `Badge`, `Chip`, `Modal`, `BottomSheet`, `Toast`, `Skeleton`.
5. Build `StatusBadge` mapped from the Prisma `RideStatus` enum to the badge classes.
6. Build `AppLayout` (top bar, mobile tab bar) and `MapOverlay` (glass-3 floating containers).
7. Compose feature screens from the primitives, with no one-off styles.
8. Run an accessibility pass (contrast, focus, reduced motion) before Day 11 sign-off.

### Suggested component folder

```
client/src/components/
├── ui/           Button, Card, Input, Badge, Chip, Modal, BottomSheet, Toast, Skeleton
├── layout/       AppShell, TopBar, TabBar, MapOverlay
├── ride/         RideTypeSelector, FareEstimate, RideStatusCard, StatusBadge
├── driver/       AvailabilityToggle, RideRequestCard, StatsTile
├── payment/      PaymentMethodRow, ReceiptView
└── safety/       SosButton, SosConfirmModal
```
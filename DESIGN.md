# Design System: Cyber-Terminal Manga Brutalism

<!-- impeccable:design-schema 1 -->

## Visual World & Metaphor
An immersive developer workstation inspired by high-contrast cyber-manga aesthetics and technical UNIX terminal interfaces. The UI presents Dale's engineering portfolio not as a static document, but as an interactive, operating developer workstation environment with blueprint grids, halftone shading, corner bracket frames, and responsive OS windows.

---

## 1. Color Palette & Lighting

```css
:root {
  /* Surface Layers */
  --bg-void: #000000;
  --bg-primary: #08080a;
  --bg-surface: #101014;
  --bg-card: rgba(18, 18, 22, 0.75);
  --bg-glass: rgba(12, 12, 16, 0.65);
  --bg-hover: rgba(255, 255, 255, 0.06);

  /* Borders & Accents */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.2);
  --border-bright: rgba(255, 255, 255, 0.6);
  --border-corner: rgba(255, 255, 255, 0.4);

  /* Typography Colors */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-dim: #52525b;

  /* Status & Signal Accents */
  --accent-green: #4ade80;
  --accent-green-glow: rgba(74, 222, 128, 0.4);
  --accent-cyan: #38bdf8;
  --accent-amber: #fbbf24;
  --accent-red: #f87171;
}
```

---

## 2. Typography Hierarchy

| Role | Font Family | Size | Weight | Tracking / Leading |
|---|---|---|---|---|
| **Display Headings** | `Bebas Neue`, sans-serif | `clamp(2.5rem, 8vw, 6rem)` | 400 (Native Bold) | `-0.02em` / `1.05` |
| **Section Titles** | `Bebas Neue`, sans-serif | `clamp(1.75rem, 5vw, 3.25rem)` | 400 | `-0.02em` / `1.1` |
| **Component Headers** | `Bebas Neue`, sans-serif | `1.25rem – 1.75rem` | 400 | `0.02em` / `1.2` |
| **Body / Readout** | `Inter`, -apple-system, sans-serif | `0.875rem – 1rem` | 400, 500 | `normal` / `1.6` |
| **Monospace / Terminal**| `JetBrains Mono`, monospace | `0.75rem – 0.875rem` | 400, 600 | `0.02em` / `1.5` |
| **Technical Badges / Pills**| `Inter`, sans-serif | `0.6875rem – 0.75rem` | 700 (Uppercase) | `0.05em` / `1` |

---

## 3. Signature Graphic Textures & Patterns

### Halftone Dot Shading
```css
.halftone-overlay {
  background-image: radial-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 14px 14px;
}
```

### Technical Coordinate Grid
```css
.grid-blueprint {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### Corner Brackets Frame
```css
.corner-bracket {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: var(--border-corner);
  border-style: solid;
  pointer-events: none;
}
.corner-bracket.tl { top: -2px; left: -2px; border-width: 3px 0 0 3px; }
.corner-bracket.tr { top: -2px; right: -2px; border-width: 3px 3px 0 0; }
.corner-bracket.bl { bottom: -2px; left: -2px; border-width: 0 0 3px 3px; }
.corner-bracket.br { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; }
```

---

## 4. Workstation Window Architecture
- **Window Chrome**: Mock macOS/terminal titlebar with status dots, active process name (`bash - session #01`), and minimize/maximize buttons.
- **Glassmorphic Surface**: Dark semi-translucent backdrop (`backdrop-filter: blur(16px)`), crisp 1px hairline border.
- **Interactive Modals & Previews**: Floating project inspect cards with high-contrast inverted CTA buttons (`btn-outline` that inverts to solid white on black hover).

---

## 5. Responsive Craft & Layout Principles
- **Touch Targets**: Minimum 44x44px clickable areas on touch devices.
- **Zero Horizontal Overflow**: Rigid `max-width: 100%`, `overflow-x: hidden` containers.
- **Audited Breakpoints**:
  - `375px`: Single column, streamlined workstation cards, fluid display typography.
  - `768px`: 2-column project grids, side-by-side terminal monitors.
  - `1024px - 1440px+`: Full 3-column project showcase, full workstation dashboard.

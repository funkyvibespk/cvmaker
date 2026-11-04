# Design System Specification

## 1. Design Philosophy
The Resume & CV Generator UI is crafted to look and feel like a modern, premium SaaS productivity tool (comparable to Linear, Raycast, and Notion):
- **Refined Minimalism**: Generous whitespace, precise typography, crisp borders, and subtle elevation over heavy gradients or flashy animations.
- **Utility & Speed**: Instant responsiveness, zero visual clutter, intuitive side-by-side editing and live preview.
- **Accessibility & Clarity**: WCAG 2.1 AA compliant contrast ratios, full keyboard navigability, clear focus rings, and explicit validation feedback.
- **Authentic Professionalism**: Resume templates are designed according to modern global recruitment standards and ATS parsing rules—clean hierarchies, legible typography, and structured content.

---

## 2. Color Palette & Theming

### Application UI Colors
- **Neutral Base**:
  - Background (Light): `#F8FAFC` (Slate 50) / `#FFFFFF` (Surface)
  - Card / Panel: `#FFFFFF` with border `#E2E8F0` (Slate 200)
  - Text Primary: `#0F172A` (Slate 900)
  - Text Secondary: `#475569` (Slate 600)
  - Text Muted: `#94A3B8` (Slate 400)
- **Primary Brand**:
  - Primary: `#0F172A` (Deep Slate / Navy)
  - Primary Hover: `#1E293B` (Slate 800)
  - Accent / Focus: `#2563EB` (Royal Blue 600)
- **Semantic Status**:
  - Success: `#059669` (Emerald 600)
  - Warning: `#D97706` (Amber 600)
  - Danger / Error: `#DC2626` (Red 600)
  - Info: `#0284C7` (Sky 600)

### Template Accent Palette
Each resume template allows user selection from a calibrated professional palette:
- **Slate Executive**: `#1E293B`
- **Classic Navy**: `#1E3A8A`
- **Emerald Professional**: `#065F46`
- **Charcoal Modern**: `#334155`
- **Burgundy Corporate**: `#831843`
- **Cobalt Clean**: `#1D4ED8`
- **Warm Bronze**: `#78350F`
- **Deep Plum**: `#581C87`

---

## 3. Typography System

### Interface Fonts
- Primary UI: System-optimized Geist / Inter font stack (`font-sans`), ensuring fast loading, crisp text rendering on high-DPI displays, and clean readability.
- Monospace (Code/IDs): Geist Mono / JetBrains Mono.

### Multilingual Resume Typography
Templates support diverse language scripts with dedicated typography choices:
- **Latin Scripts (English, French, Spanish)**:
  - Sans-Serif: Inter, Helvetica Neue, Arial.
  - Serif: Merriweather, Georgia, Garamond.
- **Arabic Script (Arabic & Urdu)**:
  - Urdu: Noto Nastaliq Urdu / Noto Sans Arabic.
  - Arabic: Noto Sans Arabic / Amiri.
  - Correct `dir="rtl"` layout orientation, proper Arabic letter shaping, ligature support, and localized punctuation rules.

---

## 4. Spacing, Elevation & Layout Grid

### UI Scale
- Base unit: `4px` (`0.25rem`).
- Spacing steps: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`.
- Border Radius:
  - Buttons / Inputs: `rounded-md` (`6px`)
  - Cards / Modals: `rounded-lg` (`8px`) or `rounded-xl` (`12px`)

### Elevation & Shadows
- Flat / Subtle: `border border-slate-200 shadow-sm` for panels and inputs.
- Elevated: `shadow-md` for dropdown menus, popovers, and floating toolbars.
- Resume Paper Simulation: `shadow-2xl` on preview canvas with distinct neutral backdrop to accurately simulate real paper in daylight.

---

## 5. Paper Dimensions & Print Specifications

| Paper Standard | Millimeters | Inches | Aspect Ratio | Primary Regions |
| :--- | :--- | :--- | :--- | :--- |
| **A4** | `210mm × 297mm` | `8.27in × 11.69in` | 1 : 1.414 (√2) | International / Europe / Asia / Middle East |
| **US Letter** | `215.9mm × 279.4mm` | `8.5in × 11.0in` | 1 : 1.294 | United States, Canada, Mexico |

### Print Rules (`@media print`):
- Margins: Standardized at `12mm` to `15mm` across all templates.
- Selectable Vector Text: No canvas rasterization; all text remains fully selectable, searchable, and indexable.
- Page Break Controls: `break-inside: avoid` on experience/education entries; `page-break-after: always` between simulated multiple pages.
- Backgrounds: `-webkit-print-color-adjust: exact; print-color-adjust: exact;` to preserve accent blocks, borders, and badge styling during browser print.


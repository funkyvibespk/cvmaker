# Architecture Specification

## 1. System Overview
The Professional Resume & CV Generator is an online-only, client-side web application built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Zustand.

The core principle is **zero-retention, privacy-first client-side document authoring**:
- No user accounts or authentication.
- No remote database or cloud persistence.
- No AI APIs or paid third-party dependencies.
- No offline caching or service worker persistence.
- PDF output through a dedicated browser print document rendered by the shared resume presentation component.
- Client-side Microsoft Word (.docx) generation using `docx`; full canonical-section coverage and professional layout quality are still incomplete.

---

## 2. Feature-Oriented Directory Architecture

The project strictly follows the feature-oriented structure outlined in `AGENTS.md`:

```text
cvmaker/
├── app/                        # Next.js App Router routes and pages
│   ├── layout.tsx              # Root HTML/body shell and global font/theme providers
│   ├── page.tsx                # Public homepage with hero, features, FAQ, CTA
│   ├── builder/                # Interactive resume builder & live preview workspace
│   │   └── page.tsx
│   ├── templates/              # Public template gallery and showcase
│   │   └── page.tsx
│   ├── privacy/                # Privacy policy (essential for AdSense & compliance)
│   ├── terms/                  # Terms of service
│   ├── about/                  # About page
│   ├── contact/                # Contact information
│   ├── sitemap.ts              # Dynamic sitemap generator
│   └── robots.ts               # Robots.txt generator
├── components/                 # Shared UI components
│   ├── ui/                     # Primitives (shadcn/ui based on Radix / Tailwind)
│   ├── layout/                 # Global header, footer, navigation bars
│   └── ads/                    # Isolated AdSense placeholder slots (policy-compliant)
├── features/                   # Core business logic domains
│   ├── templates/              # Template catalog, template registry, metadata
│   │   ├── registry.ts         # Catalog of 10 template entries, without distinct renderers for each
│   │   └── types.ts            # Template definition and configuration contracts
│   ├── resume-editor/          # Core editor fields and five-section builder workspace
│   ├── resume-preview/         # Shared canonical preview / print presentation
│   │   └── ResumePresentation.tsx
│   ├── pdf-export/             # PDF page geometry and isolated browser print trigger
│   │   ├── downloadPdf.ts      # Prints the dedicated resume document root
│   │   └── printLayout.ts      # A4 and Letter page rules
│   ├── docx-export/            # Word document (.docx) generation
│   │   ├── generateDocx.ts     # Universal OpenXML document generator (client-side)
│   │   └── downloadDocx.ts     # Client-side blob downloader
│   ├── export/                 # Format comparison dialogs & utilities
│   │   └── FormatComparisonModal.tsx
│   └── internationalization/   # Multilingual & RTL typography support
│       ├── config.ts           # Supported locales: EN, UR, AR, FR, ES
│       ├── dictionaries/       # Interface strings
│       └── store.ts            # Persistent locale & direction store
├── hooks/                      # Generic cross-cutting React hooks
├── lib/                        # Utility functions, helpers, class merging
├── schemas/                    # Zod validation schemas for resume data model
├── stores/                     # Zustand stores for in-memory resume data & UI settings
├── styles/                     # Global styles, Tailwind base, and print media rules
├── types/                      # Universal TypeScript types and data models
│   └── resume.ts               # Universal resume data contracts
├── public/                     # Static assets, fonts, template preview thumbnails
├── tests/                      # Automated tests (unit, form validation, template rendering)
└── docs/                       # Project architecture, design, and progress documentation
```

---

## 3. Current Data Flow and State Management

```mermaid
flowchart LR
    A["Builder form and section navigation"] --> B["Zustand canonical ResumeDocument"]
    B --> C["Zod validation at load/edit/export boundaries"]
    C --> D["resolveResumeExportModel"]
    D --> E["Shared ResumePresentation"]
    E --> F["Live preview"]
    E --> G["Dedicated print-only document"]
    G --> H["Browser print / PDF"]
    B --> I["Legacy adapter"]
    I --> J["Existing DOCX generator"]
```

The builder exposes personal information, multiple experience entries and achievements, education, skills, and projects. Experience, education, and project entries can be reordered by stable ID. The preview displays all entries from those five core sections, but remains a single baseline layout. Store support for other canonical sections exists; their editor controls and a final template renderer are future work. Resume data remains in browser memory and is not persisted. The interface language store is separate from the resume document's language and direction settings; the preview applies the document's language and direction.

## 4. Shared Resume Presentation and PDF Output

`features/export/resolveResumeExport.ts` accepts the canonical `ResumeDocument` and returns its complete content/design plus an ordered list of visible, non-empty canonical sections. Standard sections follow `design.sectionOrder`; omitted order tokens are appended in schema order. Custom sections retain their entry order and use `custom:<id>` resolved IDs. Hidden and empty section data remains in the document but is not presented.

`features/resume-preview/ResumePresentation.tsx` consumes that resolved model and renders personal/contact information and every supported canonical section. It applies language, direction, selected accent/font/font sizes, paper size, and configured margins. The live preview and dedicated `#resume-pdf-document` use this same component; the print root is separate from the editor and does not depend on the active section or mobile preview toggle.

`features/pdf-export/downloadPdf.ts` snapshots the validated current Zustand document, resolves it, waits for the dedicated print root to update, then invokes browser printing. It injects an exact A4 (`210 × 297 mm`) or US Letter (`215.9 × 279.4 mm`) `@page` rule. Print CSS hides the app shell/editor and prints only the dedicated resume document; its own contact header remains visible. Entry and heading break rules support multi-page output without shrinking content to one page.

The live preview and print document use matching resolved section IDs and resume text. Browser rendering can still vary slightly by font availability and print implementation; English, Arabic/RTL, photo, comprehensive, long-document, A4, and Letter PDFs were rendered and visually inspected during milestone verification.

The resolver remains format-neutral; it performs ordering, visibility, and empty-section filtering only. It does not format dates or create PDF- or Word-specific output.

---

## 5. Existing DOCX Path and Compatibility Boundary

PDF now consumes the shared resolved presentation. DOCX remains a separate legacy path for the next export milestone:

```mermaid
flowchart TD
    Canonical["Canonical ResumeDocument"] --> Resolver["Shared resolver"]
    Resolver --> Presentation["Live preview and isolated print document"]
    Presentation --> PDF["PDF browser print"]
    Canonical --> Adapter["Canonical-to-legacy adapter"]
    Adapter --> Legacy["Legacy ResumeData API"]
    Legacy --> DOCX["Existing DOCX generator"]
```

The builder validates canonical data before either export path. `lib/legacyResumeAdapter.ts` maps currently supported canonical fields into `types/resume.ts` for the unchanged DOCX generator. That legacy type has no fields for awards, volunteering, publications, interests, or custom sections; those values are retained by the store but are not exported by the current DOCX path. The adapter should be retired only after the DOCX generator is migrated to consume the shared resolved model.

### Known Export Limitations:
- **PDF (.pdf)**:
  - Prints only the shared dedicated resume document. A4, Letter, English, Arabic, photo, comprehensive-section, and long-document outputs have been exercised locally. Browser/font differences still warrant broader cross-browser verification.
- **Microsoft Word (.docx)**:
  - Generated by the existing legacy `ResumeData` generator and remains editable, but is not yet guaranteed to meet professional Word layout expectations or support all canonical sections.
  - RTL and cross-suite rendering need direct output verification before being considered complete.

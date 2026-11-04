# Testing Strategy & Verification Protocols

## 1. Scope and Standards
As mandated by `AGENTS.md` (Section 14), no feature is considered complete until it has been thoroughly tested.

Testing focuses on six critical pillars:
1. **Resume Creation & In-Memory State**: Verifying state updates, section additions/deletions, reordering, and empty state resilience.
2. **Form Validation**: Strict schema enforcement with Zod and React Hook Form (email formats, required fields, date validations, URL integrity).
3. **Template Switching**: Guaranteeing 100% data preservation across all template switches. Content must never be dropped or mutated when changing visual themes.
4. **Live Preview Fidelity**: Immediate bidirectional synchronization between form state and the simulated document stage.
5. **Print & PDF Export Quality**: Visual inspection of real generated PDFs for correct pagination, multi-page support, exact A4 and US Letter physical dimensions, selectable text, and zero unwanted element clipping.
6. **Multilingual & RTL Layouts**: Accurate rendering of Urdu and Arabic scripts, correct punctuation placement, and proper RTL document hierarchy.

---

## 2. Test Execution Matrix

| Test Suite | Focus Area | Method / Tool | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **TS1: Schema Validation** | `schemas/resume.schema.ts` | Vitest / Jest | All valid inputs pass; invalid inputs produce exact localized error messages. |
| **TS2: State Store** | `stores/useResumeStore.ts` | Unit tests | Adding, updating, reordering, and clearing sections work without side-effects. |
| **TS3: Template Neutrality** | `features/templates/*` | Render snapshot tests | All 10 templates accept identical resume data model without throwing errors. |
| **TS4: Print Dimensions** | `features/pdf-export/*` | Browser print simulation | Physical dimensions match A4 (210×297mm) and Letter (215.9×279.4mm); margins preserved. |
| **TS5: Multilingual/RTL** | `features/internationalization/*` | Visual & DOM inspection | Arabic & Urdu render with `dir="rtl"`, correct fonts, and proper alignment. |
| **TS6: Unsaved Warning** | Navigation lifecycle | Manual test | Reloading tab with dirty state triggers `beforeunload` confirmation. |

---

## 3. PDF Visual Inspection Checklist

Visual inspection must verify:
- [ ] Header alignment, name prominence, and contact icon positioning.
- [ ] Experience and education date alignment.
- [ ] Clean bullet indentation without awkward line wraps.
- [ ] No mid-sentence page breaks or cut-off text blocks.
- [ ] Headers are not orphaned at the bottom of pages (`break-after: avoid`).
- [ ] Fonts are embedded/rendered as crisp vector text, not rasterized images.
- [ ] Hyperlinks (LinkedIn, GitHub, portfolio) are clickable in the generated PDF.
- [ ] Both A4 and US Letter sizes produce appropriate layout proportion.


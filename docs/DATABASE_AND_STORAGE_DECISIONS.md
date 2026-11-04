# Database and Storage Decisions

## 1. Explicit Architectural Policy: Zero Remote Database

**No remote database, cloud storage, or backend persistence service is used in this project.**

Specifically:
- **No Supabase, Firebase Firestore, PostgreSQL, MySQL, MongoDB, or Prisma.**
- **No Cloud Object Storage (e.g., AWS S3, Cloudflare R2, Google Cloud Storage).**
- **No Authentication Systems (e.g., NextAuth, Clerk, Auth0, Supabase Auth).**
- **No Backend Resume Storage Endpoints.**
- **No External AI APIs (e.g., Google Gemini, OpenAI, Claude).**

This policy is immutable and forms the bedrock of the application's user trust and privacy model.

---

## 2. In-Memory Client-Side State Model

All resume creation, editing, and customization operate entirely within the visitor's local browser memory:

1. **State Engine**:
   - The canonical resume document is managed by `stores/resumeStore.ts` via **Zustand**.
   - Resume content resides exclusively in the JavaScript runtime heap of the browser tab; it is not written to local storage or sent to a server.
2. **Ephemeral Nature**:
   - The user's resume data is cleared automatically upon closing the tab or browser.
   - No cookie-based tracking or server-session identifiers are created or transmitted.
3. **Loss Prevention**:
   - A dirty-state `beforeunload` warning is not yet implemented. Users can lose the in-memory resume if they reload or leave the page.

---

## 3. Photograph and Asset Handling

Users may optionally include a professional headshot/photograph:

1. **Local Processing Only**:
   - The user selects an image from their local machine.
   - The file is read locally using the browser `FileReader` API as a sanitized base64 data URL or created as a local `blob:` URL.
2. **Validation & Security**:
   - Strict client-side file type verification (PNG, JPEG, WebP only; SVGs and executable binaries rejected).
   - Strict file size quota (maximum 2MB) to prevent browser memory exhaustion.
   - Client-side image cropping and dimension optimization.
3. **No Network Transmission**:
   - The photograph data is NEVER sent over the wire to any server or API endpoint.

---

## 4. Offline Policy and PWA Boundaries

As specified in `AGENTS.md`:
- **No offline editing or offline resume generation**: The application is an online web tool.
- **No PWA service worker caching of resume data**: Offline caching layers often lead to stale state, desynchronization, and privacy leaks on shared devices.
- All template rendering and PDF generation are executed dynamically on-the-fly inside the active browser window.

---

## 5. Privacy Guarantee for Visitors

Visitors can use the application with complete confidence that:
- They will never be prompted to create an account or provide an email address.
- Their resume content, contact information, career history, and photo remain strictly private on their own machine.
- No third-party data broker or AI training pipeline receives their personal information.


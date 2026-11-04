# Deployment and Workflow Guidelines

## 1. Hosting Target: Vercel
The application is designed for serverless static and dynamic edge hosting on **Vercel**:
- Framework preset: Next.js.
- Node.js version: 24.x LTS (pinned by `package.json` and `.nvmrc`).
- Free tier compatible (zero commercial dependencies or background worker fees).
- Subdomain: Initially hosted on `*.vercel.app`, with custom domain configuration planned for later.

---

## 2. Git and Version Control Policy

Per Section 16 of `AGENTS.md`, **Antigravity must never automatically create commits, push to remote repositories, or alter Git history**:
1. Antigravity prepares code, verifies tests, and reports file modifications.
2. Antigravity provides structured, standard commit messages after milestones.
3. The developer manually inspects changes, commits, and pushes to GitHub.

### Suggested Git Commits by Milestone:
- **Milestone 1**: `chore: initialize Next.js foundation, design system, and project documentation`
- **Milestone 2**: `feat: implement public landing page, hero, features, and FAQ`
- **Milestone 3**: `feat: implement professional template gallery and preview cards`
- **Milestone 4**: `feat: define universal resume data schema and Zod validation`
- **Milestone 5**: `feat: create dynamic resume builder forms with React Hook Form`
- **Milestone 6**: `feat: build universal template rendering engine with 10 templates`
- **Milestone 7**: `feat: implement live preview stage with zoom and customization`
- **Milestone 8**: `feat: implement high-fidelity browser print and PDF export`
- **Milestone 9**: `feat: add multilingual internationalization and RTL support`
- **Milestone 10**: `feat: add SEO metadata, privacy policy, terms, and AdSense scaffolding`
- **Milestone 11**: `test: add unit/integration tests and responsive optimizations`
- **Milestone 12**: `ci: prepare production build and Vercel deployment configuration`

---

## 3. Environment Variables & Security
- **No API secrets or database connection strings exist in this project.**
- Public metadata and analytics/AdSense IDs (when approved) will be prefixed with `NEXT_PUBLIC_`.
- Strict Content Security Policy (CSP) headers will be configured in `next.config.ts`.


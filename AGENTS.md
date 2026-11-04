# MASTER PROJECT INSTRUCTION
## Professional Resume & CV Generator PWA

### 1. Project Overview

Build a modern, professional, responsive, online-only Resume and CV Generator.

The application allows visitors to create professional resumes without:
- Registering or logging in.
- Providing an account or email address.
- Paying for downloads.
- Using a subscription.
- Connecting to a cloud database.

The user selects a professional template, enters personal and professional information, previews the generated resume, customizes it and downloads it as a PDF.

The application will initially be completely free.

Future monetization will be through Google AdSense, subject to Google's approval and applicable advertising policies.

### 2. Development Rules

- Work as a senior full-stack developer and UI/UX designer.
- Build production-quality code, not a basic demonstration.
- Follow the approved architecture and development milestones.
- Do not introduce paid services or dependencies.
- Do not add authentication, databases, cloud resume storage or AI APIs.
- Do not implement offline editing or offline resume generation.
- Do not invent features outside the approved scope.
- Explain important architectural decisions.
- Test each major feature before proceeding.
- Never overwrite existing working code without examining it first.
- Maintain clean, reusable, maintainable components.
- Do not claim a feature is complete until it has been tested.

### 3. Technology Stack

Frontend:
- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Lucide icons

Forms:
- React Hook Form
- Zod

State:
- Zustand

Internationalization:
- next-intl or an appropriate maintained alternative.

Resume rendering:
- HTML and CSS-based template engine.
- Shared resume data model.
- Separate presentation and content layers.

PDF:
- Browser-compatible PDF generation.
- Prefer reliable HTML/CSS printing with print-specific styles.
- Ensure selectable text, correct pagination and professional output.

Development:
- Google Antigravity Free.
- Local development environment.
- Git for version control.
- GitHub Free for remote repository.

Hosting:
- Vercel, subject to its current plan and commercial-use terms.
- Initially use the provided vercel.app subdomain.
- Purchase and connect a custom domain later.

### 4. Product Requirements

The application must provide:

A. Homepage
- Professional branding.
- Clear headline and introduction.
- Create Resume call-to-action.
- Template previews.
- Explanation of how the generator works.
- Features and benefits.
- Frequently asked questions.
- Footer with important pages.

B. Template Gallery
- Professional template cards.
- Template previews.
- Categories.
- ATS-friendly filter.
- Search and filtering.
- Mobile-friendly layout.
- Preview and use-template actions.

C. Resume Builder
- Personal information.
- Professional headline.
- Summary.
- Work experience.
- Education.
- Skills.
- Projects.
- Certifications.
- Languages.
- Awards.
- Volunteering.
- Custom sections.
- Optional profile photograph.

D. Live Preview
- Changes appear immediately.
- Professional page layout.
- A4 and US Letter paper sizes.
- Page navigation.
- Zoom controls.
- Template switching without losing entered information.

E. Customization
- Color selection.
- Font selection.
- Font sizing.
- Spacing.
- Section ordering.
- Section visibility.
- Optional photograph visibility.

F. PDF Export
- High-quality PDF.
- Correct page breaks.
- Multiple-page support.
- Embedded or reliably available fonts.
- Correct hyperlinks.
- No unwanted clipping or overflow.
- Proper A4 and US Letter dimensions.

### 5. User Experience

The main workflow must be:

1. Visitor opens the homepage.
2. Visitor selects a resume template.
3. Visitor enters personal information.
4. Application generates the resume.
5. Visitor edits and customizes the resume.
6. Visitor previews the final document.
7. Visitor downloads the PDF.
8. Visitor can start another resume.

No registration or login should be required.

Resume information must remain in browser memory while the user works. Do not upload personal resume information to a server.

Warn users before navigation or refresh if their unsaved work could be lost.

Do not implement offline editing, offline generation or PWA offline caching.

### 6. Multilingual Support

Prepare the application for:
- English
- Urdu
- Arabic
- French
- Spanish

The interface language and resume content language must be independently selectable.

Requirements:
- Proper RTL and LTR layouts.
- Correct Urdu and Arabic typography.
- Mixed-language content support.
- Correct punctuation and text direction.
- PDF rendering must support RTL text.
- Localized navigation and form labels.

Do not assume that simply reversing the layout is sufficient for correct RTL PDF rendering. Test actual output.

### 7. Resume Data Architecture

Create one universal, validated resume data model.

The data must be independent of the selected template.

A resume should contain:

- Personal information.
- Contact information.
- Professional headline.
- Summary.
- Experience entries.
- Education entries.
- Skills.
- Projects.
- Certifications.
- Languages.
- Awards.
- Volunteering.
- Custom sections.

Use stable IDs for repeatable sections.

Store design configuration separately from resume content.

Changing a template must never destroy or unnecessarily modify the user's entered information.

Validate all form data using Zod.

### 8. Template Engine

Build a reusable template rendering system.

Each template must consume the same universal resume data structure.

Requirements:
- Independent template components.
- Shared data model.
- Shared formatting utilities.
- Consistent typography.
- Print-specific styles.
- A4 and Letter compatibility.
- ATS-friendly templates.
- Multiple-page support.
- Correct RTL rendering.

Start with 10 professional templates.

Template categories should include:
- Minimal.
- Modern.
- Professional.
- Corporate.
- Creative.
- Academic.
- ATS-friendly.

Do not build ten copies of the same design with different colors. Each template should have a meaningful visual identity.

### 9. Google AdSense Preparation

Advertising will be introduced later.

Prepare the architecture for clearly separated advertisement placements.

Potential placements:
- Homepage.
- Template gallery.
- Informational pages.
- Resume completion page.
- Between separate user workflows, where policy-compliant.

Never:
- Disguise advertisements as application controls.
- Place ads where accidental clicks are likely.
- Force users to click ads to download a resume.
- Promise that ads will always be available.

Include pages and infrastructure needed for future advertising review:
- Privacy Policy.
- Terms of Service.
- About.
- Contact.

Actual advertising integration must wait until the website is eligible and approved.

### 10. Privacy and Security

- Do not create user accounts.
- Do not store resume data in a server database.
- Do not send resume content to external AI providers.
- Do not expose unnecessary personal information in analytics.
- Validate uploaded photographs.
- Limit image file sizes and accepted formats.
- Sanitize user-generated content.
- Prevent unsafe HTML injection.
- Use secure dependencies.
- Never place secrets in frontend code.

Explain clearly that resume information is held in browser memory and may be lost when the page is refreshed or closed.

### 11. UI/UX Standards

Design a premium, professional SaaS-style experience.

Requirements:
- Modern visual identity.
- Consistent design system.
- Responsive layouts.
- Mobile-first considerations.
- Accessible controls.
- Clear typography.
- Good contrast.
- Consistent spacing.
- Professional empty states.
- Loading states.
- Helpful error messages.
- Keyboard accessibility.

Avoid:
- Generic-looking AI-generated interfaces.
- Excessive gradients.
- Unnecessary animations.
- Cluttered dashboards.
- Inconsistent buttons.
- Oversized cards.
- Unprofessional resume designs.

The final application should look like a polished commercial product.

### 12. SEO and Performance

- Server-render public informational pages where appropriate.
- Use proper page metadata.
- Generate sitemap.xml.
- Generate robots.txt.
- Use semantic HTML.
- Optimize images.
- Avoid unnecessary JavaScript.
- Lazy-load template previews when appropriate.
- Optimize Core Web Vitals.
- Use descriptive URLs.
- Add structured data where appropriate.

### 13. Project Structure

Use a feature-oriented architecture.

Suggested areas:

- app/
- components/
- features/
  - templates/
  - resume-editor/
  - resume-preview/
  - pdf-export/
  - internationalization/
- hooks/
- lib/
- schemas/
- stores/
- styles/
- types/
- public/
- tests/
- docs/

Adapt the structure when necessary, but keep responsibilities separated.

### 14. Testing Requirements

Test:
- Resume creation.
- Form validation.
- Repeating and removing sections.
- Template switching.
- Live preview.
- PDF export.
- Multi-page documents.
- A4 and Letter output.
- Optional photographs.
- Mobile layouts.
- RTL rendering.
- Multilingual content.
- Browser refresh warnings.
- Advertisement layout compatibility.

Inspect generated PDFs visually, not just through successful download checks.

### 15. Development Milestones

Implement in this order:

Milestone 1: Project foundation and design system.

Milestone 2: Homepage and public website.

Milestone 3: Professional template gallery.

Milestone 4: Resume data model and validation.

Milestone 5: Resume builder and dynamic forms.

Milestone 6: Universal template rendering engine.

Milestone 7: Live preview and customization.

Milestone 8: PDF generation and export.

Milestone 9: Multilingual support and RTL.

Milestone 10: SEO, privacy pages and AdSense preparation.

Milestone 11: Testing, optimization and bug fixing.

Milestone 12: GitHub repository and Vercel deployment.

### 16. Git and Deployment Workflow

The developer manually manages Git.

Antigravity must:
- Never push to GitHub without explicit permission.
- Never create commits without explicit permission.
- Never rewrite Git history.
- Never delete the repository.
- Explain which files changed.
- Provide suggested commit messages after milestones.

The developer will manually review, commit and push changes.

Vercel will host the application.

The custom domain will be purchased later.

### 17. AI Usage Management

The development environment has limited free AI usage.

Therefore:
- Work milestone by milestone.
- Avoid repeatedly regenerating completed components.
- Maintain project documentation.
- Record completed work.
- Record outstanding issues.
- Reuse existing components.
- Avoid unnecessary context consumption.
- Make changes as focused tasks.

Maintain these documentation files:
- docs/ARCHITECTURE.md
- docs/PROJECT_PROGRESS.md
- docs/DATABASE_AND_STORAGE_DECISIONS.md
- docs/DESIGN_SYSTEM.md
- docs/TESTING.md
- docs/DEPLOYMENT.md

The database and storage document should explicitly state that no remote database is used.

### 18. First Task

Do not build the entire application immediately.

Begin by:
1. Inspecting the local development environment.
2. Checking available Node.js and package manager versions.
3. Proposing the final folder structure.
4. Preparing the design system.
5. Creating the initial Next.js foundation.
6. Establishing project documentation.
7. Verifying that the application runs locally.

Present the implementation plan before making major architectural changes.

Do not introduce Supabase, authentication, Gemini API, paid APIs, offline functionality or unnecessary backend infrastructure.

**Final objective:** Build a fast, beautiful, privacy-conscious, multilingual professional resume generator that visitors can use without registration and download resumes from free of charge.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Content and Design Refresh Plan

## Confirmed Positioning Inputs

- Primary offer: MDM/Intune transformations (primary emphasis).
- Experience context to highlight: large public enterprise environments.
- Proof points approved for repeated use: `30k devices`, `20k users`, `€200k+ annual savings`, `NIS2/ISO 27001` alignment.
- Engagement models to present:
  - consulting
  - advisory
  - implementation + handover
  - ongoing support
- Tone direction: technical and direct.
- Claims to avoid: none.
- Services section: include on top-level pages.
- Contact conversion path: email only.

## Objectives

- Improve conversion from "interesting profile" to "qualified inbound lead".
- Make long technical pages easier to scan in under 30 seconds.
- Keep the current technical tone while increasing clarity for decision-makers.
- Preserve performance and accessibility standards.

## Target Audiences

- Primary: engineering managers, IT leads, and program owners evaluating external help.
- Secondary: technical peers validating depth via projects and architecture write-ups.
- Tertiary: recruiters and partners looking for concise proof of impact.

## Success Metrics

- Increase click-through rate to `/contact` from top-level pages.
- Increase scroll depth and time on `intune-migration`, `homelab`, and `kubernetes`.
- Increase direct inbound inquiries that reference a specific case study.
- Maintain Core Web Vitals and accessibility baseline during redesign.

## Sitewide Content Strategy

### Messaging hierarchy

1. What you do: enterprise MDM/Intune architecture and transformation.
2. Who you do it for: operationally critical organizations, including large public enterprise.
3. Why trust you: measurable outcomes at scale.
4. How to engage: email-only contact with clear expectations and response window.

### Writing rules

- Lead every major section with outcome-first language.
- Keep paragraph length short (2-4 lines on desktop).
- Replace generic statements with numbers, scope, and constraints.
- Keep language technical and specific; avoid vague consulting phrasing.
- End each page with one explicit CTA (not multiple competing asks).

### Sitewide services block (new)

Add a reusable "Services" section to `/` and `/about` with concise, technical offer framing:

1. Intune and endpoint management transformation:
Design and execute COBO/COPE/COSU/MAM strategies, enrollment architecture, compliance baselines, and rollout plans.
2. Security and compliance hardening:
Operationalize NIS2/ISO 27001 controls across endpoint policies, conditional access, and detection workflows.
3. Platform automation and operations:
Automate provisioning, policy deployment, lifecycle operations, and reporting with reproducible tooling.
4. Delivery model:
Advisory, implementation + handover, or ongoing operational support.

### Case-study structure template

Use this structure for all deep pages (`intune-migration`, `kubernetes`, `homelab`):

1. Context: baseline state and constraints.
2. Problem: operational or security risk.
3. Approach: architecture and decisions.
4. Execution: rollout details and tooling.
5. Outcome: measurable impact.
6. Lessons learned: tradeoffs and recommendations.
7. CTA: one next step.

## Sitewide Design Strategy

### Visual direction

- Keep the terminal-inspired brand language but reduce visual monotony.
- Use mono font for accents and code-like UI elements only.
- Introduce a highly readable body font for long-form text.
- Create stronger section contrast through spacing and surface treatments.

### Typography system

- Display/headings: continue current technical style.
- Body copy: use a readable sans family for dense paragraphs.
- Keep line length near 65-75 characters on desktop.
- Increase heading-to-body contrast (size, weight, spacing).

### Layout and components

- Add a reusable "hero summary" block for every page.
- Add reusable "results" cards for metrics and outcomes.
- Add sticky local table-of-contents on long pages.
- Add reusable CTA panel component with one action per page.

### Motion and interaction

- Keep subtle transitions only; avoid ornamental animation.
- Add scroll-spy style active state for long-page section nav.
- Preserve `prefers-reduced-motion` behavior.

## Page-by-Page Plan

## `/` Home

### Content changes

- Replace generic intro with MDM-first value proposition in one sentence.
- Add a "proof strip" directly under hero (e.g. device scale, compliance, savings).
- Add two focused pathways:
  - "See enterprise MDM transformation"
  - "Discuss your environment"
- Add a compact "Services" section below the proof strip.

### Design changes

- Hero: stronger hierarchy and shorter copy.
- Add a compact card row for proof metrics.
- Move social links to secondary position below primary CTA.

### Acceptance criteria

- User can understand services and credibility without scrolling.
- Primary CTA is visible in first viewport on desktop and mobile.
- MDM/Intune is unmistakably the primary offer.

## `/about`

### Content changes

- Convert long biography into scannable sections:
  - Background
  - Current scope
  - Core domains
  - Engagement model
- Add explicit section on large public enterprise delivery context.
- Keep FAQ, but make questions client-facing and decision-relevant.
- Include Services section with engagement model options.

### Design changes

- Convert skill lists into grouped chips or compact columns.
- Add a short "best fit" section (who should contact you).

### Acceptance criteria

- Decision-maker can identify relevance in under one minute.

## `/projects`

### Content changes

- Reframe each item as a mini case study with outcome line.
- Add "Why it matters" one-liner under each project.

### Design changes

- Add project cards with consistent metadata slots:
  - Scope
  - Stack
  - Outcome
  - Link
- Keep tags but reduce visual noise.

### Acceptance criteria

- Each project preview clearly communicates business impact.
- `intune-migration` is visually and editorially the flagship project.

## `/intune-migration`

### Content changes

- Keep this as flagship case study.
- Add explicit "Before / After" snapshot near top.
- Add section-level summaries for fast scanning.

### Design changes

- Add sticky side navigation for section jumping.
- Elevate impact stats with stronger visual treatment.
- Add timeline strip for migration phases.

### Acceptance criteria

- Reader can extract problem, approach, and outcomes in 60-90 seconds.
- Page clearly supports the primary MDM/Intune positioning.

## `/kubernetes`

### Content changes

- Reframe as reliability and operations story, not only stack inventory.
- Add explicit design decisions and tradeoffs (what was chosen and why).
- Add operations outcomes (recovery time, upgrade process, failure handling).

### Design changes

- Keep tech cards but group by layer (platform, networking, security, operations).
- Add architecture diagram or simplified topology visual.

### Acceptance criteria

- Page demonstrates engineering judgment, not just tool familiarity.

## `/homelab`

### Content changes

- Present as R&D environment that de-risks client work.
- Add section "How this transfers to production engagements".

### Design changes

- Split services list into categories (platform, security, observability, productivity).
- Reduce icon repetition and improve scan pattern.

### Acceptance criteria

- Clear link between homelab experimentation and client value.

## `/contact`

### Content changes

- Keep email-only conversion path.
- Add short engagement prompt next to email CTA:
  - environment size/scope
  - current bottleneck
  - desired timeline
- Keep expected response time visible.

### Design changes

- Add simple contact card panel with primary email CTA.
- Keep secondary links de-emphasized to avoid diluting email conversion.

### Acceptance criteria

- Contact page answers "what should I send you" immediately.

## `404`

### Content changes

- Add one-line guidance and one primary return path.

### Design changes

- Keep minimal, but align CTA hierarchy with rest of site.

## Implementation Roadmap

## Phase 1: Content architecture (fast, high ROI)

- Rewrite hero copy and CTA hierarchy across main pages.
- Apply case-study structure to deep pages.
- Add outcome-first summaries to project cards.
- Add services section to home and about.

## Phase 2: Design system adjustments

- Introduce body font and refined typography scale.
- Build reusable summary/result/CTA components.
- Implement long-page local navigation pattern.

## Phase 3: Visual polish and assets

- Add simple architecture visuals where high impact.
- Improve spacing rhythm and section surfaces.
- Tune mobile layout for long-form readability.

## Phase 4: Measurement and iteration

- Add lightweight analytics events for CTA clicks and section engagement.
- Review after 2-4 weeks and refine copy/components based on behavior.

## Technical Guardrails

- Keep all pages static-first and JS-optional where practical.
- Maintain WCAG-friendly contrast and keyboard support.
- Preserve current performance baseline (image optimization, minimal JS).
- Keep CI checks for HTML/link/sitemap integrity.

## Optional Enhancements

- Add downloadable one-page services brief.
- Add testimonial or endorsement section if available.
- Add "selected outcomes" module on home and about pages.

## Proposed Copy Direction (V1)

### Home hero (example direction)

- Headline: "Enterprise Intune and Endpoint Management, Built for Real Operations"
- Subline: "I design and run MDM environments for high-scale, operationally critical organizations."
- Proof strip chips: `30k devices`, `20k users`, `€200k+ savings`, `NIS2/ISO 27001`
- Primary CTA: "Email about your environment"
- Secondary CTA: "View MDM transformation case study"

### About intro (example direction)

- "I help large organizations run endpoint management without operational friction. Most of my work sits at the intersection of Intune architecture, security baselines, and rollout execution."

### Contact prompt (email-only)

- "Email: environment size, current bottleneck, and timeline. I usually reply within one to two business days."

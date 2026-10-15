# PRD.md: ScholarReady

| Item | Detail |
|---|---|
| Product | ScholarReady |
| Document type | Product Requirements Document (IDE-ready) |
| Version | 1.3 (Phase 1 Core MVP plus post-launch landing improvements) |
| Status | Approved for build |
| Platform | Desktop-first web app, responsive down to 1024px, usable at 768px |
| Data | Seeded fictional data only, stored in the browser |

---

## 1. Executive Summary

### 1.1 Value Proposition

ScholarReady helps undergraduate students find scholarships they are eligible for, see clearly why they qualify, and track the documents and deadlines needed to apply.

Three promises guide every feature:

1. **Find:** match a student profile against scholarship criteria using visible, rule-based checks.
2. **Understand:** show every reason a student meets, partly meets or does not meet each criterion, in plain language.
3. **Prepare:** combine document requirements and deadlines across saved scholarships into one checklist and one dashboard.

ScholarReady never predicts or implies a chance of winning. Readiness means document completeness only.

### 1.2 User Personas

**Persona A: Chloe Wong (fictional), Year 1 student, first-time applicant**

- Age 18, BBA Year 1, local student, first-semester GPA 3.10, volunteers and leads a student society committee.
- Goals: find out which scholarships she can actually apply for without reading dozens of long PDF notices; avoid missing a deadline.
- Pain points: eligibility wording is confusing; requirements are scattered across different pages; she does not know which documents (transcript, reference letter, personal statement) are reused across applications.
- Success for Chloe: within 10 minutes she has a shortlist, understands why she qualifies, and has a single checklist showing "2 of 4 ready".

**Persona B: Mr David Lau (fictional), Scholarship Adviser, Faculty Student Office (future paying customer)**

- Advises around 300 undergraduates per year on scholarships and awards.
- Goals: reduce repetitive one-to-one eligibility questions; see which students are preparing which applications; send students to a trusted, neutral tool.
- Pain points: students ask the same eligibility questions; late or incomplete submissions; no shared view of student preparation.
- Success for David (Phase 2): an adviser account showing cohort readiness (document completeness only) and upcoming deadlines.

### 1.3 Monetisation

| Tier | Price (illustrative, HKD) | Includes | Phase |
|---|---|---|---|
| Free | HK$0 | Full matching with eligibility reasons, comparison, combined checklist and evidence tracker, dashboard, up to 5 saved scholarships | 1 |
| Seasonal Premium | HK$38 per scholarship season | Convenience only: unlimited saved scholarships, deadline reminders (email in Phase 2) | Display only in Phase 1 |
| Institutional Licence | Quoted per institution | Adviser and institution accounts, cohort readiness view, custom scholarship listings | Display only in Phase 1 |

**Fairness rule (non-negotiable):** paying never affects matching results, eligibility reasons, ordering, scholarship visibility or outcomes. Premium adds convenience only. This statement appears on the pricing page.

---

## 2. Phased Scope Isolation

### 2.1 Phase 1: Core MVP (build now)

| # | Feature | Route | Summary |
|---|---|---|---|
| P1-1 | Landing page | `/` | Value proposition, how it works (3 steps), trust statements, "Try the demo" call to action |
| P1-2 | Profile page | `/profile` | Edit demo student profile; PDPO collection statement; save to browser storage |
| P1-3 | Scholarship matches | `/matches` | Scholarships grouped as Eligible, Partial match, Not eligible, each with rule-by-rule reasons |
| P1-4 | Scholarship detail | `/scholarships/:id` | Full criteria, reasons, required documents, deadlines, save button |
| P1-5 | Comparison page | `/compare` | Side-by-side comparison of 2 to 3 selected scholarships |
| P1-6 | Checklist and evidence tracker | `/checklist` | Combined, de-duplicated document list across saved scholarships with status tracking and evidence notes |
| P1-7 | Dashboard | `/dashboard` | Upcoming deadline list and document readiness per saved scholarship |
| P1-8 | Pricing page | `/pricing` | Display-only tiers; no payment; buttons open a "Demo only" dialog |
| P1-9 | Demo controls | Global header | "Demo mode" badge and "Reset demo data" action |
| P1-10 | Not found | `*` | Friendly 404 with link to dashboard |

### 2.2 Phase 2: Deferred (do not build now)

| # | Feature | Dependency |
|---|---|---|
| P2-1 | Real login, sign-up and password reset | Auth provider, database |
| P2-2 | Adviser and institution accounts, cohort readiness view | Auth with roles, database, institution data agreements |
| P2-3 | Real payments for Seasonal Premium and invoicing for Institutional Licence | Payment provider, webhooks, server runtime |
| P2-4 | Document uploads | Object storage, malware scanning, retention policy |
| P2-5 | Email reminders for deadlines | Email service, scheduled jobs, consent and unsubscribe |
| P2-6 | Settings page (account, notifications, data export and deletion) | Auth, database |
| P2-7 | Automated test suite (Vitest, React Testing Library, axe, wording scan, seed distribution test) and Lighthouse targets | Dev tooling, CI pipeline |
| P2-8 | In-app usage metrics (local counters, `/demo-insights` page, JSON export) | Metrics design, PDPO statement update |

**Phase 1 must not include:** login forms, password fields, payment forms, card inputs, file upload inputs, email capture, third-party analytics scripts, or any placeholder that appears to collect real personal data beyond the demo profile.

Keep data access behind a `repository` layer (Section 4.4) so `localStorage` can later be swapped for an API without rewriting pages.

---

## 3. Architecture and UI Layout

### 3.1 Page Routes

| Route | Page | Primary components |
|---|---|---|
| `/` | Landing | `HeroSection`, `HowItWorksSteps`, `MatchPreview`, `TrustPanel`, `PrimaryCTA` |
| `/profile` | Profile | `ProfileForm`, `PdpoStatement`, `SaveBar` |
| `/matches` | Matches | `MatchFilters`, `MatchGroup`, `ScholarshipCard`, `EligibilityReasonList`, `CompareTray` |
| `/scholarships/:id` | Scholarship detail | `ScholarshipHeader`, `EligibilityReasonList`, `RequiredDocumentsList`, `DeadlineTimeline`, `SaveButton` |
| `/compare` | Comparison | `CompareTable`, `CompareSelector` |
| `/checklist` | Checklist and evidence tracker | `ChecklistSummary`, `DocumentRow`, `StatusSelect`, `EvidenceNoteField`, `UsedByChips` |
| `/dashboard` | Dashboard | `ReadinessCard`, `DeadlineList`, `SavedScholarshipsPanel`, `NextActionsPanel` |
| `/pricing` | Pricing | `PricingTierCard`, `FairnessStatement`, `DemoOnlyDialog` |
| `/privacy` | Privacy statement (added after launch) | `PdpoStatement` |
| `*` | Not found | `EmptyState` |

Routing: React Router with `createBrowserRouter`. SPA fallback via `vercel.json` rewrite (Section 4.5).

### 3.2 Global Layout (desktop-first)

```
+--------------------------------------------------------------------------+
| [Logo ScholarReady]  Dashboard  Matches  Compare  Checklist  Pricing     |
|                                     [Demo mode]  [Profile]  [Reset demo] |
+--------------------------------------------------------------------------+
| Skip to main content (visible on focus)                                  |
|                                                                          |
|   <main> max-width 1200px, 12-column grid, 24px gutters                  |
|                                                                          |
+--------------------------------------------------------------------------+
| Footer: "All data is fictional. ScholarReady does not predict outcomes." |
|         Privacy statement link (to /privacy)                              |
+--------------------------------------------------------------------------+
```

- Top navigation with text labels; active page marked with `aria-current="page"` plus a visible underline (not colour alone).
- Below 1024px, navigation collapses into a menu button with an accessible disclosure pattern.
- Above the fold: at 768px width, the landing page H1 and the "Try the demo" button must appear within the first 667px of screen height.

### 3.3 Primary User Journey (Chloe)

1. **Landing** `/`: reads value proposition, selects "Try the demo".
2. **Profile** `/profile`: reviews the pre-filled demo profile, edits year of study, GPA, residency and financial need; reads the PDPO statement; saves.
3. **Matches** `/matches`: sees 4 Eligible, 4 Partial match, 4 Not eligible. Opens reasons on a card: "Meets: Year of study is 1 (requires 1 or 2)", "Check: leadership role held for at least one year needs evidence".
4. **Compare** `/compare`: adds 3 scholarships to the compare tray and compares amount, deadline, documents needed and criteria.
5. **Save**: saves scholarships (free limit is 5; a calm notice at the limit links to pricing).
6. **Checklist** `/checklist`: sees the combined list, e.g. "Academic transcript, used by 3 scholarships". Marks items Ready and adds evidence notes ("Requested from Registry on 10 Oct").
7. **Dashboard** `/dashboard`: sees the nearest deadline first, and readiness such as "4 of 6 documents ready" per scholarship.

### 3.4 Page Specifications

**Landing `/`**
- H1: "Find scholarships you qualify for, and get every application ready."
- Three steps: Build your profile, See why you match, Track documents and deadlines.
- Match preview (added after launch): below the three steps, a read-only card labelled "Example match (demo data)" showing the soonest-deadline Eligible scholarship for the current profile, calculated by the same eligibility engine as `/matches`, with its match badge, "X of Y criteria met" and a "See all matches" link to `/matches`. No Save or Compare buttons.
- Social sharing tags (added after launch): `index.html` includes a meta description plus Open Graph and Twitter card tags (title, description, type, URL), so the link shows a preview card when shared.
- Trust panel, four statements:
  - "Matches are based on each scholarship's published criteria."
  - "We never estimate whether you will win an award."
  - "Your information stays in this browser."
  - "All scholarships and people in this demo are fictional."
- CTA navigates to `/profile` if the profile has never been saved, otherwise `/dashboard`.

**Profile `/profile`**
- Fields: see `StudentProfile` (Section 5). Grouped into Study details, Background, Activities.
- Every field has a visible `<label>`; helper text explains how the field is used for matching.
- Inline validation plus an error summary at the top on failed submit; errors linked via `aria-describedby`.
- `PdpoStatement` displayed above the Save button, not hidden in a modal (Section 7.2).
- Save writes to storage and announces via a polite live region: "Profile saved. Matches updated."

**Matches `/matches`**
- Three groups in this order:
  - **Eligible:** every criterion met.
  - **Partial match:** no criterion failed, but at least one needs evidence or information you have not given.
  - **Not eligible:** at least one criterion not met. Card still shows "1 of 2 criteria met" so students see how close they are.
- Filters: award type (merit, need-based, leadership, community, sports, arts), minimum amount, deadline within (14, 30, 60 days).
- Sort: deadline soonest (default), amount highest, name A to Z. Sorting never uses any likelihood score.
- `ScholarshipCard`: name, provider, amount, deadline with days remaining, match group badge (icon plus text), "X of Y criteria met", expandable `EligibilityReasonList`, Save and Add to compare buttons.
- "How matching works" note: "We compare your profile with each scholarship's published criteria. We do not predict who will win."

**Scholarship detail `/scholarships/:id`**
- Header, description, criteria with reasons, required documents with current status from the checklist, deadline timeline, source label "Fictional provider (demo)".

**Compare `/compare`**
- 2 to 3 scholarships; rows: amount, provider, award type, match group, criteria met, one row per criterion type, documents required, deadlines, renewable.
- Criterion rows (revised after launch) are grouped by criterion type with plain labels (GPA, Year of study, Faculty, Residency, Financial need, Activities, Languages, First-generation student), never internal rule ids. Each cell shows that scholarship's requirement and the result, e.g. "Requires 3.60 or above. Does not meet (your GPA: 1.50)". A scholarship with no rule of that type shows "No requirement". Only criterion types used by at least one compared scholarship appear.
- Rendered as a real `<table>` with `<th scope>` headers and a `<caption>`.
- Empty state links back to `/matches`.

**Checklist and evidence tracker `/checklist`**
- Scope: documents required by saved scholarships only.
- De-duplication: one row per `DocumentItem`, with `UsedByChips` listing every saved scholarship that needs it.
- Row fields: name, description, status (`not_started`, `in_progress`, `ready`), evidence note (free text, max 280 characters), last updated, earliest related deadline.
- Summary bar: "4 of 6 ready" plus a progress bar with a text equivalent.
- Filter by status and by scholarship.

**Dashboard `/dashboard`**
- `DeadlineList`: all deadlines for saved scholarships, ascending; overdue items shown in a separate "Passed" group; labels "Due in 5 days", "Due today", "Passed 3 days ago".
- `ReadinessCard` per saved scholarship: "4 of 6 documents ready". No percentages styled as probability, no gauges implying odds.
- `NextActionsPanel`: up to 3 rule-derived actions (e.g. "Start personal statement, needed for 2 scholarships due within 14 days").

**Pricing `/pricing`**
- Three `PricingTierCard`s per Section 1.3, labelled "Illustrative pricing (demo)".
- `FairnessStatement` directly beneath the tiers.
- Buttons open `DemoOnlyDialog`: "Payments are not available in this demo. No charge has been made."

### 3.5 Key Shared Components

| Component | Responsibility |
|---|---|
| `AppShell` | Header, skip link, main landmark, footer |
| `DemoBadge` | Persistent "Demo mode: fictional data" indicator |
| `ResetDemoButton` | Confirmation dialog, then reseed storage |
| `EligibilityReasonList` | Renders each `RuleResult` with icon plus text: Meets, Does not meet, Check |
| `MatchGroupBadge` | Text plus icon; never colour alone |
| `DeadlineChip` | Date as `D MMM YYYY` (e.g. 14 Nov 2026) plus relative days |
| `ReadinessMeter` | "X of Y ready" text plus bar with accessible text equivalent |
| `Dialog` | Accessible modal: focus trap, Escape closes, labelled, focus restored to trigger |
| `LiveRegion` | Polite announcements for saves and status changes |

---

## 4. Technical Stack Constraints

### 4.1 Stack

| Layer | Choice |
|---|---|
| Build tool | Vite (React + TypeScript template) |
| UI library | React 18+ |
| Language | TypeScript, `strict: true` |
| Styling | Tailwind CSS |
| Routing | React Router v6+ |
| State | React context plus `useReducer`; no external state library |
| Persistence | `localStorage` via a typed repository layer |
| Dates | Native `Date` and `Intl.DateTimeFormat` (`en-GB`) |
| Testing | Manual checks only in Phase 1 (Section 9); automated suite deferred to Phase 2 (P2-7) |
| Linting | ESLint with `jsx-a11y`, Prettier |

Next.js static export is an acceptable alternative only if every route is statically exportable and `:id` pages are pre-generated from seed data. Default choice is Vite.

### 4.2 Hard Constraints

- Front end only. No server, no API routes, no serverless functions.
- No database. No authentication. A single demo user is loaded from seed.
- No secret keys, no `.env` files, no environment variables at build or runtime.
- No third-party scripts, trackers, external CDN fonts or analytics. Use a system font stack or self-hosted font files.
- All data fictional; no real scholarship names, providers, people or university trademarks.

### 4.3 Suggested File Structure

```
scholarready/
  index.html
  vercel.json
  package.json
  tsconfig.json
  tailwind.config.ts
  postcss.config.js
  src/
    main.tsx
    App.tsx
    routes.tsx
    styles/index.css
    types/models.ts
    data/seed/
      student.ts
      scholarships.ts
      rules.ts
      documents.ts
      deadlines.ts
      index.ts
    lib/
      repository.ts        // localStorage read/write, versioned
      eligibility.ts       // pure rule engine
      checklist.ts         // de-duplication and readiness
      deadlines.ts         // sorting and relative labels
      dates.ts
    state/
      AppStateProvider.tsx
      reducer.ts
    components/
      layout/  common/  matches/  checklist/  dashboard/  pricing/  profile/
    pages/
      LandingPage.tsx  ProfilePage.tsx  MatchesPage.tsx
      ScholarshipDetailPage.tsx  ComparePage.tsx  ChecklistPage.tsx
      DashboardPage.tsx  PricingPage.tsx  NotFoundPage.tsx
```

### 4.4 Persistence Layer

- Single storage key: `scholarready:v1`.
- Stored shape: `{ schemaVersion: 1, seededAt, profile, profileSavedAt, savedScholarshipIds, compareIds, documentProgress }`.
- Scholarships, rules, documents and deadlines are read from seed modules (immutable). Only user-changeable state is persisted.
- On load: if the key is missing or `schemaVersion` differs, reseed.
- Wrap every `localStorage` call in `try/catch`; if storage is unavailable, run in memory and show: "Changes will not be kept after you close this tab."
- Expose `repository.load()`, `repository.save(state)`, `repository.reset()` only. Components never touch `localStorage` directly.

### 4.5 Deployment (Vercel)

- Framework preset: Vite. Build command `npm run build`. Output directory `dist`. No environment variables.
- `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 4.6 Seed Date Strategy

Deadlines are stored as `offsetDays` relative to the day of first seeding and converted to ISO dates when seeded, so the demo stays meaningful whenever it is opened. "Reset demo data" recalculates dates from the current day.

---

## 5. Data Model

### 5.1 Entity Relationships

```
StudentProfile 1 ──< SavedScholarship >── 1 Scholarship
Scholarship    1 ──< EligibilityRule
Scholarship    1 ──< Deadline
Scholarship    >──< DocumentItem        (via Scholarship.requiredDocumentIds)
StudentProfile 1 ──< DocumentProgress >── 1 DocumentItem
EligibilityRule + StudentProfile ──> RuleResult   (derived, not stored)
RuleResult[]                     ──> MatchResult  (derived, not stored)
```

### 5.2 TypeScript Definitions (`src/types/models.ts`)

```ts
export type YearOfStudy = 1 | 2 | 3 | 4;
export type Residency = 'local' | 'non_local';
export type Faculty =
  | 'Arts' | 'Business' | 'Education' | 'Engineering'
  | 'Law' | 'Medicine' | 'Science' | 'Social Science';

export type ActivityTag =
  | 'community_service' | 'leadership' | 'sports' | 'arts'
  | 'research' | 'entrepreneurship' | 'exchange';

export interface StudentProfile {
  id: string;                            // 'demo-student'
  displayName: string;                   // 'Chloe Wong (Demo)'
  yearOfStudy: YearOfStudy;
  faculty: Faculty;
  programme: string;
  gpa: number | null;                    // 0.00 to 4.30; null if not yet available
  residency: Residency;
  financialNeedDeclared: boolean;        // self-declared yes or no, no figures
  activities: ActivityTag[];
  languages: string[];                   // e.g. ['English', 'Cantonese', 'Putonghua']
  firstGenerationStudent: boolean | null; // null = 'Prefer not to say'
  updatedAt: string;                     // ISO
}

export type AwardType =
  | 'merit' | 'need_based' | 'leadership' | 'community' | 'sports' | 'arts';

export interface Scholarship {
  id: string;                            // 'sch-001'
  name: string;                          // fictional
  provider: string;                      // fictional, suffixed '(fictional)'
  awardType: AwardType;
  amountHKD: number;
  renewable: boolean;
  places: number | null;
  summary: string;
  description: string;
  eligibilityRuleIds: string[];
  requiredDocumentIds: string[];
  deadlineIds: string[];
  isFictional: true;
}

export type RuleField =
  | 'yearOfStudy' | 'faculty' | 'gpa' | 'residency'
  | 'financialNeedDeclared' | 'activities' | 'languages' | 'firstGenerationStudent';

export type RuleOperator =
  | 'in'          // profile value is one of value[]
  | 'gte'         // number
  | 'lte'         // number
  | 'equals'      // string or boolean
  | 'includesAny' // profile array contains any of value[]
  | 'includesAll';// profile array contains all of value[]

export interface EligibilityRule {
  id: string;                            // 'r-001-1'
  scholarshipId: string;
  field: RuleField;
  operator: RuleOperator;
  value: string | number | boolean | Array<string | number>;
  label: string;                         // plain-language criterion
  requiresManualCheck: boolean;          // true when provider must verify evidence
}

export type RuleOutcome = 'met' | 'not_met' | 'check';

export interface RuleResult {           // derived
  ruleId: string;
  outcome: RuleOutcome;
  explanation: string;                   // 'Your GPA is 3.10. This scholarship requires 3.60 or above.'
}

export type MatchGroup = 'eligible' | 'partial' | 'not_eligible';

export interface MatchResult {          // derived
  scholarshipId: string;
  group: MatchGroup;
  metCount: number;
  totalCount: number;
  results: RuleResult[];
}

export type DocumentCategory =
  | 'academic' | 'identity' | 'financial' | 'reference'
  | 'written' | 'activity_evidence' | 'language';

export interface DocumentItem {
  id: string;                            // 'doc-transcript'
  name: string;
  category: DocumentCategory;
  description: string;
  guidance: string;                      // generic, fictional
}

export type DocumentStatus = 'not_started' | 'in_progress' | 'ready';

export interface DocumentProgress {
  studentId: string;
  documentId: string;
  status: DocumentStatus;
  evidenceNote: string;                  // max 280 chars
  updatedAt: string;
}

export type DeadlineType =
  | 'application_close' | 'reference_due' | 'interview' | 'result_release';

export interface Deadline {
  id: string;                            // 'dl-001-close'
  scholarshipId: string;
  type: DeadlineType;
  label: string;
  offsetDays: number;                    // seed only
  date: string;                          // ISO, computed at seeding
}

export interface SavedScholarship {
  studentId: string;
  scholarshipId: string;
  savedAt: string;
}
```

### 5.3 Matching Logic (`src/lib/eligibility.ts`)

Pure, deterministic functions (unit tests deferred to Phase 2; verify manually with Section 10.4):

1. For each rule, compare the profile field with the rule value using the operator.
2. Rule outcome:
   - `not_met` if the comparison fails.
   - `check` if the profile value is `null`, or the comparison passes but `requiresManualCheck` is true.
   - `met` otherwise.
3. Match group:
   - `not_eligible` if any rule is `not_met`.
   - `partial` if no rule is `not_met` and at least one is `check`.
   - `eligible` if every rule is `met`.
4. `metCount` counts `met` outcomes only. Every explanation states the student's value and the requirement in plain language.
5. Explanation format (revised after launch; exact wording for all 29 criteria in Section 5.5). Applies everywhere a reason appears (`/matches`, `/scholarships/:id`, `/compare`, landing preview, dashboard). Never show "Your value is", rule ids (e.g. "r-009-1") or code values (e.g. "community_service"). Each reason names the criterion, states the student's value, then the requirement:

| Criterion | Example wording |
|---|---|
| GPA (2 decimals) | "Your GPA is 3.10. This scholarship requires 3.60 or above." |
| Year of study | "You are in Year 1. This scholarship is open to Years 1 to 4." / "...open to Year 1 students only." / "...open to Years 3 and 4." |
| Faculty | "Your faculty is Business. This scholarship is open to Arts and Education students." |
| Residency | "You are a local student. This scholarship is open to local students." |
| Financial need | "You have declared financial need. This scholarship requires a declaration of financial need." |
| Activities | "Your activities include community service and leadership. This scholarship requires community service." |
| Languages | "You listed English, Cantonese and Putonghua. This scholarship requires all three." |
| First-generation student | "You chose not to say whether you are a first-generation student. This scholarship is for first-generation students." |
| Manual check (Check outcome) | Add a second sentence: "The provider will ask for evidence of this." |
| Missing value (Check outcome) | "You have not provided your GPA yet. Add it on your profile to check this criterion." |

Display labels for codes: community_service = community service; leadership = leadership; sports = sports; arts = arts; research = research; entrepreneurship = entrepreneurship; exchange = exchange experience. Lists join with commas and "and"; ranges of consecutive years read "Years 1 to 4".

No machine learning, no weighting, no scoring, no probability. Free and Premium users receive identical results.

### 5.4 Checklist and Readiness Logic (`src/lib/checklist.ts`)

- Required documents = union of `requiredDocumentIds` across saved scholarships, de-duplicated by `id`.
- Readiness per scholarship = its required documents with status `ready` / its total required documents, shown as "4 of 6 ready".
- Overall checklist readiness = ready unique documents / total unique documents.

### 5.5 Reason Wording for Every Criterion (added after launch)

Every reason on every screen is built from two fixed parts: **the student sentence** (Table A, from the current profile) followed by **the requirement sentence** (Table B, stored as the rule `label`). "Your value is", "This criterion requires", rule ids and code values must never appear anywhere on the website.

**Table A: Student sentence (by criterion type)**

| Criterion type | Wording |
|---|---|
| GPA | "Your GPA is 3.10." (two decimals) / not given: "You have not provided your GPA yet." |
| Year of study | "You are in Year 1." |
| Faculty | "Your faculty is Business." |
| Residency | "You are a local student." / "You are a non-local student." |
| Financial need | "You have declared financial need." / "You have not declared financial need." |
| Activities | "Your activities include community service and leadership." / none: "You have not listed any activities." |
| Languages | "You listed English, Cantonese and Putonghua." / none: "You have not listed any languages." |
| First-generation student | yes: "You are a first-generation university student." / no: "You are not a first-generation university student." / not given: "You chose not to say whether you are a first-generation university student." |

If the profile value is missing, add: "Add this on your profile to check this criterion."

**Table B: Requirement sentence (all 29 criteria)**

| Scholarship | Criterion | Requirement sentence |
|---|---|---|
| sch-001 Victoria Harbour | Year of study | "This scholarship is open to Year 1 students only." |
| sch-001 Victoria Harbour | GPA | "This scholarship requires a GPA of 3.00 or above." |
| sch-001 Victoria Harbour | Residency | "This scholarship is open to local students." |
| sch-002 Lion Rock | Activities | "This scholarship requires community service." |
| sch-002 Lion Rock | Year of study | "This scholarship is open to Years 1 to 4." |
| sch-003 Kowloon | Faculty | "This scholarship is open to Business students." |
| sch-003 Kowloon | Activities | "This scholarship requires leadership experience." |
| sch-003 Kowloon | GPA | "This scholarship requires a GPA of 2.80 or above." |
| sch-004 Pearl River | Financial need | "This scholarship requires a declaration of financial need." |
| sch-004 Pearl River | Residency | "This scholarship is open to local students." |
| sch-005 Tai Mo Shan | Activities | "This scholarship requires leadership experience." |
| sch-005 Tai Mo Shan | Year of study | "This scholarship is open to Years 1 and 2." |
| sch-005 Tai Mo Shan | Leadership duration (M) | "This scholarship requires a leadership role held for at least one year. The provider will ask for evidence of this." |
| sch-006 Lantau | Languages (M) | "This scholarship requires English, Cantonese and Putonghua. The provider will ask for evidence of this." |
| sch-006 Lantau | GPA | "This scholarship requires a GPA of 3.00 or above." |
| sch-007 Sai Kung | First-generation student | "This scholarship is for first-generation university students." |
| sch-007 Sai Kung | Financial need | "This scholarship requires a declaration of financial need." |
| sch-007 Sai Kung | Residency | "This scholarship is open to local students." |
| sch-008 Tsing Yi | Activities | "This scholarship requires community service." |
| sch-008 Tsing Yi | Volunteer hours (M) | "This scholarship requires at least 50 verified volunteer hours. The provider will ask for evidence of this." |
| sch-009 Peak Academic | GPA | "This scholarship requires a GPA of 3.60 or above." |
| sch-009 Peak Academic | Year of study | "This scholarship is open to Years 1 to 4." |
| sch-010 Shek O | Activities | "This scholarship requires sports involvement." |
| sch-010 Shek O | Year of study | "This scholarship is open to Years 1 to 4." |
| sch-011 Cheung Chau | Activities | "This scholarship requires arts involvement." |
| sch-011 Cheung Chau | Faculty | "This scholarship is open to Arts and Education students." |
| sch-012 Sha Tin | Year of study | "This scholarship is open to Years 3 and 4." |
| sch-012 Sha Tin | Faculty | "This scholarship is open to Science and Engineering students." |
| sch-012 Sha Tin | Activities | "This scholarship requires research experience." |

Example full reason: "Your activities include community service and leadership. This scholarship requires community service."

---

## 6. Third-Party API and Payment Boundaries

### 6.1 Phase 1

- **No third-party APIs.** No requests to external domains.
- **No payments.** Pricing page is display-only; no payment SDKs, card fields or checkout redirects.
- **No email, SMS or push.** Reminders appear only as a described Premium feature.
- **No uploads.** The evidence tracker stores a status and a text note only.
- **No analytics or error-tracking services.** Success metrics are measured through tester sessions only (Section 8).

### 6.2 Phase 2 Requirements (planning only)

| Need | Likely service type | Notes |
|---|---|---|
| Authentication and password reset | Managed auth (e.g. Supabase Auth, Auth0, Clerk) | Email verification, rate limiting, roles for student, adviser, institution admin |
| Database | Managed Postgres | Row-level security per student and institution |
| Payments | Stripe or a provider supporting HK merchants | Seasonal Premium as a one-off seasonal purchase; Institutional Licence via invoice; webhook endpoint required |
| Document uploads | Object storage with signed URLs | File type and size limits, malware scan, retention and deletion schedule |
| Email reminders | Transactional email service plus scheduled jobs | Explicit opt-in, unsubscribe, reminder timing settings |
| Server runtime | Serverless functions or a small API | Introduces environment variables and secret management |
| Analytics | Privacy-respecting product analytics | Consent banner and PDPO statement update |
| Institutional data | Data processing agreement per institution | Adviser access limited to readiness and deadlines by default |

Phase 2 introduces environment variables and secrets; none may be added during Phase 1.

---

## 7. Compliance and Trust

### 7.1 Accessibility: WCAG 2.2 AA

| Requirement | Implementation |
|---|---|
| Text contrast | At least 4.5:1 for body text; at least 3:1 for large text and UI component boundaries |
| Focus visible | Every interactive element shows a focus ring (`focus-visible:ring-2 focus-visible:ring-offset-2`), ring colour at least 3:1 against adjacent colours; outlines never removed without replacement |
| Focus not obscured (2.4.11) | Sticky header never covers the focused element; `scroll-margin-top` on focus targets |
| Target size (2.5.8) | Interactive targets at least 24 by 24 CSS px |
| Keyboard | Every feature usable by keyboard; logical tab order; no traps except managed dialogs |
| Skip link | First focusable element, "Skip to main content" |
| Landmarks and headings | One `<h1>` per page; `header`, `nav`, `main`, `footer` landmarks |
| Forms | Visible labels, `aria-describedby` for hints and errors, error summary on submit, no placeholder-only labels |
| Colour independence | Status and match groups use icon plus text, never colour alone |
| Dynamic updates | Saves and status changes announced through a polite live region |
| Redundant entry (3.3.7) | Profile entered once and reused across pages |
| Motion | Respect `prefers-reduced-motion` |
| Zoom | Text readable and controls usable at 200% browser zoom in a 1280px desktop window |
| Language | `<html lang="en-GB">` |

**Suggested palette (verify with a contrast checker before use)**

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1F2937` | Body text on white |
| `primary` | `#1D4ED8` | Buttons, links on white |
| `success-text` | `#166534` | "Meets" text |
| `danger-text` | `#B91C1C` | "Does not meet" text |
| `warning-text` | `#92400E` | "Check" text |
| `focus` | `#F59E0B` with dark offset | Focus ring |

### 7.2 Hong Kong PDPO Personal Information Collection Statement

Displayed on `/profile` above the Save button in a headed section with `id="pdpo"`, and on its own page `/privacy` (added after launch), which the footer privacy link opens:

> **Personal Information Collection Statement (Demo)**
>
> **Purpose:** The information on this page is used only to check your profile against the published criteria of scholarships shown in ScholarReady and to organise your application checklist.
>
> **Voluntary:** Providing this information is voluntary. If you leave a field blank, criteria that depend on it will show "Check".
>
> **Storage:** In this demo, your information is stored only in this browser on this device. It is not sent to ScholarReady, any university or any scholarship provider.
>
> **Transfer:** Your information is not transferred to any third party.
>
> **Access and correction:** You may view and correct your information on this page at any time, and delete it by selecting "Reset demo data".
>
> **Demo notice:** This is a demonstration using fictional data. Please do not enter real personal identifiers such as your HKID number.

Data minimisation:
- Do not collect HKID numbers, dates of birth, addresses, phone numbers, income figures or family details.
- Financial need is a self-declared yes or no only.
- Optional sensitive fields offer "Prefer not to say".
- No cookie consent banner is needed: the app sets no cookies and uses browser storage only to run the demo.
- "Reset demo data" deletes all stored information, meeting the right-to-erasure principle (GDPR Article 17).

### 7.3 Matching Transparency

- Matching is rule-based, using the visible criteria in `EligibilityRule`. No AI prediction, machine learning or opaque scoring.
- Every match shows every criterion and whether it is met, not met or needs checking, with a reason.
- Sorting is by deadline, amount or name only.

### 7.4 Readiness Wording

- Readiness = document completeness only, e.g. "4 of 6 ready".
- Prohibited in any user-facing string: "chance", "likelihood", "probability", "odds", "win rate", "success score", "strong candidate", or any percentage presented as an outcome. This applies to negated statements too, so trust copy uses "We never estimate whether you will win an award" instead.
- Before release, run a project-wide text search of `src/` for these terms; the result must be empty. An automated wording test is Phase 2 (P2-7).

### 7.5 Fictional Data and Fairness

- Persistent `DemoBadge`: "Demo mode: all scholarships and people are fictional."
- Footer statement on every page.
- Pricing page fairness statement: "Paying never changes your matches, eligibility reasons, order of results or scholarship outcomes. Premium adds convenience only."
- No real institution logos, names or trademarks.

---

## 8. Success Metrics (Phase 1)

Phase 1 has no analytics, so metrics are measured only through **moderated tester sessions**: 10 to 15 undergraduate testers, each starting from a freshly reset demo, observed by a facilitator using a simple scoring sheet. No usage data is recorded by the app.

| # | Metric | Definition | Target | How measured |
|---|---|---|---|---|
| M1 | Profile completion rate | % of testers who save a profile with all required fields completed within 5 minutes | 70% or more | Facilitator times the task and checks the saved profile |
| M2 | Comparison engagement | % of testers who compare at least 2 scholarships; plus mean number compared per session | 50% or more; mean 2.5 or more | Facilitator records scholarships added to compare |
| M3 | Checklist progression | % of testers who update the status of at least 3 checklist items in one session | 60% or more | Facilitator counts status changes |
| M4 | Eligibility comprehension | % of testers who correctly explain, in a post-task question, why one named scholarship is a Partial match | 80% or more | Facilitator scoring sheet |

In-app metrics are deferred to Phase 2 (P2-8).

---

## 9. Acceptance Criteria (Phase 1)

### 9.1 Landing `/`
- Done when the H1, three how-it-works steps and the four trust statements render, including "We never estimate whether you will win an award".
- Done when "Try the demo" routes to `/profile` on first visit and to `/dashboard` once a profile has been saved.
- Done when a keyboard-only pass reaches every link and button in order, each with a visible focus ring.
- Done when, with the seed profile, the match preview shows Kowloon Business Leaders Bursary as Eligible with "3 of 3 criteria met", and "See all matches" opens `/matches`.
- Done when the live page source contains `og:title`, `og:description` and a meta description.

### 9.2 Profile `/profile`
- Done when the seeded demo profile loads pre-filled, and saving an edit persists after a browser reload.
- Done when submitting with GPA outside 0.00 to 4.30 shows an inline error linked by `aria-describedby` and an error summary that receives focus.
- Done when the PDPO statement is visible above the Save button without opening any dialog.
- Done when the footer privacy link opens `/privacy`, which shows the same statement at the top of the page.

### 9.3 Matches `/matches`
- Done when, with the unchanged seed profile, exactly 4 scholarships appear under Eligible, 4 under Partial match and 4 under Not eligible (Section 10.4).
- Done when every card shows "X of Y criteria met" and expanding reasons lists each criterion with Meets, Does not meet or Check plus a plain-language explanation.
- Done when changing GPA from 3.10 to 3.70 on the profile moves "Peak Academic Excellence Scholarship" from Not eligible to Eligible without a page reload.

### 9.3a Eligibility wording
- Done when every reason on `/matches`, `/scholarships/:id` and `/compare` names the criterion (e.g. "Your GPA is 1.50"), and no screen shows a rule id.

### 9.4 Scholarship detail `/scholarships/:id`
- Done when each seeded `id` renders its criteria, required documents with current checklist status, and deadlines; an unknown `id` renders the not found state.
- Done when Save toggles the scholarship in saved state and the change is reflected on `/dashboard` and `/checklist`.

### 9.5 Compare `/compare`
- Done when criterion rows use plain labels (e.g. "GPA", "Year of study") with no internal ids such as "r-009-1", and empty cells read "No requirement".
- Done when 2 or 3 scholarships can be added from Matches, and adding a fourth is blocked with an announced message.
- Done when the comparison renders as a `<table>` with a `<caption>` and row and column headers that a screen reader announces correctly.
- Done when an empty compare state links back to `/matches`.

### 9.6 Checklist `/checklist`
- Done when a document required by several saved scholarships appears once, with chips naming each scholarship that uses it.
- Done when changing a status to Ready updates the summary ("X of Y ready") and the relevant dashboard readiness cards immediately and after reload.
- Done when evidence notes accept up to 280 characters, show a live character count, and persist after reload.

### 9.7 Dashboard `/dashboard`
- Done when deadlines for saved scholarships are listed in ascending date order, with overdue items in a separate "Passed" group.
- Done when each saved scholarship shows readiness only as "X of Y documents ready", and the pre-release text search (Section 7.4) finds no prohibited terms.
- Done when, with no saved scholarships, an empty state links to `/matches`.

### 9.8 Pricing `/pricing`
- Done when three tiers and the fairness statement render, labelled "Illustrative pricing (demo)".
- Done when every tier button opens `DemoOnlyDialog`, focus is trapped inside, Escape closes it, and focus returns to the triggering button.
- Done when the built bundle contains no payment SDK and the page contains no card or payment input.

### 9.9 Global
- Done when `npm install && npm run build` succeeds with no environment variables and the `dist` output deploys to Vercel with deep links working.
- Done when the network panel shows no requests to external domains during a full journey.
- Done when "Reset demo data" restores the seed (including recalculated deadline dates) after confirmation.

---

## 10. Demo Data

### 10.1 Seed Student Profile

| Field | Value |
|---|---|
| `displayName` | Chloe Wong (Demo) |
| `yearOfStudy` | 1 |
| `faculty` | Business |
| `programme` | BBA (fictional) |
| `gpa` | 3.10 |
| `residency` | local |
| `financialNeedDeclared` | true |
| `activities` | community_service, leadership |
| `languages` | English, Cantonese, Putonghua |
| `firstGenerationStudent` | null (Prefer not to say) |

Seeded saved scholarships: `sch-001`, `sch-002`.
Seeded document progress: `doc-transcript` ready, `doc-activity` ready, `doc-statement` in progress. All other documents not started.

### 10.2 Document Items

| id | Name | Category |
|---|---|---|
| `doc-transcript` | Academic transcript | academic |
| `doc-statement` | Personal statement | written |
| `doc-reference` | Reference letter | reference |
| `doc-cv` | CV | written |
| `doc-activity` | Activity or volunteering certificate | activity_evidence |
| `doc-financial` | Financial need declaration form | financial |
| `doc-id` | Identity document copy (status tracked only, no number entered) | identity |
| `doc-portfolio` | Creative portfolio | activity_evidence |
| `doc-language` | Language proficiency evidence | language |

### 10.3 Scholarships and Eligibility Rules

All names and providers are fictional. Rules marked (M) have `requiresManualCheck: true`.

| id | Name | Provider | Type | Amount (HK$) | Rules | Documents | Deadlines (offset days) |
|---|---|---|---|---|---|---|---|
| `sch-001` | Victoria Harbour First-Year Achievement Award | Harbourview Education Foundation (fictional) | merit | 20,000 | yearOfStudy in [1]; gpa gte 3.00; residency equals local | transcript, statement | close +21 |
| `sch-002` | Lion Rock Community Service Scholarship | Lion Rock Civic Trust (fictional) | community | 15,000 | activities includesAny [community_service]; yearOfStudy in [1,2,3,4] | activity, reference, statement | reference due +23; close +30 |
| `sch-003` | Kowloon Business Leaders Bursary | Kowloon Commerce Association (fictional) | leadership | 25,000 | faculty in [Business]; activities includesAny [leadership]; gpa gte 2.80 | cv, reference, statement | close +12; interview +26 |
| `sch-004` | Pearl River Student Support Grant | Pearl River Benevolent Fund (fictional) | need_based | 18,000 | financialNeedDeclared equals true; residency equals local | financial, id, transcript | close +45 |
| `sch-005` | Tai Mo Shan Leadership Fellowship | Tai Mo Shan Youth Foundation (fictional) | leadership | 30,000 | activities includesAny [leadership]; yearOfStudy in [1,2]; leadership role held 1 year or more: activities includesAny [leadership] (M) | cv, reference, statement | close +60; interview +75 |
| `sch-006` | Lantau Trilingual Communication Award | Lantau Language Society (fictional) | merit | 10,000 | languages includesAll [English, Cantonese, Putonghua] (M); gpa gte 3.00 | language, transcript | close +25 |
| `sch-007` | Sai Kung First Generation Pathway Scholarship | Sai Kung Futures Foundation (fictional) | need_based | 35,000 | firstGenerationStudent equals true; financialNeedDeclared equals true; residency equals local | financial, statement, reference | close +18 |
| `sch-008` | Tsing Yi Volunteer Impact Award | Tsing Yi Neighbourhood Council (fictional) | community | 8,000 | activities includesAny [community_service]; 50 or more verified volunteer hours: activities includesAny [community_service] (M) | activity, reference | reference due -3; close +5 |
| `sch-009` | Peak Academic Excellence Scholarship | The Peak Scholars Fund (fictional) | merit | 60,000 | gpa gte 3.60; yearOfStudy in [1,2,3,4] | transcript, reference, statement, cv | close +40; interview +55 |
| `sch-010` | Shek O Sports Scholarship | Shek O Athletic Association (fictional) | sports | 20,000 | activities includesAny [sports]; yearOfStudy in [1,2,3,4] | activity, reference | close +35 |
| `sch-011` | Cheung Chau Creative Arts Award | Cheung Chau Arts Circle (fictional) | arts | 12,000 | activities includesAny [arts]; faculty in [Arts, Education] | portfolio, statement | close +28 |
| `sch-012` | Sha Tin Undergraduate Research Grant | Sha Tin Science Trust (fictional) | merit | 40,000 | yearOfStudy in [3,4]; faculty in [Science, Engineering]; activities includesAny [research] | cv, transcript, reference, statement | close +50; result release +90 |

Every scholarship has exactly one `application_close` deadline. `sch-008` includes one overdue deadline to exercise the "Passed" group.

### 10.4 Expected Results for the Seed Profile

| Group | Scholarships | Why |
|---|---|---|
| **Eligible (4)** | sch-001, sch-002, sch-003, sch-004 | Every rule met |
| **Partial match (4)** | sch-005, sch-006, sch-007, sch-008 | No rule failed; sch-005, sch-006, sch-008 have a manual-check rule; sch-007 depends on `firstGenerationStudent`, which is null |
| **Not eligible (4)** | sch-009 (1 of 2 met), sch-010 (1 of 2 met), sch-011 (0 of 2 met), sch-012 (0 of 3 met) | At least one rule not met |

Check this distribution manually on `/matches` after any seed edit. An automated assertion is Phase 2 (P2-7).

---

## 11. Key Decisions and Trade-offs

**Why the scope was cut.** Phase 1 exists to validate one question: does a transparent eligibility view plus a combined checklist help first-time applicants act? Login, payments, uploads and reminders add cost, security risk and legal obligations without testing that question. Each deferred feature is listed in Phase 2 so nothing is lost, and the repository layer keeps the upgrade path open.

**Why the stack is front-end only.** A static React app with seeded data deploys to Vercel in minutes, needs no secrets, has no server to secure and holds no real personal data. That keeps the demo safe to share and cheap to iterate. The trade-off is that data lives in one browser, success can only be measured through tester sessions, and there is no multi-user view, all of which are acceptable for validation.

**Why matching is rule-based.** Scholarship eligibility is defined by published criteria, so the honest model is to check those criteria and show the result. Rule-based logic is explainable, testable and auditable, and lets students see exactly what to fix or confirm. AI prediction would be opaque, could encode bias, would be hard to justify to universities as paying customers, and would add no value where the rules are already known.

**Why readiness excludes win probability.** ScholarReady cannot know the applicant pool, panel judgement or funding limits, so any chance-of-winning figure would be invented. A false score could discourage eligible students or create false confidence. Document completeness is something the student controls and can act on, which keeps the product honest and keeps paying customers out of any perception that outcomes can be bought.


---

## 12. Non-Functional Requirements

| Area | Target |
|---|---|
| Performance | Pages load and respond without noticeable delay on a standard laptop; no heavy libraries beyond the stated stack |
| Accessibility | Manual checks on every page: keyboard-only pass, visible focus rings, contrast verified against Section 7.1 palette |
| Responsive | Desktop-first; fully responsive down to 1024px and usable at 768px |
| Browser support | Latest two versions of Chrome, Edge, Safari, Firefox |
| Locale | UK English spelling; dates `en-GB` (14 Nov 2026); currency `HK$` with thousands separators |
| Reliability | App usable when `localStorage` is unavailable (in-memory fallback) |
| Code quality | TypeScript strict, ESLint clean; automated tests and Lighthouse targets deferred to Phase 2 (P2-7) |


---

# =====

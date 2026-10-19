# PRD.md: ScholarReady

| Item | Detail |
|---|---|
| Version | 1.5 |
| Status | Phase 1 built and deployed |
| Platform | Desktop-first web app; fully responsive down to 1024px, usable at 768px |
| Data | Fictional seed data only, stored in the user's browser |

---

## 1. Overview

### 1.1 Problem

Undergraduates lose time on scholarships they are not eligible for, struggle with confusing eligibility wording, and start applications without knowing which documents they need or reuse. The result is wasted effort and missed deadlines.

### 1.2 Value Proposition

ScholarReady checks a student profile against each scholarship's published criteria, explains every result in plain language, and combines the required documents and deadlines of saved scholarships into one checklist and one dashboard.

ScholarReady never predicts or implies a chance of winning. "Readiness" means document completeness only.

### 1.3 Users

| Persona | Profile | Needs | Success looks like |
|---|---|---|---|
| **Chloe Wong (fictional)**, primary user | Year 1 BBA, local, GPA 3.10, volunteers and leads a society committee; first-time applicant | Know which scholarships she can apply for without reading long notices; understand eligibility wording; see which documents are reused; never miss a deadline | Within 10 minutes she has a shortlist, understands why she qualifies, and has one checklist showing "2 of 4 ready" |
| **Mr David Lau (fictional)**, future paying customer | Faculty scholarship adviser for around 300 undergraduates a year | Fewer repetitive eligibility questions; visibility of student preparation; a neutral tool to recommend | Phase 2 only: an adviser view of cohort readiness (document completeness only) and deadlines |

### 1.4 Monetisation

| Tier | Price (illustrative) | Includes | Phase 1 status |
|---|---|---|---|
| Free | HK$0 | Full matching with reasons, comparison, checklist, dashboard, up to 5 saved scholarships | Live |
| Seasonal Premium | HK$38 per scholarship season | Convenience only: unlimited saved scholarships, deadline reminders | Display only |
| Institutional Licence | Quoted per institution | Adviser and institution accounts, cohort readiness view, custom listings | Display only |

**Fairness rule (non-negotiable):** paying never changes matches, eligibility reasons, ordering, scholarship visibility or outcomes. The pricing page states this (wording in Section 4.3).

---

## 2. Goals and Success Metrics

Phase 1 tests one question: **does a transparent eligibility view plus a combined checklist help first-time applicants act?**

Metrics are gathered in moderated sessions with 10 to 15 undergraduate testers, each starting from a freshly reset demo. The app records no usage data.

| # | Metric | Target | How measured |
|---|---|---|---|
| M1 | Testers who save a complete profile within 5 minutes | 70% or more | Facilitator times the task |
| M2 | Testers who compare at least 2 scholarships; mean number compared | 50% or more; mean 2.5 or more | Facilitator records compare use |
| M3 | Testers who update at least 3 checklist statuses in one session | 60% or more | Facilitator counts changes |
| M4 | Testers who correctly explain why a named scholarship is a Partial match | 80% or more | Post-task question, scoring sheet |

A **complete profile** (M1) has year of study, faculty, residency, financial need and at least one activity saved; GPA and first-generation status are optional.

**Validation status:** these targets will be measured in moderated tester sessions after launch; no sessions have been run yet.

---

## 3. Scope

### 3.1 Phase 1: MVP (built)

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing | Value proposition, how it works, example match, trust statements, "Try the demo" |
| `/profile` | Profile | Edit the demo profile; privacy notice |
| `/matches` | Matches | Scholarships grouped Eligible, Partial match, Not eligible, with reasons |
| `/scholarships/:id` | Scholarship detail | Full criteria, reasons, documents, deadlines, Save |
| `/compare` | Compare | Side-by-side comparison of 2 to 3 scholarships |
| `/checklist` | Checklist | One de-duplicated document list with status and evidence notes |
| `/dashboard` | Dashboard | Deadlines and readiness for saved scholarships |
| `/pricing` | Pricing | Display-only tiers |
| `/privacy` | Privacy statement | Full privacy notice |
| `/sign-in` | Sign in (demo) | Shows where accounts will sit; continues with the demo account, collects nothing |
| `*` | Not found | Friendly 404 |
| All pages | Demo controls | Demo badge and "Reset demo data" |

Phase 1 collects no real personal data, credentials or payments; the full list of exclusions is in Section 6.2.

### 3.2 Phase 2: Future Enhancements (not built)

| # | Feature | Needs |
|---|---|---|
| P2‑1 | Real login, sign-up, password reset | Managed auth (e.g. Supabase Auth, Auth0, Clerk) with email verification and rate limiting; Postgres with row-level security |
| P2‑2 | Adviser and institution accounts, cohort view | Student, adviser and admin roles; data processing agreement; adviser access limited to readiness and deadlines |
| P2‑3 | Real payments and invoicing | Stripe or another HK-supported provider; webhook endpoint; server |
| P2‑4 | Document uploads | Object storage with signed URLs, size and type limits, malware scan, retention schedule |
| P2‑5 | Email deadline reminders | Transactional email, scheduled jobs, opt-in and unsubscribe |
| P2‑6 | Settings (account, notifications, data export and deletion) | Auth, database |
| P2‑7 | Automated tests and Lighthouse targets | Test tooling, CI pipeline |
| P2‑8 | In-app usage metrics | Privacy-respecting analytics, consent banner, updated privacy notice |
| P2‑9 | Mobile layout below 768px (phones) | Responsive redesign and mobile testing |

All data access goes through a repository layer (Section 6.3) so browser storage can later be replaced by an API without rewriting pages.

---

## 4. User Journey and Page Requirements

### 4.1 Core Journey (Chloe)

1. **Landing:** reads the value proposition and selects "Try the demo" (or "Sign in", then "Continue with the demo account").
2. **Profile:** reviews the pre-filled profile, edits it, reads the privacy notice, saves.
3. **Matches:** sees 4 Eligible, 4 Partial match, 4 Not eligible and expands the reasons.
4. **Compare:** compares up to 3 scholarships on amount, deadlines, documents and criteria.
5. **Save:** saves scholarships (free limit 5; a calm notice at the limit links to Pricing).
6. **Checklist:** marks documents Ready and adds evidence notes.
7. **Dashboard:** sees the nearest deadlines first and readiness per saved scholarship.

### 4.2 Global Layout

- **Header:** logo; links to Dashboard, Matches, Compare, Checklist, Pricing, Profile and Sign in; demo badge "Demo mode: all scholarships and people are fictional."; "Reset demo data" button (confirmation dialog, then reseeds data and recalculates deadline dates from today).
- The active link uses `aria-current="page"` plus a visible underline. Below 1024px, links collapse into a keyboard-operable Menu button.
- "Skip to main content" is the first focusable element. Main content is at most 1200px wide.
- **Footer on every page:** "All data is fictional. ScholarReady does not predict outcomes." and a "Privacy statement" link to `/privacy`.
- At 768px width, the landing H1 and "Try the demo" button appear within the first 667px of screen height.

### 4.3 Page Requirements and Acceptance Criteria

**Landing `/`**
- H1: "Find scholarships you qualify for, and get every application ready." Three steps: Build your profile, See why you match, Track documents and deadlines.
- Read-only card "Example match (demo data)": the soonest-deadline Eligible scholarship, calculated by the same engine as `/matches`, with match badge, "X of Y criteria met" and a "See all matches" link. No Save or Compare buttons.
- Trust statements: "Matches are based on each scholarship's published criteria." "We never estimate whether you will win an award." "Your information stays in this browser." "All scholarships and people in this demo are fictional."
- "Try the demo" opens `/profile` if the profile has never been saved, otherwise `/dashboard`.
- `index.html` has a meta description plus Open Graph and Twitter card tags.
- **Done when:** with the seed profile, the card shows Kowloon Business Leaders Bursary, Eligible, "3 of 3 criteria met"; "Try the demo" routes correctly before and after saving; a keyboard pass reaches every control with a visible focus ring; page source contains `og:title`, `og:description` and a meta description.

**Profile `/profile`**
- Fields (Section 6.5) grouped into Study details, Background and Activities, each with a visible label and helper text explaining its use in matching. First-generation status offers "Prefer not to say".
- Inline validation plus an error summary. GPA must be 0.00 to 4.30.
- Privacy notice (Section 8.2) shown above Save, not in a dialog, in a section with `id="pdpo"`.
- Saving announces "Profile saved. Matches updated." via a polite live region.
- **Done when:** the seed profile loads pre-filled and edits persist after reload; GPA 5.00 shows an inline error and an error summary that receives focus; the notice is visible above Save.

**Matches `/matches`**
- Groups in order: **Eligible** (every criterion met), **Partial match** (none failed, at least one needs evidence or missing information), **Not eligible** (at least one not met; card still shows "X of Y criteria met").
- Filters: award type, minimum amount, deadline within 14, 30 or 60 days. Sort: deadline soonest (default), amount highest, name A to Z. Sorting never uses a likelihood score.
- Card: name, provider, amount, deadline with days remaining, match badge (icon plus text), "X of Y criteria met", expandable reasons (Section 5.3), Save and Add to compare.
- Note: "We compare your profile with each scholarship's published criteria. We do not predict who will win."
- **Done when:** the seed profile gives exactly the groups in Section 9.5; every reason follows Section 5.3; changing GPA from 3.10 to 3.70 moves Peak Academic Excellence to Eligible without a page reload.

**Scholarship detail `/scholarships/:id`**
- Header, description, criteria with reasons, required documents with their checklist status, deadline timeline, label "Fictional provider (demo)", Save button.
- **Done when:** every seeded id renders; an unknown id shows the not found state; Save is reflected on Dashboard and Checklist.

**Compare `/compare`**
- 2 to 3 scholarships in a real `<table>` with `<caption>` and `<th scope>` headers. Rows: amount, provider, award type, match group, criteria met, one row per criterion type, documents, deadlines, renewable.
- Criterion rows use plain labels (GPA, Year of study, Faculty, Residency, Financial need, Activities, Languages, First-generation student). Cells show the requirement and result, e.g. "Requires 3.60 or above. Does not meet (your GPA: 1.50)", or "No requirement". Only criterion types used by a compared scholarship appear.
- **Done when:** adding a fourth is blocked with an announced message; no rule ids or "Not applicable" appear; the empty state links to `/matches`.

**Checklist `/checklist`**
- Documents required by saved scholarships only, one row per document with chips naming each scholarship that needs it. Row: name, description, status (Not started, In progress, Ready), evidence note (max 280 characters), last updated, earliest related deadline.
- Summary "X of Y ready" with a progress bar and text equivalent. Filters by status and scholarship.
- **Done when:** the seed shows 4 rows and "2 of 4 ready", with Personal statement listed once for both Victoria Harbour and Lion Rock; a status change updates the summary and Dashboard immediately and after reload; notes stop at 280 characters with a live count and persist.

**Dashboard `/dashboard`**
- Deadlines for saved scholarships in date order, overdue items in a separate "Passed" group, labels such as "Due in 5 days", "Due today", "Passed 3 days ago".
- One readiness card per saved scholarship: "X of Y documents ready". No percentages or gauges.
- Up to 3 next actions, built by these rules:
  1. Only saved scholarships count, taken in seed order (sch-001 first).
  2. For each, the first required document (in that scholarship's document order) that is not Ready produces one action; a document with no status counts as not Ready.
  3. Each action reads "Prepare {document name}" with the detail "Needed for {scholarship name}." and links to `/checklist`.
  4. Stop at 3 actions. If every required document is Ready, show "You are up to date on the current saved scholarships."
- **Done when:** the seed shows Victoria Harbour "1 of 2 documents ready" and Lion Rock "1 of 3 documents ready", and two next actions: "Prepare Personal statement" (Victoria Harbour) and "Prepare Reference letter" (Lion Rock); with no saved scholarships, an empty state links to `/matches`.

**Pricing `/pricing`**
- Three tiers (Section 1.4) labelled "Illustrative pricing (demo)", with this statement beneath: "Paying never changes your matches, eligibility reasons, order of results or scholarship outcomes. Premium adds convenience only."
- Every tier button opens a dialog: "Payments are not available in this demo. No charge has been made."
- **Done when:** the dialog traps focus, Escape closes it and focus returns to the button; the page and bundle contain no payment SDK or card input.

**Privacy `/privacy`**
- H1 "Privacy statement", the notice from Section 8.2, and a link back to `/profile`.
- **Done when:** the footer link opens it and a direct refresh does not 404.

**Sign in `/sign-in` (demo)**
- H1 "Sign in". Text: "Accounts are not available in this demo. Continue with the fictional demo account to try every feature."
- Primary button "Continue with the demo account": opens `/profile` if the profile has never been saved, otherwise `/dashboard` (same rule as "Try the demo").
- A "Create an account" section stating: "Sign-up, sign-in and password reset will be added in a later release." No input fields of any kind.
- **Done when:** the header "Sign in" link opens the page; the button routes correctly before and after saving a profile; the page contains no form fields; a direct refresh does not 404.

**Not found `*`**
- Friendly message with a link to `/dashboard`.

**Global, done when:** `npm install && npm run build` succeeds with no environment variables; deep links work on Vercel; no requests go to external domains during a full journey; "Reset demo data" restores the seed, including recalculated dates.

---

## 5. Matching and Readiness Logic

### 5.1 Matching (`src/lib/eligibility.ts`)

Pure, deterministic functions. No machine learning, weighting, scoring or probability. Free and Premium users get identical results.

| Rule outcome | When |
|---|---|
| `not_met` | The profile value fails the rule |
| `check` | The profile value is missing, or the rule passes but needs manual evidence (marked M) |
| `met` | Otherwise |

A scholarship is **Not eligible** if any rule is `not_met`, **Partial match** if none is `not_met` and at least one is `check`, otherwise **Eligible**. "X of Y criteria met" counts `met` outcomes only.

### 5.2 Readiness (`src/lib/checklist.ts`)

- Required documents are the union of documents needed by saved scholarships, de-duplicated.
- Per scholarship: its Ready documents out of its required documents ("1 of 2 documents ready").
- Overall: Ready unique documents out of all unique documents ("2 of 4 ready").

### 5.3 Reason Wording

Every reason on every screen (Matches, detail pages, Compare, landing card, Dashboard) is **the student sentence** followed by **the requirement sentence** (the rule's label, Section 9.4). Example: "Your activities include community service and leadership. This scholarship requires community service."

Never shown anywhere: "Your value is", "This criterion requires", rule ids (e.g. "r-009-1") or code values (e.g. "community_service").

| Criterion | Student sentence |
|---|---|
| GPA (two decimals) | "Your GPA is 3.10." / missing: "You have not provided your GPA yet." |
| Year of study | "You are in Year 1." |
| Faculty | "Your faculty is Business." |
| Residency | "You are a local student." / "You are a non-local student." |
| Financial need | "You have declared financial need." / "You have not declared financial need." |
| Activities | "Your activities include community service and leadership." / none: "You have not listed any activities." |
| Languages | "You listed English, Cantonese and Putonghua." / none: "You have not listed any languages." |
| First-generation | "You are a first-generation university student." / "You are not a first-generation university student." / "You chose not to say whether you are a first-generation university student." |

- If a value is missing, add: "Add this on your profile to check this criterion."
- Activity labels: community service, leadership, sports, arts, research, entrepreneurship, exchange experience.
- Lists join with commas and "and"; consecutive years read "Years 1 to 4".

---

## 6. Technical Stack and Data Model

### 6.1 Stack

Vite, React 18+, TypeScript (`strict`), Tailwind CSS, React Router v6+ (`createBrowserRouter`), React context with `useReducer`, browser `localStorage` via a repository layer, native `Intl` dates (`en-GB`), ESLint with `jsx-a11y`, Prettier. Phase 1 testing is manual (Section 4.3); automated tests are Phase 2.

### 6.2 Constraints

- Front end only: no server, API routes, database or real authentication. One demo user loaded from seed.
- No email, password, payment, card or file-upload fields anywhere (the demo sign-in page has no inputs).
- No secret keys, `.env` files or environment variables.
- No external requests: no third-party scripts, trackers, external fonts, analytics, error tracking, email or SMS.
- All names, providers and people fictional; no real institution names, logos or trademarks.

### 6.3 Persistence

- One storage key, `scholarready:v1`, holding `{ schemaVersion: 1, seededAt, profile, profileSavedAt, savedScholarshipIds, compareIds, documentProgress }`. Scholarships, rules, documents and deadlines are read-only seed data.
- Reseed if the key is missing or the schema version differs.
- Every storage call is wrapped in `try/catch`; if storage is unavailable the app runs in memory and shows "Changes will not be kept after you close this tab."
- Only `load()`, `save(state)` and `reset()` are exposed; components never touch storage directly.
- Deadlines are stored as day offsets and converted to dates at seeding, so the demo stays current; Reset recalculates them from today.

### 6.4 Deployment

Vercel, Vite preset, build `npm run build`, output `dist`, no environment variables. `vercel.json` rewrites all paths to `/index.html` so deep links work.

### 6.5 Data Model

Full type definitions are in `src/types/models.ts`.

| Entity | Key fields | Notes |
|---|---|---|
| StudentProfile | yearOfStudy (1 to 4), faculty, programme, gpa (0.00 to 4.30 or empty), residency (local, non-local), financialNeedDeclared (yes/no only), activities, languages, firstGenerationStudent (yes, no, prefer not to say) | Single demo user |
| Scholarship | name, provider, award type, amount (HK$), renewable, places, summary, description, rule, document and deadline ids | 12, read-only |
| EligibilityRule | field, operator (in, gte, lte, equals, includesAny, includesAll), value, label (requirement sentence), requiresManualCheck | 29, read-only |
| DocumentItem | name, category, description, guidance | 9, read-only |
| Deadline | type (application close, reference due, interview, result release), label, offsetDays, date | 18, read-only |
| SavedScholarship | scholarshipId, savedAt | User state |
| DocumentProgress | documentId, status, evidenceNote (max 280), updatedAt | User state |
| RuleResult, MatchResult | outcome, explanation; group, met and total counts | Calculated, never stored |

### 6.6 Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | No noticeable delay on a standard laptop; no heavy libraries beyond the stack |
| Browsers | Latest two versions of Chrome, Edge, Safari, Firefox |
| Locale | UK English; dates like 14 Nov 2026; currency HK$ with thousands separators |
| Reliability | Usable when storage is unavailable (in-memory fallback) |

---

## 7. Third-Party APIs and Payments

**Phase 1:** none (Section 6.2). Pricing is display-only and the evidence tracker stores a status and a text note only. **Phase 2:** the services in Section 3.2, which bring a server, environment variables and secrets; none may be added in Phase 1.

---

## 8. Compliance and Trust

### 8.1 Accessibility (WCAG 2.2 AA)

- Contrast at least 4.5:1 for body text and 3:1 for large text, UI boundaries and focus rings.
- Visible focus ring on every interactive element; the sticky header never covers the focused element.
- Every link and button at least 24 by 24 CSS px (global minimum); everything usable by keyboard with no traps outside dialogs.
- One H1 per page; header, nav, main and footer landmarks; `<html lang="en-GB">`.
- Visible form labels, hints and errors linked with `aria-describedby`, error summary on submit.
- Status and match groups use icon plus text, never colour alone.
- Saves and status changes announced in a polite live region.
- Respect `prefers-reduced-motion`; usable at 200% zoom in a 1280px window.
- Palette (check with a contrast tool): ink #1F2937, primary #1D4ED8, success #166534, danger #B91C1C, warning #92400E, focus ring #F59E0B with dark offset.

### 8.2 Hong Kong PDPO Personal Information Collection Statement

Shown on `/profile` above Save (`id="pdpo"`) and on `/privacy`:

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

- Never collect HKID numbers, dates of birth, addresses, phone numbers, income figures or family details. Financial need is yes/no only; sensitive optional fields offer "Prefer not to say".
- No cookie banner is needed: the app sets no cookies and uses browser storage only to run the demo.
- "Reset demo data" deletes all stored information, meeting the right-to-erasure principle (GDPR Article 17).

### 8.3 Banned Wording

- Banned in any user-facing text, including negated statements: "chance", "likelihood", "probability", "odds", "win rate", "success score", "strong candidate", or any percentage presented as an outcome. Before release, a text search of `src/` for these terms must return nothing.

---

## 9. Demo Data

### 9.1 Seed Profile

Chloe Wong (Demo): Year 1, Business, BBA (fictional), GPA 3.10, local, financial need declared, activities community service and leadership, languages English, Cantonese and Putonghua, first-generation status not given.

Saved at start: sch-001 and sch-002. Documents at start: transcript Ready, activity certificate Ready, personal statement In progress, all others Not started.

### 9.2 Documents (9)

| id | Name |
|---|---|
| doc-transcript | Academic transcript |
| doc-statement | Personal statement |
| doc-reference | Reference letter |
| doc-cv | CV |
| doc-activity | Activity or volunteering certificate |
| doc-financial | Financial need declaration form |
| doc-id | Identity document copy (status only, no number entered) |
| doc-portfolio | Creative portfolio |
| doc-language | Language proficiency evidence |

### 9.3 Scholarships and Rules (12 scholarships, 29 rules, all fictional)

(M) = needs manual evidence, so the outcome is "Check" even when the profile passes. Each provider is suffixed "(fictional)" in the app, and each scholarship has exactly one application close date.

| id | Name / provider | Type, HK$ | Rules | Documents | Deadlines (days from seeding) |
|---|---|---|---|---|---|
| sch-001 | Victoria Harbour First-Year Achievement Award / Harbourview Education Foundation | Merit, 20,000 | Year 1 only; GPA ≥ 3.00; local | transcript, statement | close +21 |
| sch-002 | Lion Rock Community Service Scholarship / Lion Rock Civic Trust | Community, 15,000 | community service; Years 1 to 4 | activity, reference, statement | reference +23; close +30 |
| sch-003 | Kowloon Business Leaders Bursary / Kowloon Commerce Association | Leadership, 25,000 | Business; leadership; GPA ≥ 2.80 | cv, reference, statement | close +12; interview +26 |
| sch-004 | Pearl River Student Support Grant / Pearl River Benevolent Fund | Need-based, 18,000 | financial need; local | financial, id, transcript | close +45 |
| sch-005 | Tai Mo Shan Leadership Fellowship / Tai Mo Shan Youth Foundation | Leadership, 30,000 | leadership; Years 1 and 2; leadership held 1 year or more (M) | cv, reference, statement | close +60; interview +75 |
| sch-006 | Lantau Trilingual Communication Award / Lantau Language Society | Merit, 10,000 | English, Cantonese and Putonghua (M); GPA ≥ 3.00 | language, transcript | close +25 |
| sch-007 | Sai Kung First Generation Pathway Scholarship / Sai Kung Futures Foundation | Need-based, 35,000 | first-generation; financial need; local | financial, statement, reference | close +18 |
| sch-008 | Tsing Yi Volunteer Impact Award / Tsing Yi Neighbourhood Council | Community, 8,000 | community service; 50+ verified volunteer hours (M) | activity, reference | reference -3 (overdue); close +5 |
| sch-009 | Peak Academic Excellence Scholarship / The Peak Scholars Fund | Merit, 60,000 | GPA ≥ 3.60; Years 1 to 4 | transcript, reference, statement, cv | close +40; interview +55 |
| sch-010 | Shek O Sports Scholarship / Shek O Athletic Association | Sports, 20,000 | sports; Years 1 to 4 | activity, reference | close +35 |
| sch-011 | Cheung Chau Creative Arts Award / Cheung Chau Arts Circle | Arts, 12,000 | arts; Arts or Education | portfolio, statement | close +28 |
| sch-012 | Sha Tin Undergraduate Research Grant / Sha Tin Science Trust | Merit, 40,000 | Years 3 and 4; Science or Engineering; research | cv, transcript, reference, statement | close +50; results +90 |

The two (M) rules for sch-005 and sch-008 are implemented as "activities include leadership" and "activities include community service" with the manual flag set.

### 9.4 Requirement Sentences (rule labels)

Every rule's label follows one of these patterns, filled in from the table above:

| Rule type | Requirement sentence |
|---|---|
| GPA | "This scholarship requires a GPA of {3.00} or above." |
| Year of study | "This scholarship is open to Year 1 students only." / "...open to Years 1 and 2." / "...open to Years 3 and 4." / "...open to Years 1 to 4." |
| Faculty | "This scholarship is open to {Business / Arts and Education / Science and Engineering} students." |
| Residency | "This scholarship is open to local students." |
| Financial need | "This scholarship requires a declaration of financial need." |
| First-generation | "This scholarship is for first-generation university students." |
| Activity | "This scholarship requires {community service / leadership experience / sports involvement / arts involvement / research experience}." |
| sch-005 (M) | "This scholarship requires a leadership role held for at least one year. The provider will ask for evidence of this." |
| sch-006 (M) | "This scholarship requires English, Cantonese and Putonghua. The provider will ask for evidence of this." |
| sch-008 (M) | "This scholarship requires at least 50 verified volunteer hours. The provider will ask for evidence of this." |

### 9.5 Expected Results for the Seed Profile

| Group | Scholarships | Why |
|---|---|---|
| Eligible (4) | sch-001 to sch-004 | Every rule met |
| Partial match (4) | sch-005 to sch-008 | Nothing failed; sch-005, sch-006 and sch-008 have a manual rule; sch-007 needs first-generation status, which is not given |
| Not eligible (4) | sch-009 (1 of 2), sch-010 (1 of 2), sch-011 (0 of 2), sch-012 (0 of 3) | At least one rule not met |

Check this 4 / 4 / 4 split on `/matches` after any seed change.

---

## 10. Key Decisions and Trade-offs

- **One core loop in Phase 1.** Login, payments, uploads and reminders add cost, security risk and legal duties without testing the Section 2 question, so they are Phase 2. The demo sign-in page shows where accounts will sit without collecting credentials.
- **Front end only.** No server, secrets or real personal data, so it is quick to deploy and safe to share. Trade-off: data lives in one browser and there is no multi-user view, which is acceptable for validation.
- **Rule-based matching, not AI prediction.** Eligibility is defined by published criteria, so checking them is honest, explainable and testable; prediction would be opaque and could encode bias.
- **Readiness excludes win probability.** The app cannot know the applicant pool or panel judgement, so any odds would be invented. Document completeness is something students control.

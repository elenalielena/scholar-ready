# tasklist.md: ScholarReady Phase 1 Execution Plan

| Item | Detail |
|---|---|
| Source | PRD.md v1.2 (Phase 1 Core MVP, trimmed after review) |
| Executor | Manus AI |
| Total tasks | 51 across 6 modules |
| Stack | Vite, React 18+, TypeScript (strict), Tailwind CSS, React Router v6+, `localStorage` |

## Rules for the Agent

1. Work strictly in task order. Do not start a task until the previous Verification Gate passes.
2. One task, one file, page or component. Do not build ahead.
3. Never add a database, authentication, `.env` files, environment variables, payment code, file uploads, email capture, analytics or external network requests.
4. All data is fictional. Use UK English spelling, `en-GB` dates (14 Nov 2026) and `HK$` with thousands separators.
5. Never use these words in any user-facing string: "chance", "likelihood", "probability", "odds", "win rate", "success score", "strong candidate".
6. Phase 1 has no automated test suite (deferred to P2-7). Every gate below is a manual check.
7. If a gate fails, fix it within the same task before moving on.

---

## Module 1: Project Setup and Deployment Config

- [x] **1. Scaffold the project** (`package.json`, `tsconfig.json`, `index.html`)
  Create a Vite React + TypeScript project named `scholarready`. Set `"strict": true` in `tsconfig.json`. Set `<html lang="en-GB">` and `<title>ScholarReady</title>` in `index.html`. Install `react-router-dom`.
  **Verification Gate:** run `npm install` then `npm run dev`; the starter page opens in the browser. Right-click, View Page Source, and confirm `lang="en-GB"`. Run `npm run build` with zero errors.

- [x] **2. Configure Tailwind** (`tailwind.config.ts`, `postcss.config.js`)
  Install Tailwind CSS and add the palette tokens from PRD Section 7.1: `ink #1F2937`, `primary #1D4ED8`, `success-text #166534`, `danger-text #B91C1C`, `warning-text #92400E`, `focus #F59E0B`.
  **Verification Gate:** open `tailwind.config.ts` and confirm all six tokens with the exact hex values. Run `npm run build` with zero errors.

- [x] **3. Global styles** (`src/styles/index.css`)
  Add Tailwind directives, a system font stack, a default `focus-visible` amber ring with offset, `scroll-margin-top` on focusable elements, and a `prefers-reduced-motion` rule that disables transitions.
  **Verification Gate:** run `npm run dev`, press Tab on the starter page and confirm the focused button shows a clearly visible amber ring.

- [x] **4. Linting and formatting** (`eslint.config.js`, `.prettierrc`)
  Add ESLint with `eslint-plugin-jsx-a11y` and Prettier. Add a `lint` script to `package.json`.
  **Verification Gate:** run `npm run lint` and confirm zero errors.

- [x] **5. Router and placeholder pages** (`src/routes.tsx`, `src/App.tsx`, `src/main.tsx`)
  Use `createBrowserRouter` for `/`, `/profile`, `/matches`, `/scholarships/:id`, `/compare`, `/checklist`, `/dashboard`, `/pricing` and `*`. Each page file in `src/pages/` returns only an `<h1>` with the page name for now.
  **Verification Gate:** visit each of the eight URLs (use `/scholarships/sch-001` for detail) and confirm the correct heading. Visit `/random-page` and confirm "Page not found".

- [x] **6. Vercel SPA config** (`vercel.json`)
  Add `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
  **Verification Gate:** run `npm run build` then `npm run preview`. Open `/checklist` directly in the address bar and press refresh; the page still loads with no 404.

---

## Module 2: Data Model and Seed Data

- [x] **7. Type definitions** (`src/types/models.ts`)
  Copy every type and interface from PRD Section 5.2 exactly, including `MatchGroup = 'eligible' | 'partial' | 'not_eligible'`.
  **Verification Gate:** run `npm run build` with zero errors. Open the file and confirm `MatchGroup` contains `eligible`, `partial` and `not_eligible`.

- [x] **8. Demo student profile** (`src/data/seed/student.ts`)
  Seed "Chloe Wong (Demo)" with the values in PRD Section 10.1. `firstGenerationStudent` is `null`.
  **Verification Gate:** open the file side by side with Section 10.1 and confirm all 10 field values match exactly (Year 1, Business, GPA 3.10, local, financial need true, activities community_service and leadership, three languages, first generation null).

- [x] **9. Document items** (`src/data/seed/documents.ts`)
  Seed the 9 documents in PRD Section 10.2 with name, category, description and generic guidance.
  **Verification Gate:** count exactly 9 items with ids matching Section 10.2. Confirm the identity document has no field for an ID number.

- [x] **10. Scholarships** (`src/data/seed/scholarships.ts`)
  Seed the 12 scholarships in PRD Section 10.3 with name, provider, award type, amount, rule ids, document ids and deadline ids. Set `isFictional: true`.
  **Verification Gate:** confirm 12 entries `sch-001` to `sch-012`, every provider ends with "(fictional)", and amounts match Section 10.3 (lowest HK$8,000, highest HK$60,000).

- [x] **11. Eligibility rules** (`src/data/seed/rules.ts`)
  Seed every rule in PRD Section 10.3 with a plain-language `label`. Rules marked (M) get `requiresManualCheck: true`.
  **Verification Gate:** count 29 rules in total. Confirm exactly 3 have `requiresManualCheck: true` (one each for sch-005, sch-006, sch-008). Read five labels aloud; each makes sense to a student.

- [x] **12. Deadlines** (`src/data/seed/deadlines.ts`)
  Seed every deadline in PRD Section 10.3 using `offsetDays`.
  **Verification Gate:** count 18 deadlines. Confirm exactly 12 are `application_close` (one per scholarship) and the only negative offset is sch-008 reference due at -3.

- [x] **13. Seed builder** (`src/data/seed/index.ts`)
  Export a `buildSeed(today)` function that converts `offsetDays` to ISO dates and returns the initial state: profile, saved ids `sch-001` and `sch-002`, and document progress (transcript ready, activity ready, statement in progress).
  **Verification Gate:** run `npm run build` with zero errors. Open the file and confirm the two saved ids and the three progress entries match PRD Section 10.1.

---

## Module 3: Core Logic

- [x] **14. Date helpers** (`src/lib/dates.ts`)
  Add `formatDate` (`en-GB`, e.g. 14 Nov 2026), `daysFromToday`, and `formatHKD` (e.g. HK$20,000).
  **Verification Gate:** run `npm run build` with zero errors. Visual check of output happens in Tasks 36 and 43.

- [x] **15. Repository layer** (`src/lib/repository.ts`)
  Implement `load()`, `save(state)` and `reset()` using the single key `scholarready:v1` and `schemaVersion: 1`. Reseed when the key is missing or the version differs. Wrap every `localStorage` call in `try/catch` and fall back to memory with the notice "Changes will not be kept after you close this tab."
  **Verification Gate:** run `npm run build` with zero errors. Open the file and confirm only `load`, `save` and `reset` are exported and every `localStorage` call sits inside `try/catch`.

- [x] **16. App state** (`src/state/reducer.ts`, `src/state/AppStateProvider.tsx`)
  Context plus `useReducer` for profile, `profileSavedAt`, saved ids, compare ids and document progress. Every change saves through the repository. Wrap the router in the provider.
  **Verification Gate:** run `npm run dev`. Open browser DevTools, Application tab, Local Storage, and confirm key `scholarready:v1` exists with `schemaVersion: 1` and saved ids `sch-001`, `sch-002`. Delete the key, refresh, and confirm it reappears.

- [x] **17. Eligibility engine** (`src/lib/eligibility.ts`)
  Pure functions per PRD Section 5.3: rule outcome (`met`, `not_met`, `check`), match group (`eligible`, `partial`, `not_eligible`), `metCount` counting `met` only, and a plain-language explanation stating the student's value and the requirement.
  **Verification Gate:** run `npm run build` with zero errors. Open the file and confirm there is no randomness, weighting, scoring or percentage. Full result check happens in Task 38.

- [x] **18. Checklist and readiness** (`src/lib/checklist.ts`)
  De-duplicate required documents across saved scholarships, list which scholarships use each document, and compute "X of Y ready" per scholarship and overall.
  **Verification Gate:** run `npm run build` with zero errors. Full check happens in Task 42.

- [x] **19. Deadline sorting** (`src/lib/deadlines.ts`)
  Sort deadlines ascending, split into upcoming and "Passed", and produce labels "Due in 5 days", "Due today", "Passed 3 days ago".
  **Verification Gate:** run `npm run build` with zero errors. Full check happens in Task 43.

---

## Module 4: App Shell and Shared Components

- [x] **20. Skip link** (`src/components/layout/SkipLink.tsx`)
  First focusable element, hidden until focused, links to `#main`.
  **Verification Gate:** load any page, press Tab once and confirm "Skip to main content" appears. Press Enter and confirm the next Tab lands inside the main content, not the header.

- [x] **21. Header and navigation** (`src/components/layout/Header.tsx`)
  Logo, links Dashboard, Matches, Compare, Checklist, Pricing, plus Profile link. Active page uses `aria-current="page"` and a visible underline. Below 1024px, links collapse into a Menu button (disclosure pattern).
  **Verification Gate:** click each link and confirm the current page is underlined. Narrow the window below 1024px, confirm a Menu button appears, and open and close it using only the keyboard.

- [x] **22. Footer** (`src/components/layout/Footer.tsx`)
  Text "All data is fictional. ScholarReady does not predict outcomes." and a privacy statement link to `/profile#pdpo`.
  **Verification Gate:** confirm the footer appears on every page and the privacy link opens the profile page.

- [x] **23. Demo badge** (`src/components/layout/DemoBadge.tsx`)
  Persistent text "Demo mode: all scholarships and people are fictional."
  **Verification Gate:** visit all eight routes and confirm the badge is visible in the header on each.

- [x] **24. App shell** (`src/components/layout/AppShell.tsx`)
  Layout route combining skip link, header, `<main id="main">` (max-width 1200px), and footer. Sticky header must never cover the focused element.
  **Verification Gate:** on each page confirm exactly one main heading. On a long page, Tab through links and confirm no focused item hides under the sticky header.

- [x] **25. Dialog** (`src/components/common/Dialog.tsx`)
  `role="dialog"`, `aria-modal="true"`, labelled title, focus trapped inside, Escape closes, focus returns to the trigger.
  **Verification Gate:** run `npm run build` with zero errors. Behaviour is checked through Task 27.

- [x] **26. Live region** (`src/components/common/LiveRegion.tsx`)
  Polite `aria-live` region for save and status announcements.
  **Verification Gate:** run `npm run build` with zero errors. Announcements are checked in Task 34.

- [x] **27. Reset demo button** (`src/components/layout/ResetDemoButton.tsx`)
  Opens the Dialog with a confirmation. Confirm calls `repository.reset()` and recalculates deadline dates from today.
  **Verification Gate:** click "Reset demo". Confirm focus moves into the dialog, Tab stays inside it, Escape closes it and focus returns to the button. Open it again, confirm, and check in DevTools Local Storage that `seededAt` has updated.

- [x] **28. Match group badge** (`src/components/common/MatchGroupBadge.tsx`)
  Icon plus text for Eligible, Partial match, Not eligible. Never colour alone.
  **Verification Gate:** run `npm run build` with zero errors. Visual check in Task 38: each badge readable with colour ignored.

- [x] **29. Deadline chip** (`src/components/common/DeadlineChip.tsx`)
  Date as `D MMM YYYY` plus relative days.
  **Verification Gate:** run `npm run build` with zero errors. Visual check in Task 36.

- [x] **30. Readiness meter** (`src/components/common/ReadinessMeter.tsx`)
  "X of Y ready" text plus a bar with an accessible text equivalent. No percentage shown.
  **Verification Gate:** run `npm run build` with zero errors. Visual check in Task 44.

- [x] **31. Empty state** (`src/components/common/EmptyState.tsx`)
  Heading, short message and one action link.
  **Verification Gate:** run `npm run build` with zero errors. Visual check in Tasks 40, 44 and 46.

---

## Module 5: Pages (user-journey order)

- [x] **32. Landing page** (`src/pages/LandingPage.tsx`)
  H1 "Find scholarships you qualify for, and get every application ready.", three how-it-works steps, four trust statements (PRD Section 3.4), "Try the demo" button.
  **Verification Gate:** (PRD 9.1) confirm the H1, three steps and four trust statements render, including "We never estimate whether you will win an award". After a reset, "Try the demo" goes to `/profile`; after saving a profile it goes to `/dashboard`. Tab through the page and confirm every link and button shows a focus ring in order.

- [x] **33. PDPO statement** (`src/components/profile/PdpoStatement.tsx`)
  Headed section with `id="pdpo"` containing the six paragraphs from PRD Section 7.2 word for word.
  **Verification Gate:** compare the on-screen text with Section 7.2 and confirm all six paragraphs (Purpose, Voluntary, Storage, Transfer, Access and correction, Demo notice) match.

- [x] **34. Profile page** (`src/pages/ProfilePage.tsx`, `src/components/profile/ProfileForm.tsx`)
  Fields grouped into Study details, Background, Activities, each with a visible label and helper text. First generation offers "Prefer not to say". Inline validation and error summary. PDPO statement above Save. Save announces "Profile saved. Matches updated."
  **Verification Gate:** (PRD 9.2) confirm the form loads pre-filled with Chloe's data. Change GPA to 3.20, save, reload, and confirm 3.20 remains. Enter GPA 5.00 and save; confirm an inline error and an error summary that receives focus. Confirm the PDPO statement is visible above Save without opening anything, and `/profile#pdpo` jumps to it. Reset demo data afterwards.

- [x] **35. Eligibility reason list** (`src/components/matches/EligibilityReasonList.tsx`)
  One row per criterion with icon plus text "Meets", "Does not meet" or "Check" and the plain-language explanation.
  **Verification Gate:** run `npm run build` with zero errors. Visual check in Task 38.

- [x] **36. Scholarship card** (`src/components/matches/ScholarshipCard.tsx`)
  Name, provider, amount, DeadlineChip, MatchGroupBadge, "X of Y criteria met", expandable reasons, Save and Add to compare buttons. Free save limit of 5: the sixth save is not added and a calm notice links to `/pricing`.
  **Verification Gate:** on `/matches`, confirm the Victoria Harbour card shows HK$20,000, a date like "14 Nov 2026" with days remaining, and "3 of 3 criteria met". Save three more scholarships (total 5), then try a sixth; confirm a calm notice with a link to Pricing appears and the sixth is not saved. Reset demo data afterwards.

- [x] **37. Match filters** (`src/components/matches/MatchFilters.tsx`)
  Filters: award type, minimum amount, deadline within 14, 30 or 60 days. Sort: deadline soonest (default), amount highest, name A to Z. All controls labelled.
  **Verification Gate:** filter award type "Sports" and confirm only Shek O Sports Scholarship shows. Clear filters, sort by "Amount highest" and confirm Peak Academic Excellence Scholarship (HK$60,000) is first in Not eligible.

- [x] **38. Matches page** (`src/pages/MatchesPage.tsx`, `src/components/matches/CompareTray.tsx`)
  Three groups in order Eligible, Partial match, Not eligible; "How matching works" note; compare tray holding up to 3 scholarships.
  **Verification Gate:** (PRD 9.3, 10.4) with the unchanged seed profile confirm exactly 4 Eligible (sch-001 to sch-004), 4 Partial match (sch-005 to sch-008), 4 Not eligible (sch-009 to sch-012). Confirm Eligible is ordered Kowloon, Victoria Harbour, Lion Rock, Pearl River by default. Expand Tai Mo Shan and confirm a "Check" reason about the leadership role. Change GPA to 3.70 on the profile and confirm Peak Academic Excellence moves to Eligible. Reset demo data afterwards.

- [x] **39. Scholarship detail page** (`src/pages/ScholarshipDetailPage.tsx`)
  Header, description, criteria with reasons, required documents with checklist status, deadline timeline, label "Fictional provider (demo)", Save button.
  **Verification Gate:** (PRD 9.4) open `/scholarships/sch-001` and confirm criteria, two documents (transcript shown Ready) and the close date. Open `/scholarships/sch-999` and confirm the not found state. Save sch-003 from its detail page and confirm it appears on `/dashboard` and `/checklist`. Reset demo data afterwards.

- [x] **40. Compare page** (`src/pages/ComparePage.tsx`)
  Real `<table>` with `<caption>` and `<th scope>` headers; rows for amount, provider, award type, match group, criteria met, each criterion, documents, deadlines, renewable. Fourth item blocked with an announced message.
  **Verification Gate:** (PRD 9.5) add 3 scholarships from Matches and confirm they appear side by side. Try adding a fourth and confirm a message appears and it is not added. Remove all and confirm the empty state links back to `/matches`.

- [x] **41. Document row** (`src/components/checklist/DocumentRow.tsx`)
  Name, description, StatusSelect (Not started, In progress, Ready), EvidenceNoteField (max 280 characters with live count), UsedByChips, last updated, earliest related deadline.
  **Verification Gate:** run `npm run build` with zero errors. Visual check in Task 42.

- [x] **42. Checklist page** (`src/pages/ChecklistPage.tsx`)
  Summary bar "X of Y ready" with ReadinessMeter, filters by status and by scholarship, one DocumentRow per unique document.
  **Verification Gate:** (PRD 9.6) with the seed confirm 4 rows and summary "2 of 4 ready". Confirm Personal statement appears once with chips for both Victoria Harbour and Lion Rock. Mark Personal statement Ready and confirm "3 of 4 ready" immediately and after reload. Type a note past 280 characters and confirm the count stops at 280 and the note persists after reload. Reset demo data afterwards.

- [x] **43. Deadline list** (`src/components/dashboard/DeadlineList.tsx`)
  Upcoming deadlines ascending, separate "Passed" group, relative labels using DeadlineChip.
  **Verification Gate:** on `/dashboard` with the seed confirm the order Victoria Harbour close, Lion Rock reference due, Lion Rock close. Save Tsing Yi Volunteer Impact Award and confirm its reference deadline appears under "Passed" as "Passed 3 days ago" and its close shows "Due in 5 days". Reset demo data afterwards.

- [x] **44. Dashboard page** (`src/pages/DashboardPage.tsx`)
  DeadlineList, ReadinessCard per saved scholarship, SavedScholarshipsPanel, NextActionsPanel (up to 3 rule-based actions), empty state.
  **Verification Gate:** (PRD 9.7) with the seed confirm Victoria Harbour shows "1 of 2 documents ready" and Lion Rock shows "1 of 3 documents ready", with no percentages. Confirm no more than 3 next actions. Unsave both scholarships and confirm the empty state links to `/matches`. Reset demo data afterwards.

- [x] **45. Pricing page** (`src/pages/PricingPage.tsx`)
  Three PricingTierCards (Free HK$0, Seasonal Premium HK$38 per season, Institutional Licence quoted), label "Illustrative pricing (demo)", FairnessStatement beneath, buttons open DemoOnlyDialog.
  **Verification Gate:** (PRD 9.8) confirm three tiers, the demo label and the fairness statement. Click each tier button and confirm the dialog says "Payments are not available in this demo. No charge has been made.", focus stays inside, Escape closes it and focus returns to that button. Confirm no card or payment field exists anywhere on the page.

- [x] **46. Not found page** (`src/pages/NotFoundPage.tsx`)
  Friendly message using EmptyState with a link to `/dashboard`.
  **Verification Gate:** visit `/does-not-exist` and confirm the message, one heading and a working link to the dashboard.

---

## Module 6: Pre-Launch Checks and Deployment

- [x] **47. Prohibited wording search** (whole `src/` folder)
  Search `src/` for: chance, likelihood, probability, odds, win rate, success score, strong candidate. Fix any match.
  **Verification Gate:** run the project-wide search for each term and confirm zero results (PRD 7.4).

- [x] **48. Keyboard and contrast pass** (all pages)
  Complete the user journey using only the keyboard. Check text and focus ring colours with a contrast checker. Check 200% browser zoom in a 1280px window.
  **Verification Gate:** confirm every link, button and field on all nine pages is reachable by Tab with a visible focus ring and no traps outside dialogs. Confirm body text contrast is at least 4.5:1 and focus rings at least 3:1. At 200% zoom, confirm text is readable and buttons usable.

- [x] **49. Production build and journey check** (`dist/`)
  Run the production build and preview, then walk the full journey from PRD Section 3.3.
  **Verification Gate:** (PRD 9.9) run `npm install && npm run build` with zero errors and no environment variables. In `npm run preview`, keep the DevTools Network tab open during the full journey and confirm no requests go to external domains. Use "Reset demo data" and confirm the seed returns (4 / 4 / 4 on Matches, "2 of 4 ready" on Checklist).

- [ ] **50. Push to GitHub** (repository)
  Add a `.gitignore` excluding `node_modules` and `dist`. Connect the Manus project to GitHub using the Manus GitHub icon and create a private repository named `scholar-ready` (assignment brief, Appendix 6). Then invite edwinluk@cuhk.edu.hk as a collaborator (Appendix 7).
  **Verification Gate:** open the repository on GitHub and confirm the Private label, at least one commit, `PRD.md`, `tasklist.md`, `src/`, `package.json` and `vercel.json` are present, and `node_modules`, `dist` and any `.env` file are absent. Confirm the invitation to edwinluk@cuhk.edu.hk appears under Settings, Collaborators.

- [ ] **51. Deploy to Vercel** (Vercel project)
  Import the GitHub repository, choose the Vite preset, build command `npm run build`, output `dist`, no environment variables.
  **Verification Gate:** open the live URL and confirm the landing page loads. Paste `/matches` and `/scholarships/sch-001` directly into the address bar, refresh each, and confirm both load with no 404. Confirm 4 Eligible, 4 Partial match, 4 Not eligible on the live site.

---

## Deferred (Phase 2, do not build)

No tasks are created for these items in Phase 1.

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

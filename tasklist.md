=====

# tasklist.md: ScholarReady Execution Plan

| Item | Detail |
|---|---|
| Source | PRD.md v1.5 |
| Executor | Manus AI |
| Tasks | 37 in 7 modules (Tasks 1 to 35 consolidated from the original 57, original numbers in brackets; Tasks 36 and 37 added in v1.5) |
| Status | Tasks 1 to 35 complete |

## Rules for the Agent

1. Work in task order and start a task only when its dependencies are done and their checks pass.
2. Build only what the task describes; if a check fails, fix it within the same task.
3. Never add a database, authentication, `.env` files, environment variables, payment code, uploads, email capture, analytics or external requests.
4. Use fictional data, UK English, `en-GB` dates (14 Nov 2026) and HK$ with thousands separators.
5. Never use the banned words in PRD Section 8.3 in user-facing text.
6. All checks are manual in Phase 1. "Reset" means select "Reset demo data" after the check so the next task starts from the seed.

---

## Module 1: Setup

- [x] **1. Scaffold and tooling** [1 to 4]
  Vite React + TypeScript project `scholarready` (`strict: true`, `<html lang="en-GB">`, title "ScholarReady", `react-router-dom`); Tailwind with the six palette tokens (PRD 8.1); global styles (system fonts, amber `focus-visible` ring, `scroll-margin-top`, reduced motion); ESLint with `jsx-a11y`, Prettier and a `lint` script.
  **Done when:** `npm run build` and `npm run lint` show zero errors; page source shows `lang="en-GB"`; pressing Tab shows an amber focus ring.
  **Depends on:** none.

- [x] **2. Routes and SPA config** [5, 6]
  `createBrowserRouter` for every route in PRD 3.1, each with a placeholder H1; `vercel.json` rewrite to `/index.html`.
  **Done when:** each route shows its heading; `/random-page` shows "Page not found"; in `npm run preview`, refreshing `/checklist` loads with no 404.
  **Depends on:** 1.

## Module 2: Data

- [x] **3. Types** [7]
  Define every entity in PRD 6.5 in `src/types/models.ts`.
  **Done when:** the build passes and `MatchGroup` is `eligible`, `partial` or `not_eligible`.
  **Depends on:** 1.

- [x] **4. Profile and document seed** [8, 9]
  Seed profile (PRD 9.1) and the 9 documents (PRD 9.2).
  **Done when:** all 10 profile values match PRD 9.1; there are exactly 9 documents and the identity document has no ID-number field.
  **Depends on:** 3.

- [x] **5. Scholarship, rule and deadline seed** [10 to 12]
  12 scholarships (PRD 9.3), 29 rules with labels set to the requirement sentences (PRD 9.4), 18 deadlines as day offsets.
  **Done when:** ids run sch-001 to sch-012, providers end "(fictional)", amounts range HK$8,000 to HK$60,000; 29 rules, of which 3 are manual (sch-005, sch-006, sch-008); 18 deadlines, 12 of them application close, and the only negative offset is sch-008 reference due (-3).
  **Depends on:** 3.

- [x] **6. Seed builder** [13]
  `buildSeed(today)` converts offsets to dates and returns the starting state (PRD 9.1: two saved scholarships, three document statuses).
  **Done when:** the build passes and the returned saved ids and statuses match PRD 9.1.
  **Depends on:** 4, 5.

## Module 3: Logic

- [x] **7. Date and deadline helpers** [14, 19]
  `formatDate`, `daysFromToday`, `formatHKD`; sort deadlines, split upcoming and "Passed", relative labels.
  **Done when:** the build passes; output is checked on screen in Tasks 17 and 23.
  **Depends on:** 1.

- [x] **8. Repository and app state** [15, 16]
  `load`, `save`, `reset` per PRD 6.3; React context with `useReducer` for user state, saving every change; provider wraps the router.
  **Done when:** only the three functions are exported and every storage call is in `try/catch`; DevTools shows `scholarready:v1` with `schemaVersion: 1` and saved ids sch-001, sch-002; deleting the key and refreshing recreates it.
  **Depends on:** 6.

- [x] **9. Eligibility engine** [17]
  Outcomes, groups and counts per PRD 5.1 (wording revised in Task 33).
  **Done when:** the file has no randomness, weighting, scoring or percentages and the build passes; results are checked in Task 19.
  **Depends on:** 3, 5.

- [x] **10. Checklist and readiness** [18]
  De-duplicated document list, "used by" scholarships, "X of Y ready" per scholarship and overall (PRD 5.2).
  **Done when:** the build passes; results are checked in Tasks 22 and 23.
  **Depends on:** 3.

## Module 4: App Shell and Shared Components

- [x] **11. App shell** [20, 22 to 24]
  Skip link, `<main id="main">` (max 1200px), footer text and privacy link (link target changed to `/privacy` in Task 32), demo badge (PRD 4.2).
  **Done when:** the first Tab shows "Skip to main content" and Enter moves focus into main; footer and badge appear on every page; each page has one H1; the sticky header never hides the focused element.
  **Depends on:** 2.

- [x] **12. Header and navigation** [21]
  Links, active state and the below-1024px Menu button (PRD 4.2).
  **Done when:** the current page link is underlined; below 1024px the Menu opens and closes by keyboard only.
  **Depends on:** 11.

- [x] **13. Dialog, live region and Reset** [25 to 27]
  Accessible dialog, polite live region, "Reset demo data" with confirmation calling `reset()` and recalculating dates.
  **Done when:** focus moves into the dialog and stays there, Escape closes it and focus returns to the button; after confirming, `seededAt` updates in DevTools.
  **Depends on:** 8, 11.

- [x] **14. Display components** [28 to 31]
  Match badge (icon plus text), deadline chip (date plus relative days), readiness meter ("X of Y ready", no percentage), empty state.
  **Done when:** the build passes; each is checked on screen in Tasks 17, 19, 23 and 25.
  **Depends on:** 1.

## Module 5: Pages

- [x] **15. Landing page** [32]
  H1, three steps, trust statements, "Try the demo" routing (PRD 4.3).
  **Done when:** all trust statements render, including "We never estimate whether you will win an award"; after a reset the button opens `/profile`, after saving a profile it opens `/dashboard`; a keyboard pass shows a focus ring on every control.
  **Depends on:** 8, 12.

- [x] **16. Profile page and privacy notice** [33, 34]
  Notice component with the six paragraphs from PRD 8.2 word for word (`id="pdpo"`); grouped form with labels, helper text, validation and live announcement.
  **Done when:** the form loads Chloe's data; GPA 3.20 saved persists after reload; GPA 5.00 shows an inline error and a focused error summary; the notice is visible above Save and `/profile#pdpo` jumps to it. Reset.
  **Depends on:** 8, 13.

- [x] **17. Scholarship card and reasons** [35, 36]
  Reason list (icon plus "Meets", "Does not meet" or "Check" and the explanation); card per PRD 4.3; free limit of 5 saves, where a sixth is not saved and a calm notice links to Pricing.
  **Done when:** Victoria Harbour shows HK$20,000, a date like "14 Nov 2026" with days remaining and "3 of 3 criteria met"; after saving 5, a sixth is refused with the notice. Reset.
  **Depends on:** 7, 9, 14.

- [x] **18. Match filters** [37]
  Filters and sorts per PRD 4.3, all labelled.
  **Done when:** filtering "Sports" shows only Shek O; sorting by amount puts Peak Academic Excellence (HK$60,000) first in Not eligible.
  **Depends on:** 17.

- [x] **19. Matches page and compare tray** [38]
  Three groups, "How matching works" note, tray holding up to 3.
  **Done when:** groups match PRD 9.5; Eligible is ordered Kowloon, Victoria Harbour, Lion Rock, Pearl River by default; Tai Mo Shan shows a "Check" reason about the leadership role; GPA 3.70 moves Peak Academic Excellence to Eligible. Reset.
  **Depends on:** 17, 18.

- [x] **20. Scholarship detail page** [39]
  Per PRD 4.3.
  **Done when:** `/scholarships/sch-001` shows criteria, two documents (transcript Ready) and the close date; `/scholarships/sch-999` shows the not found state; saving sch-003 here adds it to Dashboard and Checklist. Reset.
  **Depends on:** 17.

- [x] **21. Compare page** [40]
  Accessible comparison table per PRD 4.3 (criterion rows revised in Task 34).
  **Done when:** 3 scholarships show side by side; a fourth is refused with a message; removing all shows the empty state linking to `/matches`.
  **Depends on:** 19.

- [x] **22. Checklist page** [41, 42]
  Document rows with status, evidence note and chips; summary with readiness meter; filters.
  **Done when:** the seed shows 4 rows and "2 of 4 ready", with Personal statement once for Victoria Harbour and Lion Rock; marking it Ready shows "3 of 4 ready" immediately and after reload; a note stops at 280 characters and persists. Reset.
  **Depends on:** 10, 14.

- [x] **23. Dashboard page** [43, 44]
  Deadline list, readiness cards, saved scholarships, up to 3 next actions, empty state.
  **Done when:** deadlines run Victoria Harbour close, Lion Rock reference, Lion Rock close; saving Tsing Yi shows its reference under "Passed 3 days ago" and close as "Due in 5 days"; Victoria Harbour shows "1 of 2 documents ready" and Lion Rock "1 of 3", with no percentages; unsaving both shows the empty state. Reset.
  **Depends on:** 7, 10, 14.

- [x] **24. Pricing page** [45]
  Three tiers, demo label, fairness statement, demo-only dialog (PRD 4.3).
  **Done when:** each button opens the dialog with the exact message, focus is trapped, Escape closes it and focus returns; no card or payment field exists.
  **Depends on:** 13.

- [x] **25. Not found page** [46]
  **Done when:** `/does-not-exist` shows a friendly message, one heading and a working link to the dashboard.
  **Depends on:** 14.

## Module 6: Launch

- [x] **26. Wording, keyboard and contrast checks** [47, 48]
  **Done when:** a search of `src/` for the banned words returns nothing; every control on every page is reachable by Tab with a visible focus ring and no traps outside dialogs; body text is at least 4.5:1 and focus rings at least 3:1; text and buttons work at 200% zoom in a 1280px window.
  **Depends on:** 15 to 25.

- [x] **27. Production build and journey** [49]
  **Done when:** `npm install && npm run build` passes with no environment variables; the full journey (PRD 4.1) makes no external requests; Reset restores 4 / 4 / 4 on Matches and "2 of 4 ready" on Checklist.
  **Depends on:** 26.

- [x] **28. Push to GitHub** [50]
  `.gitignore` for `node_modules` and `dist`; private repository `scholar-ready`; invite edwinluk@cuhk.edu.hk as a collaborator.
  **Done when:** the repo is Private with commits, `PRD.md`, `tasklist.md`, `src/`, `package.json` and `vercel.json`, and no `node_modules`, `dist` or `.env`; the invitation appears under Settings, Collaborators.
  **Depends on:** 27.

- [x] **29. Deploy to Vercel** [51]
  Import the repository with the Vite preset, `npm run build`, output `dist`, no environment variables.
  **Done when:** the live landing page loads; `/matches` and `/scholarships/sch-001` refresh without 404; the live site shows 4 / 4 / 4.
  **Note:** the Manus Vercel connector failed with a scope authorisation error, so the repository was imported into Vercel manually (assignment brief, Appendix 8).
  **Depends on:** 28.

## Module 7: Post-Launch Improvements

- [x] **30. Landing match preview** [52]
  Read-only "Example match (demo data)" card per PRD 4.3, using the existing engine.
  **Done when:** after a reset it shows Kowloon Business Leaders Bursary, HK$25,000, Eligible, "3 of 3 criteria met"; "See all matches" opens `/matches` and is reachable by Tab.
  **Depends on:** 9, 15.

- [x] **31. Social sharing tags** [53]
  Meta description, `og:title`, `og:description`, `og:type`, `og:url` and `twitter:card` in `index.html`.
  **Done when:** all appear in page source in `npm run preview`.
  **Depends on:** 1.

- [x] **32. Privacy page** [54]
  `/privacy` with H1 "Privacy statement", the notice and a link back to Profile; footer link changed from `/profile#pdpo` to `/privacy`; notice stays on Profile.
  **Done when:** the footer link opens `/privacy`; a direct refresh does not 404; Profile still shows the notice above Save.
  **Depends on:** 11, 16.

- [x] **33. Plain-language reasons** [55]
  Build every reason from the student sentence and the rule label (PRD 5.3, 9.4) on every screen.
  **Done when:** after a reset, `/scholarships/sch-002` reads "Your activities include community service and leadership. This scholarship requires community service." and "You are in Year 1. This scholarship is open to Years 1 to 4."; with GPA 1.50, Peak Academic Excellence reads "Your GPA is 1.50. This scholarship requires 3.60 or above."; no screen shows "Your value is", "r-0" or underscores in reasons. Reset.
  **Depends on:** 5, 9.

- [x] **34. Compare criterion rows** [56]
  One row per criterion type with plain labels, requirement and result, or "No requirement" (PRD 4.3).
  **Done when:** comparing Peak Academic Excellence, Shek O and Lion Rock shows GPA, Year of study and Activities rows, with no "Not applicable" or rule ids, and the table keeps its caption and headers.
  **Depends on:** 21, 33.

- [x] **35. Redeploy and verify live** [57]
  Push to GitHub so Vercel redeploys.
  **Done when:** the live site shows the match preview, sharing tags, `/privacy` via the footer, plain-language reasons and grouped compare rows, and still shows 4 / 4 / 4 after a reset.
  **Note:** this commit failed to build on the original `scholar-ready` Vercel project but deployed on the duplicate project `scholar-ready-yrwe`. The domain `scholar-ready.vercel.app` was moved to that working project, so the submitted live URL shows the current version.
  **Depends on:** 30 to 34.

- [x] **36. Demo sign-in page** (`src/pages/SignInPage.tsx`, `src/routes.tsx`, `src/components/layout/Header.tsx`)
  Add `/sign-in` per PRD 4.3 and a "Sign in" link in the header (also in the below-1024px Menu). No input fields, no real authentication, no stored credentials.
  **Done when:** the header link opens `/sign-in` and is reachable by Tab with a visible focus ring; "Continue with the demo account" opens `/profile` after a reset and `/dashboard` after saving a profile; the page has no form fields; a direct refresh does not 404; `npm run build` and `npm run lint` pass. Reset.
  **Depends on:** 12, 15.

- [x] **37. Redeploy and verify live**
  Push to GitHub so Vercel redeploys.
  **Done when:** on https://scholar-ready.vercel.app the Task 36 checks pass, and the landing match preview, `/privacy` and the 4 / 4 / 4 split after a reset still work.
  **Depends on:** 36.

---

## Deferred (Phase 2)

No tasks. See PRD Section 3.2 (P2-1 to P2-8).

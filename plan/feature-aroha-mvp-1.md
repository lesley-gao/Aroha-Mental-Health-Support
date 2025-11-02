---
goal: feature-aroha-mvp
version: 1.0
date_created: 2025-11-01
last_updated: 2025-11-01
owner: Lesley Gao
tags: [feature, mvp, phq-9, implementation]
---

# Introduction

This implementation plan is a deterministic, machine-parseable set of phases and tasks to build the Aroha MVP described in `#file:spec/spec-design-aroha-mvp.md`. The plan targets a React + Vite TypeScript prototype with localStorage persistence, i18n (English + te reo Māori), a PHQ‑9 form, history, audio playback, and PDF export. All tasks include exact file paths, function names, and validation criteria.

## 1. Requirements & Constraints

- **REQ-001**: Implement PHQ‑9 form UI using localized strings from `src/i18n/messages.ts`.
- **REQ-002**: Persist PHQ9Record to localStorage via functions exported from `src/utils/storage.ts` (`saveRecord`, `getRecords`, `clearRecords`).
- **REQ-003**: Compute PHQ-9 total in `src/pages/PHQ9.tsx` using function `computePHQ9Total(answers:number[]):number` (inline or helper) and derive severity using `src/utils/severity.ts::getSeverity`.
- **REQ-004**: Provide an audio player component at `src/components/AudioPlayer.tsx` rendering an HTML5 <audio> element with `controls` and `src` prop.
- **REQ-005**: Generate PDF export using `src/utils/pdf.ts::generatePDF(records:any[])` and `jsPDF`.
- **REQ-006**: Provide language switching persisted via `src/utils/storage.ts::setLanguage` and `getLanguage`.
- **CON-001**: Client-only prototype; no backend, no auth; data stored only in localStorage.
- **SEC-001**: No automatic external contact operations; export is user-initiated only.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Project scaffold, core routing, and storage utilities

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Initialize Vite React TypeScript project and commit initial scaffold. Commands: `npm create vite@latest phq9-mvp -- --template react-ts`, `cd phq9-mvp`, `git init`, `git checkout -b feat/aroha-mvp` — create `package.json` and basic files. | ✅ | 2025-11-01 |
| TASK-002 | Create `src/main.tsx` to mount React app. Implement `src/App.tsx` with shell nav buttons (PHQ, History, Settings). | ✅ | 2025-11-01 |
| TASK-002b | Create `.gitignore` and add basic scripts to `package.json`: `dev`, `build`, `preview`, `test`. Add `README.md` with quick run instructions. | ✅ | 2025-11-01 |
| TASK-002c | Install Tailwind CSS: run `npm install -D tailwindcss postcss autoprefixer` and `npx tailwindcss init -p`. Add Tailwind directives to `src/index.css`. Modify `tailwind.config.cjs` content globs to include `./index.html` and `./src/**/*.{ts,tsx}`. | ✅ | 2025-11-01 |
| TASK-002d | Initialize `shadcn-ui` components (optional but requested): run `npx shadcn-ui@latest init` and follow prompts. Add generated components to `src/components/ui/` and wire Tailwind theme tokens. Install Radix packages as needed (e.g., `@radix-ui/react-dialog`). | ✅ | 2025-11-01 |
| TASK-002e | Update styling: replace basic layout and controls in `src/App.tsx`, `src/pages/PHQ9.tsx`, and `src/pages/History.tsx` with shadcn-ui components or Tailwind utility classes. Ensure `src/index.css` includes `@tailwind base; @tailwind components; @tailwind utilities;`. | ✅ | 2025-11-01 |
| TASK-003 | Add storage utilities file `src/utils/storage.ts` exporting `getRecords():Promise<any[]>`, `saveRecord(record:any):Promise<void>`, `clearRecords():Promise<void>`, `getLanguage():string`, `setLanguage(lang:string):void`. Implement using `localStorage` keys: `phq9_records` and `phq9_lang`. | ✅ | 2025-11-01 |
| TASK-004 | Add severity helper `src/utils/severity.ts` exporting `getSeverity(total:number):string` returning severity buckets per spec thresholds (>=20 Severe, >=15 Moderately severe, >=10 Moderate, >=5 Mild, else Minimal). | ✅ | 2025-11-01 |

### Add consent & privacy tasks (new)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004b | Implement `src/pages/Consent.tsx` and a consent modal shown at first run. The consent modal must explain data stored locally, export behavior (PDF/JSON), and require an explicit action `I consent` to enable exports. Persist consent via `src/utils/storage.ts::setConsent(consentObj)`. | ✅ | 2025-11-01 |
| TASK-004c | Add `src/pages/Privacy.tsx` displaying the disclaimer "Your data is stored locally. You can delete it at any time." with buttons: "Delete my data" (calls `clearAllData()` from storage), "Export JSON" (calls `exportAllData()` from storage). | ✅ | 2025-11-01 |
| TASK-005 | Create page `src/pages/PHQ9.tsx` that renders the 9 localized questions from `messages` with 4-option radio buttons for each. Collect answers (0-3) in an array and display a submit button. On submit, compute total, severity, and call `saveRecord({...})`. | ✅ | 2025-11-01 |
| TASK-006 | Implement the function `computePHQ9Total(answers: number[]): number` that sums the array (0–3 per question, 9 questions, total 0–27). Include it in PHQ9 logic or in a separate utility file. | ✅ | 2025-11-01 |
| TASK-007 | Create `src/pages/History.tsx` that calls `getRecords()` and displays a table or list of records (date, score, severity). If no records, show `historyEmpty` message. Add a button to call the PDF generator (next task). | ✅ | 2025-11-01 |
| TASK-008 | Create `src/utils/pdf.ts` with a `generatePDF(records: any[])` function. Use `jsPDF` library (`npm install jspdf`) to create a simple one-page or multi-page PDF summarizing all records. Trigger download. | ✅ | 2025-11-01 |

### Implementation Phase 2

- GOAL-002: PHQ‑9 form, scoring, history UI, and PDF export

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Implement `src/pages/PHQ9.tsx`. Requirements: render 9 localized questions from `src/i18n/messages.ts`, radio inputs 0..3 per question, maintain `answers:number[9]` state, validate all answered, call `computePHQ9Total(answers)` on submit, call `saveRecord(...)` with record matching PHQ9Record schema. Save `createdAt` using `new Date().toISOString()`. | ✅ | 2025-11-01 |
| TASK-006 | Implement `computePHQ9Total(answers:number[]):number` in `src/pages/PHQ9.tsx` or `src/utils/compute.ts`. Ensure returned value equals sum of entries. | ✅ | 2025-11-01 |
| TASK-007 | Implement `src/pages/History.tsx` that calls `getRecords()` on mount and displays records in descending chronological order. Include 'Export PDF' button that calls `generatePDF(records)` imported from `src/utils/pdf.ts`. | ✅ | 2025-11-01 |
| TASK-008 | Implement `src/utils/pdf.ts` exporting `generatePDF(records:any[]):void` that uses `jsPDF` to create a PDF with header `PHQ-9 Summary`, then each record line: index, ISO date, total, severity. Trigger file save as `phq9-summary.pdf`. | ✅ | 2025-11-01 |

| TASK-008b | Add `public/resources.json` containing NZ crisis phone numbers and links. Implement `src/utils/resources.ts` to read and surface resource links in the Escalation dialog. | ✅ | 2025-11-01 |

### Implementation Phase 3

- GOAL-003: Audio player, i18n, settings, nudges/escalation messages, and polish

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-009 | Add `public/sample-meditation.mp3` placeholder audio file. | ✅ | 2025-11-01 |
| TASK-010 | Implement `src/components/AudioPlayer.tsx` expecting prop `{src:string}` and render `<audio controls src={src}></audio>`. | ✅ | 2025-11-01 |
| TASK-011 | Add localization messages file `src/i18n/messages.ts` with keys: `questions`(array of 9 for `en` and `mi`), `responses` (array of response strings), UI labels (`submit`, `history`, `settings`, `nudgeText`, `escalationText`, disclaimers). Implement simple lookup `const t = (lang,key)=>...` in `src/i18n/index.ts`. | ✅ | 2025-11-01 |
| TASK-011b | Convert UI elements to use shadcn-ui primitives where available: `Button`, `Input`, `RadioGroup`, `Card`. Files to update: `src/pages/PHQ9.tsx`, `src/pages/History.tsx`, `src/components/AudioPlayer.tsx`. | ✅ | 2025-11-01 |
| TASK-012 | Implement `src/pages/Settings.tsx` or inline Settings section in `src/App.tsx` allowing user to change language; call `setLanguage(lang)` and persist. | ✅ | 2025-11-01 |
| TASK-013 | In `src/pages/PHQ9.tsx` and `src/App.tsx` add display logic: if most recent record total >= 10 show `nudgeText`; if >= 15 show `escalationText` with NZ crisis hotline copy. Use `getRecords()` to fetch most recent on mount. | ✅ | 2025-11-01 |
| TASK-014 | Add basic styles `src/index.css` and ensure accessibility: radio inputs labeled, semantic HTML, focus outlines. | ✅ | 2025-11-01 |
| TASK-014b | Add GitHub Actions workflow `/.github/workflows/ci.yml` that runs `npm ci`, `npm test`, and a lint step on pull requests. | ✅ | 2025-11-01 |
| TASK-014c | Ensure Tailwind's purge/content config is set so the production build is minimal. | ✅ | 2025-11-01 |

### Implementation Phase 4

- GOAL-004: Tests, README, and developer instructions

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Add Jest and React Testing Library; create `src/__tests__/compute.test.ts` and `src/__tests__/storage.test.ts` exercising basic scoring and storage logic. | ✅ | 2025-11-01 |
| TASK-016 | (Optional) Add Playwright and create `e2e/phq9.spec.ts` simulating a full user journey: language selection, PHQ-9 completion, history view, PDF export. | | |
| TASK-017 | Update `README.md` with a comprehensive "Getting Started," npm commands, architecture overview, acceptance criteria, cultural considerations, and references to specification. | ✅ | 2025-11-01 |
| TASK-017b | Verify `package.json` scripts include dev, build, preview, test, and lint. | ✅ | 2025-11-01 |

---

## Important implementation notes (added after review)

- Use the Web Crypto API (SubtleCrypto) if client-side encryption is required for any exported data before upload in production. Add a TODO in `src/utils/crypto.ts` if server sync is introduced.
- Ensure consent is revocable and that "Delete my data" fulfills local deletion for demo. Document limitations (local-only data cannot be recovered). 
- Add translation attribution block to the Settings > About screen referencing PHQ‑9 translation sources and licenses.


## 3. Alternatives

- **ALT-001**: Use Firebase/Firestore for early persistence; rejected for MVP due to privacy and time constraints.
- **ALT-002**: Use client-side PDF only (jsPDF) — chosen for speed of demo; server-side PDF generation could be added later for auditability.

## 4. Dependencies

- **DEP-001**: npm packages: `react`, `react-dom`, `typescript`, `vite`, `jspdf`, `dayjs`, `react-i18next` (optional), `jest`, `@testing-library/react`.
- **DEP-001**: npm packages: `react`, `react-dom`, `typescript`, `vite`, `jspdf`, `dayjs`, `react-i18next` (optional), `jest`, `@testing-library/react`.
- **DEP-002**: UI / styling: `tailwindcss`, `postcss`, `autoprefixer`, optional `shadcn-ui` components (initializer), and `@radix-ui/*` packages for primitives.
- **DEP-002**: Browser runtime for HTML5 audio.

## 5. Files

- **FILE-001**: `src/main.tsx` — app entry point
- **FILE-002**: `src/App.tsx` — app shell and routing
- **FILE-003**: `src/pages/PHQ9.tsx` — PHQ-9 form and submit logic
- **FILE-004**: `src/pages/History.tsx` — history list and PDF export
- **FILE-005**: `src/components/AudioPlayer.tsx` — audio player
- **FILE-006**: `src/utils/storage.ts` — localStorage helpers
- **FILE-007**: `src/utils/pdf.ts` — PDF generator using jsPDF
- **FILE-008**: `src/utils/severity.ts` — severity mapping
- **FILE-009**: `src/i18n/messages.ts` — localized strings
- **FILE-010**: `public/sample-meditation.mp3` — placeholder audio
- **FILE-011**: `src/index.css` — minimal styles

## 6. Testing

- **TEST-001**: Unit test `compute.test.ts` verifying `computePHQ9Total([0..3])` produces correct sums for sample arrays.
- **TEST-002**: Integration test `storage.test.ts` verifying `saveRecord` persists an object and `getRecords` returns it; `clearRecords` empties key.
- **TEST-003**: E2E test `phq9.spec.ts` validates full flow: load app, select language, answer 9 items, submit, verify history shows record and PDF export button triggers download.

## 7. Risks & Assumptions

- **RISK-001**: Using client-side localStorage limits persistence across devices — mitigated by explicit opt-in for cloud sync in future.
- **RISK-002**: PHQ-9 translations may require cultural review; assume review will be scheduled before production release.
- **ASSUMPTION-001**: Placeholder audio is CC0 and safe for demo.

## 8. Related Specifications / Further Reading

- `#file:spec/spec-design-aroha-mvp.md` — master specification for the MVP.
- PHQ-9 translations: https://www.phqscreeners.com/

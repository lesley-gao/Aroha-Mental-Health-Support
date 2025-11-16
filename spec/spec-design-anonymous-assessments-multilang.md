---
title: Design - Anonymous Assessments, Diary Onboarding & Multilanguage (English / Māori / Chinese)
version: 1.0
date_created: 2025-11-14
last_updated: 2025-11-14
owner: Product / Engineering
tags: [design, features, i18n, auth, ux, privacy]
---

# Introduction

This specification defines feature requirements, constraints, data contracts, and acceptance criteria for three related product changes to the Aroha MVP:

- Allow users to take the PHQ‑9 assessment anonymously (without logging in) and show a contextual prompt after scoring that describes the value of signing in to save and track scores across devices.
- Update the Diary feature UI so users can create diary entries locally and are clearly prompted to create an account / sign in to persist and sync diary history across devices.
- Add Simplified Chinese (locale code `zh`) as a supported language, so the application supports English (`en`), te reo Māori (`mi`) and Chinese (`zh`).

This document is intended for engineers, QA, product managers, and localization/clinical reviewers responsible for implementing and validating the feature.

## 1. Purpose & Scope

Purpose: Reduce onboarding friction by allowing anonymous PHQ‑9 assessments and local diary usage while providing clear, actionable prompts to sign up to retain cross‑device history; and add Simplified Chinese translations through the central i18n system.

Scope:

- Modify client application behavior (React codebase) and UI copy only. No mandatory backend changes except optional migration of local records to a user's cloud account when they choose to sign in and enable cloud sync.
- Update i18n `messages` to include `zh`, and ensure UI and PDF exports accept `zh` as a locale.
- Update routing and navigation to make the Home page the default entry point; authentication becomes opt‑in rather than mandatory on first load.

Out of scope:

- Changes to Supabase schema beyond existing `phq9_records` table (unless migration/mapping is required to store additional metadata, see Dependencies).
- Cross‑region crisis phone number selection (this spec recommends design but not region mapping logic).

Assumptions:

- The repository has a central i18n implementation in `src/i18n/messages.ts` with `getMessages(locale)` and a `Locale` TypeScript type.
- Local storage is used for anonymous/local persistence (`localStorage` keys defined in `src/utils/storage.ts`).

## 2. Definitions

- PHQ‑9: Patient Health Questionnaire‑9, a 9‑item depression screening tool.
- Anonymous / local-only usage: The user uses the app without authenticating. Data is stored in browser localStorage and not synced to the cloud.
- Cloud sync: Optional Supabase-based sync that stores PHQ‑9 records and diary entries in the user's account.
- Locale: Language code used by the app. Current values: `en` (English), `mi` (te reo Māori). New: `zh` (Simplified Chinese).
- Migration: The operation that copies local records into a user's cloud account on first sign-in or when the user explicitly chooses to migrate local data.

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: Allow PHQ‑9 assessments to be started and completed without authentication.
- **REQ-002**: On PHQ‑9 result screen (after submit), show a contextual informational message when user is not authenticated explaining: results are stored locally only, and offering an action (button/link) to sign up/log in to save and track scores across devices.
- **REQ-003**: Make the Home page (`/`) the default entry point. Do not redirect anonymous users to the login/signup page on initial load.
- **REQ-004**: Navigation bar must display a `Login` link when user is not authenticated and `Logout` when authenticated. The Login link routes to `/auth` (existing `Auth` component).
- **REQ-005**: The Diary page must allow creating and viewing diary entries locally, but should display a clear call-to-action (CTA) that explains the advantages of creating an account (persisting entries, syncing across devices) and link to `/auth`.
- **REQ-006**: Existing cloud sync must remain opt‑in. Enabling cloud sync triggers `syncAllRecordsToSupabase()` only when the user explicitly enables it.
- **REQ-007**: Add locale `zh` to the `Locale` type in `src/i18n/messages.ts` and include Chinese translations for all existing message keys required by the UI and PDF export.
- **REQ-008**: Ensure `getMessages(locale)` continues to fall back to English for missing keys.
- **REQ-009**: Ensure PDF export (exports from `src/utils/pdf.ts`) accepts `zh` and uses the correct translations when `locale === 'zh'`.
- **REQ-010**: Update consent / privacy copy to reflect that an account is optional and only required for cross-device sync. The consent text must remain compliant with any previous privacy claims (local storage, optional speech features, exports, delete all data).
- **SEC-001**: Do not auto-enable cloud sync. Cloud sync must only be activated after user explicit consent (existing `setCloudSyncEnabled` flow applies).
- **SEC-002**: When migrating local data to cloud on sign-in, only proceed if the user consents to upload local history to their account; provide an explicit opt-in prompt.
- **GUD-001**: Prefer using `getMessages(locale)` for all UI text instead of ad-hoc ternary checks to simplify multi-locale support and future additions.
- **CON-001**: Maintain current local storage keys and formats where possible to avoid large migrations. If new metadata is required (e.g., origin: `local` vs `cloud`), add optional fields to records and make migrations backward compatible.

## 4. Interfaces & Data Contracts

This section documents the important client-side interfaces and storage contracts to be implemented or changed.

4.1 i18n / Messages contract

- File: `src/i18n/messages.ts`
- Type: `export type Locale = 'en' | 'mi' | 'zh';`
- Function: `export function getMessages(locale: Locale): Messages;`
- Shape: `Messages` interface already defined in the repository (contains questions, responses, appTitle, settingsLanguage, disclaimer, phq9Info*, crisisText, etc.). Add Chinese (`zh`) object with all keys.
- Fallback behavior: `getMessages(locale)` must return `messages[locale] || messages.en`.

4.2 Local storage contract

- File: `src/utils/storage.ts`
- Keys: `phq9_records`, `phq9_lang`, `phq9_consent`, `phq9_cloud_sync_enabled`, `phq9_user_id`.
- PHQ9Record shape (existing):

  {
    id: string;
    answers: number[]; // 9 numbers 0-3
    total: number;
    severity: string;
    locale: string; // now 'en'|'mi'|'zh'
    createdAt: string; // ISO
  }

- New optional field recommendation: `origin?: 'local'|'cloud'` to help migration and deduplication, default to `'local'` when created anonymously.

4.3 Supabase / Cloud API contract (existing)

- Table: `phq9_records`
- When syncing to Supabase, existing fields are sent. Consider adding `locale` and `synced_at` metadata (if not present). Ensure the DB schema is able to accept these fields or omit them if schema changes are undesired.

4.4 Routes and components

- Default route `/` -> `Home` (no auth gate)
- `/auth` -> `Auth` component (login/signup) — existing.
- `/phq9` -> `PHQ9` component works for anonymous users.
- `/diary` -> `Diary` component should render local diary UI and CTA for sign-in when unauthenticated.

4.5 PDF generator

- Function: `generatePDF(records: PHQ9Record[], locale: 'en'|'mi'|'zh')`
- When `locale === 'zh'`, use Chinese translations for headings, column names and disclaimer.

## 5. Acceptance Criteria

- **AC-001**: Given an unauthenticated user, When they navigate to `/phq9` and complete the assessment, Then the result screen is shown and contains a message that the result is stored locally and a visible action to `Login` / `Create account`.

- **AC-002**: Given any user visiting the site root `/`, When they have no active session, Then they see the `Home` page (the app does NOT redirect to the login page automatically).

- **AC-003**: Given an unauthenticated user, When viewing the navbar, Then they see a `Login` option; after successful authentication, the navbar shows `Logout` instead.

- **AC-004**: Given the Diary page and an unauthenticated user, When they open the page, Then they can create entries locally and see a CTA with link to `/auth` describing account benefits (persist & sync). The CTA text must be pulled from i18n messages for the active locale.

- **AC-005**: Given `Locale` set to `zh` anywhere in the app, When the UI renders, Then the app uses the Chinese (`zh`) translations for all message keys that exist; missing keys fall back to English.

- **AC-006**: Given an unauthenticated user with local PHQ‑9 or diary data, When they sign in and opt to migrate local data, Then a migration flow runs only after explicit consent and cloud sync is not enabled silently.

- **AC-007**: Unit and E2E tests exist that verify the above behaviors (see Test Automation Strategy) and all tests pass in CI.

## 6. Test Automation Strategy

- Test Levels: Unit, Integration, End-to-End.
- Frameworks:
  - Unit & integration: Jest + React Testing Library (existing project tooling)
  - End-to-end: Playwright (existing)

- Automated Tests to implement:
  - Unit: i18n `getMessages()` returns `zh` and falls back correctly; `Locale` typing updated.
  - Unit: `storage.getLanguage()` / `setLanguage()` handle `zh` value.
  - Integration: `App` renders `Home` when not authenticated; navbar shows `Login`; login flow toggles to `Logout`.
  - Integration: `PHQ9` submit flow for anonymous user shows CTA to login (mock no-supabase session).
  - End-to-end (Playwright): User journey — Home -> PHQ9 -> submit -> result screen shows login CTA -> click login navigates to `/auth`.
  - End-to-end: Diary page unauthenticated creation of a local entry; then sign-in and migrate local data flow (opt-in), verify cloud count increased.

- Test Data Management: Tests should stub Supabase responses (mock client) and isolate localStorage using JSDOM or Playwright contexts with cleared storage per test.

- CI Integration: Add/extend GitHub Actions workflow to run unit tests and Playwright smoke tests on PRs that modify auth/i18n/diary/app router files.

- Coverage Requirements: Maintain existing coverage; add unit tests for i18n and navbar behavior. No strict percentage increase required, but changes touching auth flows must be covered with at least one integration test.

## 7. Rationale & Context

- Lowering the barrier to complete the PHQ‑9 improves accessibility and adoption — requiring immediate sign-in is a well-known conversion barrier.
- Providing a clear CTA for signing in preserves the product value (cross-device history) without forcing commitment.
- Centralising localization via `getMessages(locale)` simplifies adding languages and ensures consistent copy across UI and PDF exports.

## 8. Dependencies & External Integrations

### External Systems
- **EXT-001**: Supabase - used for authentication and cloud sync of PHQ‑9 and diary records. The client already exists in `src/lib/supabase`.

### Third-Party Services
- **SVC-001**: jsPDF (client-side PDF export) - ensure `locale` strings are included for `zh`.

### Infrastructure Dependencies
- **INF-001**: Hosting / CDN for static assets - no change required.

### Data Dependencies
- **DAT-001**: PHQ‑9 question validation sources (phqscreeners.com) — translations should be validated by clinical/localization reviewers.

### Technology Platform Dependencies
- **PLT-001**: Browser localStorage availability. The app must gracefully handle browsers with disabled or quota-limited localStorage.

### Compliance Dependencies
- **COM-001**: Privacy & consent (local storage vs cloud): consent text must clearly explain where data is stored and how to delete it; updates must be reviewed by privacy lead.

## 9. Examples & Edge Cases

Example: Anonymous PHQ‑9 flow

1. User visits `/phq9` (no session). They complete the questionnaire and submit.
2. App saves a PHQ9Record to `localStorage` with `origin: 'local'` and `locale` equal to currently selected locale.
3. The result page displays score, severity (translated) and a message: "You can keep track of score changes by creating an account" (localized). A button "Login / Create account" links to `/auth`.

Edge cases:

- E1: Browser has localStorage blocked — show an inline notice that the app cannot save local history and suggest enabling storage or creating an account.
- E2: User completes PHQ‑9 offline, later signs in on another device — migration requires explicit opt-in; if user does not opt in, local data remains only on original device.
- E3: Duplicate records: when migrating, deduplicate by `createdAt` and optionally `answers` checksum to avoid duplicate inserts.
- E4: Partial translations: if a `zh` key is missing, the UI must fall back to English (via `getMessages` behavior).
- E5: Tests that asserted forced-auth redirects must be updated to reflect the new default home route.

## 10. Validation Criteria

- V-001: Static type check passes (npx tsc) with `Locale` updated to include `zh` and any changed signatures.
- V-002: Unit tests for i18n, storage language handling, and App navbar behavior pass.
- V-003: Playwright end-to-end smoke tests for anonymous PHQ‑9 flow and diary CTA pass.
- V-004: Manual validation: load the app unauthenticated and confirm Home is default, PHQ‑9 works, result CTA to login is displayed, and diary allows local entries with CTA.

## 11. Related Specifications / Further Reading

- Source: `src/i18n/messages.ts` (i18n messages contract and central message file)
- Source: `src/App.tsx` (routing, navbar, auth flow)
- Source: `src/pages/Diary.tsx`, `src/pages/DiaryView.tsx`, `src/pages/AllDiaries.tsx` (diary UX and Supabase interactions)
- Source: `src/utils/storage.ts` (local storage keys and contract)
- Source: `src/utils/pdf.ts` (PDF export — needs `zh` support)

---

For implementation, follow the incremental rollout plan in the Rationale section and create small, testable PRs that update i18n first, then app routing, then diary UX and migration flows. Ensure all copy, especially PHQ‑9 and crisis text, are reviewed by clinical/localization experts before release to production.

---
title: Aroha — PHQ-9 Screening & Micro-Mindfulness Mobile MVP
version: 1.0
date_created: 2025-11-01
last_updated: 2025-11-01
owner: Lesley Gao
tags: [design, mvp, mental-health, phq-9, localization]
---

# Introduction

This specification defines a focused, privacy-first mobile/web MVP called "Aroha" that pairs PHQ-9 screening and score tracking with short guided mindfulness exercises. The MVP targets young people in New Zealand and supports multilingual delivery (English and te reo Māori at launch). The goal is to validate core flows: localized PHQ-9 completion, local storage of scores, a small library of guided audio, PDF export of recent scores (clinician summary), and basic escalation guidance when scores exceed configured thresholds.

## 1. Purpose & Scope

Purpose
- Provide a concise, testable specification for an MVP delivering PHQ-9 screening + micro-mindfulness, suitable for a single afternoon-to-days build and subsequent extension.

Scope
- Build a client-only prototype (React + Vite) that runs in the browser and on mobile as a PWA.
- Local-first storage (localStorage/localForage). No backend or authentication for the MVP.
- Include English and te reo Māori localized strings for the PHQ-9 and key UI.
- Provide PDF export of saved PHQ-9 records for clinician sharing (user-initiated).
- Provide simple escalation guidance and nudges based on score thresholds.

Audience
- Product owner, frontend developer(s), designer, and an early reviewer (clinical advisor or cultural reviewer).

Assumptions
- PHQ-9 translations used are from reputable sources; cultural review for te reo Māori will be arranged before production release.
- The MVP will use placeholder audio (CC0/placeholder) and later replace with culturally adapted recordings.

## 2. Definitions

- PHQ-9: Patient Health Questionnaire 9 — a validated 9-item self-report depression screening tool. Score range: 0–27.
- MVP: Minimum Viable Product — the smallest useful product to validate core assumptions.
- Local-first: Data is stored on the device by default; cloud sync is opt-in and out of scope for MVP.
- Escalation: User-facing guidance recommending professional help or emergency action when high-risk scores are observed.

## 3. Requirements, Constraints & Guidelines

- **REQ-001**: The app SHALL present the PHQ-9 in the user's selected language (English or te reo Māori).
- **REQ-002**: The app SHALL compute a PHQ-9 total score as the sum of the 9 item responses (each 0..3) and persist the record locally with timestamp and locale.
- **REQ-003**: The app SHALL store PHQ-9 records locally using localStorage/localForage and display a chronological history view.
- **REQ-004**: The app SHALL provide a mini-library of guided mindfulness audio (<= 20 minutes) and play/download items from `public/`.
- **REQ-005**: The app SHALL show nudges (daily practice suggestion) when most recent PHQ-9 score >= 10.
- **REQ-006**: The app SHALL show an escalation banner (recommendation to seek professional help and NZ crisis resources) when most recent PHQ-9 score >= 15.
- **REQ-007**: The app SHALL provide a user-initiated export to PDF of the user's saved PHQ-9 history (jsPDF acceptable for MVP).
- **REQ-008**: The app SHALL include a prominent disclaimer that PHQ-9 is a screening tool and not a diagnosis, and shall surface NZ crisis numbers on high-risk screens.
- **REQ-009**: The app SHALL support switching the displayed language in Settings and persist the choice locally.
- **SEC-001**: The app SHALL default to local-only storage and require explicit opt-in before uploading any PHQ-9 data to cloud storage.
- **SEC-002**: The app SHALL encrypt any sensitive data that will be exported to the server or included in production storage (out of scope for MVP but required for production).
- **CON-001**: No automated contacting of third-party clinicians or emergency contacts without explicit, user-initiated action.
- **GUD-001**: Keep interactions short and accessible: default micro-exercise length <= 20 minutes, use large tappable controls, and provide captions for audio where possible.

--

Additional governance & required controls (added after review):

- **REQ-010 (Consent & Data Use)**: The app MUST present an explicit consent screen on first run explaining what data is stored locally, what data may be exported (PDF), and require explicit affirmative consent before enabling any export or cloud sync features. The consent selection MUST be persisted and revocable via Settings.
- **REQ-011 (Data Deletion / Portability)**: The app MUST provide a clear "Delete my data" action in Settings that removes all local PHQ‑9 records and any locally stored profile data. The app MUST also provide a "Export my data" action (CSV/JSON) for portability in addition to PDF export.
- **REQ-012 (Thresholds)**: The app SHALL use the following numeric thresholds for the MVP unless locally configured by clinicians: nudge threshold = total >= 10 (Moderate), escalation threshold = total >= 15 (Moderately severe). These numeric values MUST appear in the UI rationale/help text.
- **REQ-013 (Translation Attribution & Licensing)**: Any PHQ‑9 translations used in the app MUST include attribution and a link to the source (for example, `phqscreeners.com`) and comply with the translator's licensing terms before public distribution.
- **REQ-014 (Cultural Review)**: Any te reo Māori translations and mindfulness content MUST be culturally reviewed by an appropriate Māori health advisor or cultural liaison before production use.

--

Emergency contacts & NZ crisis resources (display rules):

- Display `111` (emergency) for immediate danger prominently when escalation is triggered.
- Display Lifeline NZ `0800 543 354` and Healthline `0800 611 116` as primary non-emergency resources.
- Include direct links to `https://mentalhealth.org.nz/` and local DHB mental health pages in the resources screen.


## 4. Interfaces & Data Contracts

All interfaces are internal for the MVP (client-side), but define JSON data shapes for records and exports. Implementations SHOULD follow these shapes when storing or exporting data.

Data schemas (example JSON Schema-like descriptions):

User (client-side profile)

```json
{
  "id": "string (uuid or local id)",
  "language": "en|mi",
  "consent": {
    "analytics": false,
    "export_pdf": true
  },
  "emergency_contact": {
    "name": "string",
    "phone": "string"
  }
}
```

PHQ9Record

```json
{
  "id": "string",
  "answers": [0,1,2,3,0,1,0,2,0],
  "total": 9,
  "severity": "Minimal|Mild|Moderate|Moderately severe|Severe",
  "locale": "en|mi",
  "createdAt": "ISO-8601 timestamp"
}
```

ContentItem

```json
{
  "id": "string",
  "title": "string",
  "language": "en|mi|...",
  "type": "audio|video|text",
  "durationSeconds": 300,
  "storageRef": "public/sample-meditation.mp3",
  "downloadable": true,
  "tags": ["grounding","breathing"]
}
```

ClinicianExport (PDF metadata)

```json
{
  "userId": "string (nullable for anonymous)",
  "exportedAt": "ISO-8601",
  "recordsIncluded": ["PHQ9Record.id", ...],
  "consent": true
}
```

## 5. Acceptance Criteria

- **AC-001**: Given a user completes all 9 PHQ-9 items and submits, When the user presses Submit, Then the UI shows the total score equal to the numeric sum of answers and a severity label.
- **AC-002**: Given a PHQ-9 submission, When the form is submitted, Then a PHQ9Record is persisted to localStorage and appears in the History list with a timestamp.
- **AC-003**: Given the most recent saved PHQ-9 score >= 10, When the user views Home or Score screens, Then a supportive nudge suggesting daily micro-practice displays.
- **AC-004**: Given the most recent saved PHQ-9 score >= 15, When the user views Home or Score screens, Then an escalation banner with NZ crisis resources and a recommendation to seek help displays.
- **AC-005**: Given stored PHQ-9 records, When the user selects Export → PDF, Then a PDF containing recent scores and timestamps downloads to the device.
- **AC-006**: Given a user changes language in Settings, When language is changed, Then PHQ-9 question texts and the UI reflect the selected language immediately.

## 6. Test Automation Strategy

- Test Levels: Unit, Integration, End-to-End.
- Unit tests: Jest + React Testing Library for components (PHQ-9 scoring logic, storage utils, PDF helper). Cover scoring and threshold logic.
- Integration tests: Verify storage and UI flows (submit → stored → history appears). Use React Testing Library and mocking for localStorage/localForage.
- E2E tests: Playwright or Cypress for full flows (language switch, submit PHQ-9, audio playback, PDF export trigger, escalation display).
- Test Data Management: Use deterministic fixtures for PHQ-9 answers; ensure cleanup of localStorage between tests.
- CI: Run tests in GitHub Actions on each PR. Minimal coverage requirement: 60% for MVP code paths.

## 7. Rationale & Context

- PHQ-9 is chosen because it is short, validated in many languages, and already used by local NZ initiatives. This lowers friction for users and supports multi-language screening.
- Local-first storage preserves privacy and reduces early implementation complexity while enabling meaningful user feedback and testing.
- Guided mindfulness content provides immediate, low-risk interventions the user can self-initiate, which is aligned with evidence-based behavioral activation strategies.

## 8. Dependencies & External Integrations

### External Systems
- **EXT-001**: PHQ-9 translation resources (phqscreeners.com or official sources) — use for localized question text and attribute source per license.

### Third-Party Services
- **SVC-001**: jsPDF — client-side PDF generation for exports in the MVP.
- **SVC-002**: i18next/react-i18next — localization support.

### Infrastructure Dependencies
- **INF-001**: For production: Supabase or Firebase for auth, secure storage, and server-side PDF generation. (Not used in MVP.)

### Data Dependencies
- **DAT-001**: Placeholder audio files (public domain or CC0) for early testing; later, culturally adapted recordings are required.

### Platform Dependencies
- **PLT-001**: Web runtime (modern browsers) and PWA-capable devices. React + Vite for development; React Native/Expo for future mobile builds.

### UI Libraries (optional)
- **UI-001**: Tailwind CSS — recommended for rapid, consistent styling and to support `shadcn-ui` components. Add Tailwind directives to `src/index.css` and configure `tailwind.config.cjs` with content globs for `./index.html` and `./src/**/*.{ts,tsx}`.
- **UI-002**: shadcn-ui (Radix + Tailwind) — recommended if you want a polished, accessible design system for production. Note: shadcn-ui is web-focused and not directly portable to React Native. Use for web/PWA builds; for mobile use consider a separate native component library.

Note: Adding Tailwind + shadcn improves visual polish and accessibility out of the box but requires additional setup (approx 1–3 hours) and build configuration. For the MVP demo this afternoon, Tailwind + shadcn is optional — Tailwind-only is a lighter lift.

### Compliance Dependencies
- **COM-001**: Must follow NZ health privacy guidelines; when storing or sharing identifiable PHQ-9 data on servers, ensure encryption and appropriate legal review.

## 9. Examples & Edge Cases

Example PHQ-9 submission JSON

```json
{
  "id": "1634567890123",
  "answers": [1,2,0,1,0,1,0,0,0],
  "total": 5,
  "severity": "Mild",
  "locale": "en",
  "createdAt": "2025-11-01T10:15:30Z"
}
```

Edge cases
- Offline submission: allow storing records offline and sync later if cloud sync is implemented.
- Partial answers: block submission until all 9 items are answered and surface localized validation message.
- Permission denial for audio/downloads: gracefully degrade to in-app streaming only.
- Language fallback: if a content item is not available in the selected language, show localized UI but play the available audio and label it "(original language)".

## 10. Validation Criteria

- Functionality: All acceptance criteria (Section 5) pass manual testing and automated tests.
- Localization: English and te reo Māori message bundles fully present for PHQ-9 and top-level UI.
- Privacy & Security: No PHI leaves the device in the MVP; any PDF export is user-initiated and not transmitted to servers.
- Accessibility: App is operable with screen readers and supports large text.

## 11. Related Specifications / Further Reading

- PHQ-9 original publication: Kroenke et al., 2001.
- NZ mental health resources: https://mentalhealth.org.nz/
- PHQ-9 translators repository: https://www.phqscreeners.com/

---
End of specification.

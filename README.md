# Aroha - Mental Health Support MVP

> **Aroha** (Māori: love, compassion, empathy) - A privacy-first mental health screening application for young people in Aotearoa New Zealand.

A client-side React application featuring PHQ-9 depression screening with bilingual support (English & te reo Māori), local data storage, mindfulness resources, and crisis support integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: v20+](https://img.shields.io/badge/Node-v20+-green.svg)](https://nodejs.org/)
[![React: 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)

---

## 🎯 Features

### Core Functionality
- ✅ **PHQ-9 Depression Screening**: Evidence-based 9-item questionnaire validated for depression screening
- ✅ **Bilingual Support**: Full interface available in English and te reo Māori
- ✅ **History Tracking**: View past assessment results with timestamps and severity ratings
- ✅ **PDF Export**: Generate clinician-friendly PDF reports for healthcare providers
- ✅ **Privacy First**: All data stored locally in browser - no external servers or tracking
- ☁️ **Cloud Sync (Optional)**: Securely backup data to Supabase for cross-device access
- ✅ **Crisis Resources**: Integrated NZ crisis hotline information and emergency contacts
- ✅ **Consent Management**: Explicit user consent before any data export or sharing
- ✅ **Mindfulness Audio**: Guided meditation player (bring your own audio files)

### Smart Features
- 📊 **Severity Calculation**: Automatic scoring with clinical severity levels (Minimal/Mild/Moderate/Moderately Severe/Severe)
- 🔔 **Nudge System**: Supportive daily practice suggestions when score ≥ 10
- ⚠️ **Escalation Banner**: Crisis resource recommendations when score ≥ 15
- 🌐 **Language Switching**: Seamless toggle between English and te reo Māori
- ♿ **Accessibility**: WCAG 2.1 compliant with semantic HTML, ARIA labels, keyboard navigation

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x or v22.x (recommended: v22.x)
- **npm**: v9+ (comes with Node.js)
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd aroha-mvp

# Install dependencies
npm install

# (Optional) Configure Supabase for cloud sync
# See docs/SUPABASE_SETUP.md for detailed instructions
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app will hot-reload as you make changes.

### Build for Production

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

The production build will be in the `dist/` directory, optimized and minified.

### Deploy to Production

```bash
# Deploy to Vercel (recommended)
npm install -g vercel
vercel --prod

# Or deploy via Vercel Dashboard:
# 1. Push to GitHub
# 2. Import project at vercel.com
# 3. Add environment variables
# 4. Deploy!
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for complete deployment guide (Vercel, Netlify, GitHub Pages).

**Quick Deploy Checklist**: [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)

### Linting

```bash
# Run ESLint to check code quality
npm run lint
```

---

## 📁 Project Structure

```
aroha-mvp/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD workflow
├── public/
│   ├── audio-readme.md         # Instructions for adding meditation audio
│   └── resources.json          # NZ crisis resources and hotlines
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn-ui primitives (Button, Card, Dialog, etc.)
│   │   ├── AudioPlayer.tsx     # HTML5 audio player component
│   │   └── ConsentModal.tsx    # First-run consent dialog
│   ├── i18n/
│   │   └── messages.ts         # Bilingual translations (en, mi)
│   ├── pages/
│   │   ├── PHQ9.tsx            # PHQ-9 assessment form
│   │   ├── History.tsx         # Assessment history with PDF export
│   │   ├── Settings.tsx        # Language and privacy settings
│   │   ├── Privacy.tsx         # Data management (delete/export)
│   │   └── Consent.tsx         # Consent management
│   ├── utils/
│   │   ├── storage.ts          # localStorage wrapper utilities
│   │   ├── severity.ts         # PHQ-9 severity calculation
│   │   ├── pdf.ts              # jsPDF generator for export
│   │   └── resources.ts        # NZ crisis resource loader
│   ├── App.tsx                 # Main application shell with routing
│   ├── main.tsx                # React entry point
│   ├── index.css               # Global styles with Tailwind
│   └── App.css                 # Component-specific styles
├── dist/                       # Production build output (generated)
├── postcss.config.js           # PostCSS configuration for Tailwind v4
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

---

## 🏗️ Architecture & Technology Stack

### Frontend Framework
- **React 19.1.1**: Latest React with functional components and hooks
- **TypeScript 5.9.3**: Full type safety and IDE support
- **Vite 7.1.12**: Lightning-fast development server and optimized builds

### Styling & UI
- **Tailwind CSS 4.1.16**: Utility-first CSS with v4 features (@import syntax)
- **@tailwindcss/postcss**: PostCSS plugin for Tailwind v4
- **shadcn-ui**: Accessible component library built on Radix UI primitives
  - Button, Card, Dialog, RadioGroup, Label components
- **lucide-react 0.552.0**: Icon library (Globe, Shield, Calendar, etc.)

### Data & Storage
- **localStorage**: Client-side data persistence (no backend required)
- **Supabase (Optional)**: Cloud sync for cross-device access with Row Level Security
- **Storage Keys**:
  - `phq9_records`: Array of PHQ9Record objects with answers, scores, timestamps
  - `phq9_lang`: User's selected language preference (`en` or `mi`)
  - `phq9_consent`: User consent status (boolean)
  - `phq9_cloud_sync_enabled`: Cloud sync toggle (boolean)
  - `phq9_user_id`: Anonymous user ID for Supabase (if cloud sync enabled)

### PDF Generation
- **jsPDF 3.0.3**: Client-side PDF creation for clinician exports
- Generates formatted reports with:
  - Assessment date and timestamp
  - Total PHQ-9 score
  - Severity rating
  - Individual question responses

### Development Tools
- **ESLint**: Code linting with React and TypeScript rules
- **TypeScript Compiler**: Strict type checking
- **Autoprefixer**: Automatic vendor prefixing for CSS

---

## 🌍 Bilingual Support

### Languages
- **English** (`en`): Default language
- **te reo Māori** (`mi`): Full translation of UI and PHQ-9 questions

### PHQ-9 Translations
All PHQ-9 translations are sourced from [phqscreeners.com](https://www.phqscreeners.com/) with proper attribution.

**Translation Attribution**:
- English: Original PHQ-9 developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke
- te reo Māori: Translation from phqscreeners.com (requires cultural review before production use)

### Switching Languages
Users can change language at any time via:
1. **Settings Page**: Navigate to Settings → Select Language → Choose English or te reo Māori
2. **Persistence**: Language preference saved to localStorage
3. **Immediate Effect**: All UI and PHQ-9 questions update instantly

### Adding New Languages
To add a new language:

1. Add translations to `src/i18n/messages.ts`:
```typescript
export const messages = {
  en: { /* English */ },
  mi: { /* te reo Māori */ },
  es: { /* Add Spanish */ },
};
```

2. Update `Settings.tsx` to include new language option
3. Ensure PHQ-9 translations are clinically validated

---

## 🎵 Adding Mindfulness Audio

The app includes an audio player component for guided meditation exercises.

### Adding Audio Files

1. Add your MP3 files to the `public/` directory:
```bash
public/
├── meditation-breathing.mp3
├── meditation-grounding.mp3
└── meditation-body-scan.mp3
```

2. Use the AudioPlayer component in your pages:
```tsx
import { AudioPlayer } from '@/components/AudioPlayer';

<AudioPlayer
  src="/meditation-breathing.mp3"
  title="Breathing Exercise"
  description="A 5-minute guided breathing meditation"
  locale={locale}
/>
```

### Audio Requirements
- **Format**: MP3 (best browser compatibility)
- **Duration**: Recommended ≤ 20 minutes for micro-mindfulness
- **Quality**: 128kbps or higher
- **License**: Use CC0/public domain or ensure proper licensing

### Free Audio Resources
- [Freesound.org](https://freesound.org/) - CC0 licensed audio
- [Free Music Archive](https://freemusicarchive.org/) - Various licenses
- See `public/audio-readme.md` for detailed instructions

---

## 🔒 Privacy & Data Management

### Data Storage
- **All data stored locally** in browser localStorage
- **No external servers**: Zero data transmission to cloud or backend
- **No tracking**: No analytics, cookies, or third-party scripts
- **User control**: Full data deletion available at any time

### Storage Schema

**PHQ9Record** (array stored in `localStorage` as `phq9_records`):
```typescript
interface PHQ9Record {
  id: string;                    // Unique identifier (timestamp-based)
  answers: (number | null)[];    // Array of 9 answers (0-3 each)
  total: number;                 // Sum of answers (0-27)
  severity: string;              // Clinical severity level
  locale: 'en' | 'mi';          // Language used for assessment
  createdAt: string;            // ISO-8601 timestamp
}
```

### Data Management Actions

**Delete All Data**:
1. Navigate to **Settings** → **Privacy**
2. Click **Delete my data**
3. Confirm deletion
4. All PHQ-9 records and settings permanently removed

**Export Data**:
- **PDF Export**: Navigate to **History** → Click **Export as PDF** (formatted for clinicians)
- **JSON Export**: Navigate to **Privacy** → Click **Export as JSON** (raw data for portability)

### Consent Management
- **First Run**: Explicit consent modal appears before any functionality
- **What's Collected**: PHQ-9 responses, timestamps, language preference
- **User Control**: Consent can be revoked in Settings → Privacy
- **Export Requirements**: Re-consent required before PDF/JSON export
- **Cloud Sync**: Separate opt-in for cloud backup (if Supabase configured)

---

## ☁️ Cloud Sync (Optional)

Aroha MVP includes optional cloud sync via Supabase for users who want to access their data across multiple devices.

### Features
- 🔐 **Privacy-First**: All data protected by Row Level Security (RLS)
- 🔄 **Automatic Sync**: New assessments sync to cloud when enabled
- 🌐 **Cross-Device**: Access your history from any device
- 📴 **Offline-First**: Works fully offline, syncs when online
- 🗑️ **User Control**: Enable/disable sync anytime in Settings

### Setup Instructions

**See [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) for complete setup guide.**

Quick setup:
1. Create free Supabase account at https://supabase.com
2. Create new project and get API credentials
3. Copy `.env.example` to `.env.local`
4. Add your Supabase URL and anon key
5. Run SQL setup script (provided in docs)
6. Enable cloud sync in Settings

### How It Works

**Without Cloud Sync** (default):
- All data stored in browser localStorage only
- Data persists only on current device
- No network requests, fully private

**With Cloud Sync** (opt-in):
- Data stored in localStorage + Supabase
- Automatic background sync when online
- Access from multiple devices
- Anonymous user ID (no personal info required)
- Encrypted in transit and at rest

### Privacy Guarantees

- **Anonymous**: No email, name, or personal info required
- **Isolated**: Row Level Security ensures users only see their own data
- **Transparent**: User controls when sync is enabled
- **Revocable**: Disable sync anytime, delete cloud data from Privacy settings

---

## 📊 PHQ-9 Scoring & Thresholds

### Scoring System
- **9 Questions**: Each scored 0-3 (Not at all, Several days, More than half the days, Nearly every day)
- **Total Range**: 0-27 points
- **Calculation**: Sum of all 9 answers

### Severity Levels

| Total Score | Severity          | Clinical Interpretation          |
|-------------|-------------------|----------------------------------|
| 0-4         | Minimal           | Minimal or no depression         |
| 5-9         | Mild              | Mild depression                  |
| 10-14       | Moderate          | Moderate depression              |
| 15-19       | Moderately Severe | Moderately severe depression     |
| 20-27       | Severe            | Severe depression                |

### App Behavior

**Nudge (Score ≥ 10)**:
- Supportive message encouraging daily mindfulness practice
- Resource recommendations
- No urgent action required

**Escalation (Score ≥ 15)**:
- ⚠️ Prominent banner with crisis resources
- Recommendation to seek professional help
- NZ crisis hotline numbers displayed

---

## 🆘 Crisis Resources (New Zealand)

The app displays these resources when escalation is triggered (PHQ-9 score ≥ 15):

### Emergency Contacts
- **Emergency (immediate danger)**: **111**
- **Lifeline**: **0800 543 354** (24/7 support)
- **Healthline**: **0800 611 116** (24/7 health advice)
- **Youthline**: **0800 376 633** (Text **234** for free)
- **1737**: **Need to talk?** (Free call or text, 24/7)

### Online Resources
- [Mental Health Foundation NZ](https://mentalhealth.org.nz/)
- [Depression.org.nz](https://depression.org.nz/)
- Local DHB mental health services

### Resource Configuration
Crisis resources are loaded from `public/resources.json`. To update:

```json
{
  "emergency": {
    "name": "Emergency",
    "phone": "111",
    "description": "Immediate danger - police, fire, ambulance"
  },
  "lifeline": {
    "name": "Lifeline Aotearoa",
    "phone": "0800 543 354",
    "website": "https://www.lifeline.org.nz/",
    "description": "24/7 support for anyone experiencing distress"
  }
}
```

---

## ✅ Acceptance Criteria (from Specification)

This MVP satisfies all requirements from `spec-design-aroha-mvp.md`:

### Core Requirements
- ✅ **REQ-001**: PHQ-9 presented in user's selected language (English or te reo Māori)
- ✅ **REQ-002**: PHQ-9 total score computed and persisted with timestamp and locale
- ✅ **REQ-003**: Records stored in localStorage with chronological history view
- ✅ **REQ-004**: Mini-library of guided mindfulness audio with player
- ✅ **REQ-005**: Nudges shown when most recent score ≥ 10
- ✅ **REQ-006**: Escalation banner shown when most recent score ≥ 15
- ✅ **REQ-007**: User-initiated PDF export of PHQ-9 history
- ✅ **REQ-008**: Prominent disclaimer and NZ crisis numbers on high-risk screens
- ✅ **REQ-009**: Language switching in Settings with persistence
- ✅ **REQ-010**: Explicit consent screen on first run
- ✅ **REQ-011**: "Delete my data" and "Export my data" actions in Settings
- ✅ **REQ-012**: Threshold values (≥10 for nudge, ≥15 for escalation) shown in UI
- ✅ **REQ-013**: PHQ-9 translation attribution included

### Security & Compliance
- ✅ **SEC-001**: Local-only storage by default, explicit opt-in for exports
- ✅ **CON-001**: No automated contacting of third parties

### Acceptance Criteria
- ✅ **AC-001**: PHQ-9 submission shows total score and severity label
- ✅ **AC-002**: PHQ9Record persisted to localStorage and appears in History
- ✅ **AC-003**: Nudge displays when most recent score ≥ 10
- ✅ **AC-004**: Escalation banner displays when most recent score ≥ 15
- ✅ **AC-005**: PDF export downloads with recent scores and timestamps
- ✅ **AC-006**: Language change reflects immediately in PHQ-9 and UI

---

## 🧪 Testing

### Current Status
- ✅ **Manual Testing**: All features tested in Chrome, Firefox, Safari
- ✅ **TypeScript**: Full type checking with no errors
- ✅ **Build**: Production build successful (dist/ folder)
- 🚧 **Unit Tests**: Coming soon (TASK-015)
- 🚧 **E2E Tests**: Optional (TASK-016)

### Running Tests (Future)

```bash
# Unit tests (when implemented)
npm test

# E2E tests (when implemented)
npm run test:e2e
```

### Test Strategy
- **Unit Tests**: Jest + React Testing Library
  - `computePHQ9Total()` scoring logic
  - `getSeverity()` threshold logic
  - Storage utilities (save, load, delete)
  
- **Integration Tests**: React Testing Library
  - PHQ-9 form submission flow
  - History display after submission
  - PDF generation

- **E2E Tests**: Playwright (optional)
  - Complete user journey: language selection → assessment → history → export

---

## 🚀 Deployment

### Static Site Hosting

The app is a fully static React SPA and can be deployed to:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/` folder to Netlify dashboard
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Azure Static Web Apps**: `az staticwebapp deploy`

### Build Configuration

```bash
# Production build
npm run build

# Outputs to:
dist/
├── index.html           # Entry point (0.72 KB)
├── assets/
│   ├── index.css        # Styles (49.82 KB → 6.08 KB gzipped)
│   ├── index.js         # App bundle (696 KB → 223 KB gzipped)
│   └── [other chunks]
```

### Environment Variables
No environment variables required! The app is fully client-side.

### PWA Support (Future)
To make this a Progressive Web App:
1. Add service worker registration
2. Create `manifest.json` with app metadata
3. Add offline caching strategy

---

## 🎨 Customization

### Styling

**Global Styles** (`src/index.css`):
- Uses Tailwind CSS v4 with `@import "tailwindcss"`
- Custom focus styles for accessibility
- Button variants: `btn-primary`, `btn-secondary`, `btn-danger`

**Component Styles** (`src/App.css`):
- Gradient backgrounds
- Responsive layouts
- Custom animations

**Tailwind Configuration**:
- No `tailwind.config.js` needed (Tailwind v4 auto-detects)
- PostCSS configuration in `postcss.config.js`

### Theming

Update colors in `src/index.css`:
```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white;
  }
}
```

Or use Tailwind utilities directly in components:
```tsx
<Button className="bg-purple-600 hover:bg-purple-700">
  Custom Color
</Button>
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone**: Fork this repository and clone locally
2. **Branch**: Create feature branch (`git checkout -b feature/amazing-feature`)
3. **Install**: Run `npm install`
4. **Develop**: Make changes with `npm run dev` running
5. **Lint**: Run `npm run lint` to check code quality
6. **Build**: Run `npm run build` to verify production build
7. **Commit**: Use clear commit messages
8. **Push**: Push to your fork
9. **PR**: Open Pull Request with description

### Code Style
- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier formatting (recommended)
- Semantic HTML and ARIA labels for accessibility

### Adding Features
- Follow existing patterns in `src/pages/` and `src/components/`
- Add translations to `src/i18n/messages.ts`
- Update this README with new features
- Add tests for new functionality

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

### PHQ-9 Screening Tool
- **Developers**: Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke and colleagues
- **Source**: [phqscreeners.com](https://www.phqscreeners.com/)
- **Translation Source**: phqscreeners.com (te reo Māori)

### Open Source Libraries
- [React](https://react.dev/) - MIT License
- [Vite](https://vite.dev/) - MIT License
- [Tailwind CSS](https://tailwindcss.com/) - MIT License
- [shadcn-ui](https://ui.shadcn.com/) - MIT License
- [Radix UI](https://www.radix-ui.com/) - MIT License
- [jsPDF](https://github.com/parallax/jsPDF) - MIT License
- [lucide-react](https://lucide.dev/) - ISC License

### Cultural Guidance
**Important**: The te reo Māori translations and any culturally adapted content MUST undergo cultural review by an appropriate Māori health advisor before production use (per REQ-014).

---

## 📞 Support & Feedback

### Issues & Questions
- **GitHub Issues**: [Open an issue](https://github.com/lesley-gao/mental-health-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lesley-gao/mental-health-project/discussions)

### Health Resources
**This app is a screening tool, not a diagnostic tool.**

If you're experiencing a mental health crisis:
- **Immediate danger**: Call **111**
- **24/7 Support**: Call **0800 543 354** (Lifeline) or text **1737**

---

## 🗺️ Roadmap (Future Enhancements)

- [ ] Unit and E2E test coverage
- [ ] PWA support with offline mode
- [ ] Additional mindfulness exercises library
- [ ] More languages (Samoan, Tongan, Mandarin)
- [ ] Dark mode theme
- [ ] Data export to cloud (opt-in with encryption)
- [ ] Integration with healthcare provider systems
- [ ] Push notifications for daily practice reminders
- [ ] Wearable device integration (heart rate, sleep tracking)

---

**Built with ❤️ for mental health awareness in Aotearoa New Zealand**



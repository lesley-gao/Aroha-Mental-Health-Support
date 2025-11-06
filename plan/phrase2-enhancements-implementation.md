---
goal: Implement Phase 2 Enhancements for Aroha MVP - Diary Preview, Speech-to-Text, and PHQ-9 History Visualization
version: 1.0
date_created: 2025-11-06
last_updated: 2025-11-06
owner: Lesley Gao
tags: [feature, enhancement, diary, speech-recognition, data-visualization, phq-9]
---

# Introduction

This implementation plan provides a step-by-step guide to building three major enhancements for the Aroha MVP application as defined in the Phase 2 Enhancements specification. The plan is structured in three phases that can be executed sequentially, with each phase delivering a complete, testable feature. The implementation follows the specifications in `spec/Aroha-MVP-phase2-Enhancements.md` and builds upon the existing Aroha MVP codebase.

## 1. Requirements & Constraints

### Functional Requirements
- **REQ-001**: Implement diary entry preview page at route `/diary/view/:date` with read-only display
- **REQ-002**: Implement speech-to-text functionality using Web Speech API for English language (en-NZ)
- **REQ-003**: Implement PHQ-9 score visualization using Recharts library with severity color coding
- **REQ-004**: All features must support bilingual UI (English and Te Reo Māori)
- **REQ-005**: All features must be responsive and work on mobile devices
- **REQ-006**: Maintain existing Supabase RLS policies for data security

### Security Requirements
- **SEC-001**: Speech recognition must process audio entirely client-side (no external API calls)
- **SEC-002**: All diary entries and PHQ-9 records must be protected by Supabase RLS policies
- **SEC-003**: No voice audio data shall be stored or transmitted; only transcribed text

### Technical Constraints
- **CON-001**: Speech recognition limited to English (en-NZ) for MVP; Te Reo Māori support deferred
- **CON-002**: Must use Web Speech API (browser-dependent availability)
- **CON-003**: Charts require minimum 2 data points for meaningful trend visualization
- **CON-004**: Must maintain compatibility with existing React 18+ codebase
- **CON-005**: Must work with existing Supabase database schema

### Guidelines
- **GUD-001**: Follow existing Aroha design patterns and UI component structure
- **GUD-002**: Provide clear user feedback for all actions (loading states, errors, success messages)
- **GUD-003**: Ensure graceful degradation when features are unavailable (e.g., unsupported browsers)
- **GUD-004**: Write unit tests for critical logic and E2E tests for user flows

### Patterns to Follow
- **PAT-001**: Use existing shadcn/ui components for consistent UI
- **PAT-002**: Follow React Router v6 patterns for navigation
- **PAT-003**: Use TypeScript for type safety across all new code
- **PAT-004**: Follow existing Supabase query patterns for data fetching

## 2. Implementation Steps

### Implementation Phase 1: PHQ-9 History Visualization (Priority: High, Effort: 2-3 hours)

**GOAL-001**: Add interactive chart visualization to the History page showing PHQ-9 score trends over time with severity color coding and summary statistics.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Install Recharts dependency: `npm install recharts` | ✅ | 2025-11-06 |
| TASK-002 | Create chart data transformation utility function in `src/utils/chartUtils.ts` to convert PHQ9Records to ChartDataPoint format | ✅ | 2025-11-06 |
| TASK-003 | Create `src/components/charts/PHQ9LineChart.tsx` component with Recharts LineChart implementation | ✅ | 2025-11-06 |
| TASK-004 | Implement severity color mapping function: 0-4 green, 5-9 yellow, 10-14 orange, 15-19 red, 20-27 dark red | ✅ | 2025-11-06 |
| TASK-005 | Add reference line at score=10 (moderate threshold) to the chart | ✅ | 2025-11-06 |
| TASK-006 | Implement responsive chart with proper mobile scaling | ✅ | 2025-11-06 |
| TASK-007 | Add custom tooltip component showing date, score, and severity on hover/tap | ✅ | 2025-11-06 |
| TASK-008 | Create `src/components/charts/ScoreSummary.tsx` component for statistics cards (total assessments, average, trend) | ✅ | 2025-11-06 |
| TASK-009 | Implement trend calculation logic (improving/declining/stable) based on recent vs older averages | ✅ | 2025-11-06 |
| TASK-010 | Update `src/pages/History.tsx` to import and render PHQ9LineChart and ScoreSummary components | ✅ | 2025-11-06 |
| TASK-011 | Add empty state handling with message "No assessments yet. Complete your first PHQ-9 to see trends." | ✅ | 2025-11-06 |
| TASK-012 | Add bilingual translations for chart labels and messages (English and Te Reo Māori) | ✅ | 2025-11-06 |
| TASK-013 | Test chart rendering with 0, 1, 2, 10, and 50+ data points | ⏳ | Pending user testing |
| TASK-014 | Verify chart responsiveness on mobile devices (iPhone SE, Pixel 5) | ⏳ | Pending user testing |
| TASK-015 | Write unit tests for chart data transformation and severity color mapping | ⏳ | Deferred to testing phase |

### Implementation Phase 2: Speech-to-Text for Diary Entries (Priority: Medium, Effort: 3-4 hours)

**GOAL-002**: Implement voice recording capability for diary entries using Web Speech API with English language support and graceful browser compatibility handling.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-016 | Create `src/components/diary/SpeechToText.tsx` component for speech recognition logic | ✅ | 2025-11-06 |
| TASK-017 | Implement browser compatibility check for Web Speech API (SpeechRecognition / webkitSpeechRecognition) | ✅ | 2025-11-06 |
| TASK-018 | Configure SpeechRecognition with lang='en-NZ', continuous=true, interimResults=true | ✅ | 2025-11-06 |
| TASK-019 | Add microphone icon button from Radix UI icons next to diary textarea in `src/pages/Diary.tsx` | ✅ | 2025-11-06 |
| TASK-020 | Implement start recording function with microphone permission request handling | ✅ | 2025-11-06 |
| TASK-021 | Implement stop recording function and cleanup | ✅ | 2025-11-06 |
| TASK-022 | Add visual recording indicator (pulsing red dot animation) when actively recording | ✅ | 2025-11-06 |
| TASK-023 | Implement real-time transcript display with interim results (grey text) and final results (black text) | ✅ | 2025-11-06 |
| TASK-024 | Add transcript text to diary content textarea, appending to existing content with proper spacing | ✅ | 2025-11-06 |
| TASK-025 | Implement error handling for permission denied, no microphone, network errors | ✅ | 2025-11-06 |
| TASK-026 | Add auto-stop recording after 3 seconds of silence using silence detection | ⏳ | Optional feature - basic implementation complete |
| TASK-027 | Display "Recording (English only)..." message when recording is active | ✅ | 2025-11-06 |
| TASK-028 | Add bilingual UI labels: "Voice recording (English only)" / "Hopu Reo (English anake)" | ✅ | 2025-11-06 |
| TASK-029 | Hide microphone button with explanatory message if Web Speech API is not supported | ✅ | 2025-11-06 |
| TASK-030 | Add keyboard shortcut (Ctrl+Shift+M) to start/stop recording | ⏳ | Optional feature - can be added later |
| TASK-031 | Test speech recognition in Chrome, Edge, and Safari browsers | ⏳ | Pending user testing |
| TASK-032 | Verify graceful degradation in Firefox (no speech support) | ⏳ | Pending user testing |
| TASK-033 | Write unit tests for speech recognition initialization and error handling (with mocked API) | ⏳ | Deferred to testing phase |
| TASK-034 | Manual test recording with background noise and verify transcription quality | ⏳ | Pending user testing |

### Implementation Phase 3: Diary Entry Preview & Navigation (Priority: Medium, Effort: 2-3 hours)

**GOAL-003**: Create a dedicated preview page for viewing diary entries in read-only mode with navigation between entries and edit/delete capabilities.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-035 | Create `src/pages/DiaryView.tsx` component for diary entry preview page | ✅ | 2025-11-06 |
| TASK-036 | Add route `/diary/view/:date` in `src/App.tsx` mapping to DiaryView component | ✅ | 2025-11-06 |
| TASK-037 | Implement date parameter parsing and validation in DiaryView component | ✅ | 2025-11-06 |
| TASK-038 | Fetch diary entry from Supabase using date parameter with RLS policy enforcement | ✅ | 2025-11-06 |
| TASK-039 | Display entry date, title (or "Untitled Entry" placeholder), and full content in read-only format | ✅ | 2025-11-06 |
| TASK-040 | Display metadata: created timestamp, updated timestamp, character count | ✅ | 2025-11-06 |
| TASK-041 | Implement "Back to Diary" navigation link in header | ✅ | 2025-11-06 |
| TASK-042 | Add "Edit" button that navigates to `/diary` with date pre-loaded for editing | ✅ | 2025-11-06 |
| TASK-043 | Implement "Delete" button with confirmation dialog using shadcn/ui AlertDialog | ⏳ | Optional feature - can be added later |
| TASK-044 | Implement delete functionality calling Supabase delete with redirect to `/diary` on success | ⏳ | Optional feature - can be added later |
| TASK-045 | Fetch all user diary entries sorted chronologically for navigation | ✅ | 2025-11-06 |
| TASK-046 | Implement "Previous Entry" button navigating to chronologically earlier entry | ✅ | 2025-11-06 |
| TASK-047 | Implement "Next Entry" button navigating to chronologically later entry | ✅ | 2025-11-06 |
| TASK-048 | Disable Previous button when viewing earliest entry; disable Next button when viewing latest entry | ✅ | 2025-11-06 |
| TASK-049 | Handle "no entry found" state with message and "Create Entry" button | ✅ | 2025-11-06 |
| TASK-050 | Implement keyboard navigation: left arrow (previous), right arrow (next), escape (back) | ⏳ | Optional feature - can be added later |
| TASK-051 | Update Recent Entries sidebar in `src/pages/Diary.tsx` to link to preview page on click | ✅ | 2025-11-06 |
| TASK-052 | Add bilingual translations for all preview page labels and messages | ✅ | 2025-11-06 |
| TASK-053 | Style preview page with consistent typography matching main diary page | ✅ | 2025-11-06 |
| TASK-054 | Add visual distinction for read-only mode (e.g., subtle background color) | ✅ | 2025-11-06 |
| TASK-055 | Test responsive layout on mobile devices | ⏳ | Pending user testing |
| TASK-056 | Write E2E test: create entry → click in sidebar → view preview → edit → verify changes | ⏳ | Deferred to testing phase |
| TASK-057 | Write E2E test: view entry → delete with confirmation → verify removal | ⏳ | Deferred to testing phase |
| TASK-058 | Write E2E test: navigate between multiple entries using Previous/Next buttons | ⏳ | Deferred to testing phase |

## 3. Alternatives

### Alternative Charting Libraries Considered

- **ALT-001**: Chart.js - Popular library but less React-native approach; requires more imperative code; larger bundle size than Recharts. **Not chosen** because Recharts offers better TypeScript support and composable React components.

- **ALT-002**: Victory Charts - Good React integration but steeper learning curve; larger bundle size. **Not chosen** because Recharts has better documentation and larger community support.

- **ALT-003**: D3.js directly - Most flexible but requires significant boilerplate code; harder to maintain. **Not chosen** to reduce development time; Recharts provides sufficient abstraction while using D3 under the hood.

### Alternative Speech Recognition Approaches

- **ALT-004**: Azure Cognitive Services Speech-to-Text - Provides Te Reo Māori support and better accuracy but requires API costs and external service dependency. **Deferred** for future enhancement; start with free Web Speech API to validate user demand.

- **ALT-005**: Google Cloud Speech-to-Text API - High accuracy but costs money per usage and requires API key management. **Not chosen** for MVP; Web Speech API is sufficient for English-only initial release.

- **ALT-006**: Deepgram API - Modern API with good accuracy but adds external dependency and costs. **Not chosen** to maintain privacy-first architecture with client-side processing.

### Alternative Preview Page Patterns

- **ALT-007**: Modal overlay instead of dedicated page - Simpler implementation but limited screen space for long entries; harder to share specific entry URLs. **Not chosen** because dedicated page provides better reading experience and URL-based navigation.

- **ALT-008**: Inline read-only mode toggle on main diary page - Simpler routing but confusing UX mixing edit and view modes. **Not chosen** to maintain clear separation between writing and reading modes.

## 4. Dependencies

### External Dependencies
- **DEP-001**: Recharts library (v2.x) - Required for chart visualization in Phase 1
  - Install command: `npm install recharts`
  - Bundle size: ~150KB gzipped
  - License: MIT

- **DEP-002**: date-fns (already installed) - Used for date formatting in charts and diary preview

### Browser API Dependencies
- **DEP-003**: Web Speech API (SpeechRecognition interface) - Required for Phase 2 speech-to-text
  - Browser support: Chrome/Edge (full), Safari (partial with webkit prefix), Firefox (none)
  - Graceful degradation required for unsupported browsers

- **DEP-004**: MediaDevices API (navigator.mediaDevices.getUserMedia) - Required for microphone access in Phase 2
  - Requires HTTPS in production environments

### Infrastructure Dependencies
- **DEP-005**: Supabase database with existing tables:
  - `diary_entries` table with columns: id, user_id, entry_date, title, content, created_at, updated_at
  - `phq9_records` table (already exists) for chart data

- **DEP-006**: Supabase Row Level Security policies configured for:
  - Users can view/edit/delete only their own diary entries
  - Users can view only their own PHQ-9 records

### Component Dependencies
- **DEP-007**: Existing shadcn/ui components (Card, Button, Input, Textarea, AlertDialog)
- **DEP-008**: Radix UI icons for microphone button
- **DEP-009**: React Router v6 for routing

## 5. Files

### New Files to Create

- **FILE-001**: `src/utils/chartUtils.ts` - Chart data transformation utilities
  - Function: `transformPHQ9RecordsToChartData(records: PHQ9Record[]): ChartDataPoint[]`
  - Function: `getSeverityColor(score: number): string`
  - Function: `calculateTrendStats(records: PHQ9Record[]): SummaryStats`

- **FILE-002**: `src/components/charts/PHQ9LineChart.tsx` - Recharts line chart component
  - Props: `data: ChartDataPoint[], onDataPointClick?: (date: string) => void`

- **FILE-003**: `src/components/charts/ScoreSummary.tsx` - Summary statistics cards component
  - Props: `stats: SummaryStats, locale: string`

- **FILE-004**: `src/components/diary/SpeechToText.tsx` - Speech recognition component
  - Props: `onTranscript: (text: string) => void, onError: (error: string) => void, locale: string`

- **FILE-005**: `src/pages/DiaryView.tsx` - Diary preview page component
  - Route parameter: `date` (YYYY-MM-DD format)
  - Props: `locale: string`

### Files to Modify

- **FILE-006**: `src/pages/History.tsx` - Add chart and summary components
  - Import PHQ9LineChart and ScoreSummary
  - Fetch PHQ9Records from Supabase
  - Render chart above existing history list

- **FILE-007**: `src/pages/Diary.tsx` - Add speech-to-text button and preview navigation
  - Import SpeechToText component
  - Add microphone button next to textarea
  - Update Recent Entries sidebar items to link to preview page

- **FILE-008**: `src/App.tsx` - Add DiaryView route
  - Add import for DiaryView component
  - Add route: `<Route path="/diary/view/:date" element={<DiaryView locale={locale} />} />`

- **FILE-009**: `src/i18n/messages.ts` (or equivalent translation file) - Add new translation keys
  - Chart labels: "Total Assessments", "Average Score", "Trend", "Latest Score"
  - Speech labels: "Voice recording (English only)", "Recording...", "Microphone access required"
  - Preview page labels: "Previous Entry", "Next Entry", "Edit", "Delete", "Untitled Entry"

### Supporting Files

- **FILE-010**: `src/types/chart.ts` (optional) - TypeScript interfaces for chart data
  - `interface ChartDataPoint`
  - `interface SummaryStats`

- **FILE-011**: `src/hooks/useSpeechRecognition.ts` (optional) - Custom hook for speech recognition
  - Encapsulates Web Speech API logic for reusability

## 6. Testing

### Unit Tests

- **TEST-001**: `src/utils/chartUtils.test.ts` - Test chart data transformation
  - Test `getSeverityColor()` returns correct colors for all severity ranges
  - Test `transformPHQ9RecordsToChartData()` correctly formats dates and scores
  - Test `calculateTrendStats()` accurately computes averages and trends

- **TEST-002**: `src/components/diary/SpeechToText.test.tsx` - Test speech recognition component (with mocked API)
  - Test browser compatibility detection
  - Test error handling for permission denial
  - Test transcript appending logic

- **TEST-003**: `src/pages/DiaryView.test.tsx` - Test diary preview component
  - Test date parameter parsing
  - Test navigation button enable/disable logic
  - Test "no entry found" state rendering

### Integration Tests

- **TEST-004**: `src/components/charts/PHQ9LineChart.integration.test.tsx`
  - Test chart renders with real Supabase data (using test database)
  - Test empty state handling when no records exist
  - Test tooltip displays correct information

- **TEST-005**: `src/pages/History.integration.test.tsx`
  - Test chart and summary fetch and render PHQ-9 records
  - Test chart data updates when new assessment is added

### End-to-End Tests

- **TEST-006**: `e2e/phq9-chart.spec.ts` - Test PHQ-9 visualization flow
  - User completes PHQ-9 assessment
  - Navigate to History page
  - Verify chart displays with new data point
  - Hover over data point and verify tooltip

- **TEST-007**: `e2e/speech-to-text.spec.ts` (manual test recommended)
  - Click microphone button
  - Grant permissions
  - Verify recording indicator appears
  - Speak test phrase
  - Verify text appears in textarea

- **TEST-008**: `e2e/diary-preview.spec.ts` - Test diary preview flow
  - Create diary entry with title and content
  - Click entry in Recent Entries sidebar
  - Verify preview page displays correct content
  - Click Edit button
  - Verify entry loads in edit mode
  - Click Delete button and confirm
  - Verify entry is removed

- **TEST-009**: `e2e/diary-navigation.spec.ts` - Test preview navigation
  - Create 3 diary entries on different dates
  - View middle entry
  - Click Previous button → verify earlier entry loads
  - Click Next button → verify later entry loads
  - Navigate to earliest entry → verify Previous button disabled
  - Navigate to latest entry → verify Next button disabled

### Performance Tests

- **TEST-010**: Measure chart render time with 100 PHQ-9 records - Target: <1 second
- **TEST-011**: Measure speech recognition startup latency - Target: <500ms from button click to recording start
- **TEST-012**: Measure diary preview page load time - Target: <500ms

## 7. Risks & Assumptions

### Risks

- **RISK-001**: Web Speech API availability varies by browser - **Mitigation**: Implement graceful degradation with clear messaging; test across Chrome, Edge, Safari, and Firefox

- **RISK-002**: Speech recognition accuracy affected by accents and background noise - **Mitigation**: Allow users to edit transcribed text; document expected accuracy levels; consider auto-punctuation

- **RISK-003**: Recharts bundle size may impact initial page load - **Mitigation**: Use code splitting with React.lazy() to load chart components on demand

- **RISK-004**: Large number of PHQ-9 records (50+) may cause chart crowding - **Mitigation**: Implement data sampling or scrollable/zoomable chart; add date range filters

- **RISK-005**: Users may accidentally delete diary entries - **Mitigation**: Require explicit confirmation dialog with clear warning message; consider soft delete with recovery option

- **RISK-006**: Speech recognition requires internet connection in most browsers - **Mitigation**: Display error message when offline; document online requirement in UI

### Assumptions

- **ASSUMPTION-001**: Users have modern browsers (Chrome 88+, Edge 88+, Safari 14.1+) - If not, features will degrade gracefully

- **ASSUMPTION-002**: Supabase `diary_entries` table already has `title` column - If not, migration script `supabase-diary-add-title.sql` must be run first

- **ASSUMPTION-003**: Existing PHQ-9 records in Supabase have valid `total` scores (0-27) - Data validation should be in place

- **ASSUMPTION-004**: Users understand that voice recording is English-only for MVP - Clear UI messaging will set expectations

- **ASSUMPTION-005**: Mobile devices have functional microphone hardware - Error handling will address permission denial and hardware issues

- **ASSUMPTION-006**: Date format in diary_entries table is consistent (YYYY-MM-DD) - Validation should be added if not already present

## 8. Related Specifications / Further Reading

### Internal Documentation
- [Aroha MVP Phase 2 Enhancements Specification](../spec/Aroha-MVP-phase2-Enhancements.md) - Source specification for this implementation plan
- [Aroha MVP Core Specification](../spec/spec-design-aroha-mvp.md) - Base application requirements
- [Diary Feature Documentation](../docs/DIARY_FEATURE.md) - Existing diary implementation details
- [Supabase Auth Setup Guide](../docs/SUPABASE_AUTH_SETUP.md) - Authentication configuration

### External Resources
- [Recharts Documentation](https://recharts.org/en-US/) - Chart library API reference and examples
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Browser speech recognition API documentation
- [React Router v6 Guide](https://reactrouter.com/en/main) - Routing patterns and best practices
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript) - Database query patterns

### Research & Clinical Guidelines
- [PHQ-9 Interpretation Guide](https://www.phqscreeners.com/) - Official PHQ-9 scoring and severity thresholds
- [Mental Health Foundation NZ](https://mentalhealth.org.nz/) - New Zealand mental health resources

---

**Implementation Timeline:**
- Phase 1 (Charts): 2-3 hours → Target completion: Day 1
- Phase 2 (Speech-to-Text): 3-4 hours → Target completion: Day 2
- Phase 3 (Diary Preview): 2-3 hours → Target completion: Day 3
- **Total estimated effort: 7-10 hours** (spread over 3 days with testing)

**Recommended Execution Order:**
1. Start with Phase 1 (Charts) - Quickest visual impact and no complex dependencies
2. Continue with Phase 3 (Diary Preview) - Enhances existing diary feature
3. Finish with Phase 2 (Speech-to-Text) - Most complex with browser compatibility challenges

**Success Criteria:**
- All acceptance criteria from specification met
- All unit and integration tests passing
- E2E tests verify complete user flows
- Features work on mobile and desktop browsers
- Documentation updated with usage instructions

**Next Steps After Completion:**
1. Conduct user testing sessions with 5-10 target users
2. Gather feedback on chart usefulness and speech recognition accuracy
3. Prioritize follow-up enhancements (Te Reo Māori speech support, advanced analytics)
4. Monitor usage analytics to validate feature adoption

---
End of implementation plan.
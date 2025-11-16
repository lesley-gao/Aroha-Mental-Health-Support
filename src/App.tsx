import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button } from "./components/ui/button";
import { ConsentModal } from "./pages/Consent";
import { PrivacyPage } from "./pages/Privacy";
import { Home } from "./pages/Home";
import { PHQ9 } from "./pages/PHQ9";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Auth } from "./pages/Auth";
import Diary from "./pages/Diary";
import { DiaryView } from "./pages/DiaryView";
import { AllDiaries } from "./pages/AllDiaries";
import { Footer } from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { getMergedRecords, getRecords, migrateLocalRecordsToCloud, hasSeenMigrationPrompt, setSeenMigrationPrompt } from "./utils/storage";
import useTranslation from './i18n/useTranslation';
import type { Locale } from './i18n/messages';
import { generatePDF } from "./utils/pdf";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import {
  ReaderIcon,
  ActivityLogIcon,
  GearIcon,
  Pencil2Icon,
  ExitIcon,
  HomeIcon,
} from "@radix-ui/react-icons";
import "./App.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { t, locale, setLocale } = useTranslation();
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  // migrationCounts intentionally unused in the UI; tracking only during migration flow
  const [, setMigrationCounts] = useState<null | { migrated: number; skipped: number; errors: number }>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [pendingLocalCount, setPendingLocalCount] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing Supabase session
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session);
        setCurrentUserId(session?.user?.id ?? null);
      });

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
        setCurrentUserId(session?.user?.id ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // When user becomes authenticated, check for local records and prompt for migration
  useEffect(() => {
    let cancelled = false;
    async function checkLocalRecords() {
      try {
        if (!isAuthenticated) return;
        const local = await getRecords();
        if (cancelled) return;
        if (local.length > 0) {
          // If we have a current user and they've already seen the prompt, skip showing again
          if (currentUserId && hasSeenMigrationPrompt(currentUserId)) return;

          setPendingLocalCount(local.length);
          setShowMigrationModal(true);
        }
      } catch (err) {
        console.error('Error checking local records for migration:', err);
      }
    }
    checkLocalRecords();
    return () => { cancelled = true; };
  }, [isAuthenticated, currentUserId]);

  const handleConsent = () => {
    // Consent handled in modal; provider persists locale
  };
  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }

    // Clear authentication state
    setIsAuthenticated(false);
    // Navigate to home/login
    navigate("/");
    // Note: We're not clearing localStorage data as that contains user's PHQ-9 records
  };

  const handleMigrateNow = async () => {
    setIsMigrating(true);
    try {
      const counts = await migrateLocalRecordsToCloud();
      setMigrationCounts(counts);
    } catch (err) {
      console.error('Migration error:', err);
    } finally {
      // Mark that this user has seen the migration prompt so it doesn't reappear
      if (currentUserId) setSeenMigrationPrompt(currentUserId);
      setIsMigrating(false);
      setShowMigrationModal(false);
    }
  };

  const handleKeepLocal = () => {
    if (currentUserId) setSeenMigrationPrompt(currentUserId);
    setShowMigrationModal(false);
  };

  const handleExportPDF = async () => {
    try {
      const records = await getMergedRecords();

      if (records.length === 0) {
        alert(
          locale === "en"
            ? "No records to export"
            : "Kāore he pūkete hei kaweake"
        );
        return;
      }

      // Sort by date descending (newest first)
      const sorted = records.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      generatePDF(sorted, locale);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert(
        locale === "en" ? "Failed to export PDF" : "I rahua te kaweake PDF"
      );
    }
  };

  // Do not force redirect to Auth; let the main app render and expose /auth route

  const isActive = (path: string) => location.pathname === path;

  // If the route is the auth page, render it standalone (no header/footer)
  if (location.pathname.startsWith('/auth')) {
    return (
      <>
        <ConsentModal onConsent={handleConsent} />
        <Auth
          defaultTab="login"
          onAuthenticated={() => {
            setIsAuthenticated(true);
            navigate("/");
          }}
        />
      </>
    );
  }

  return (
    <>
      {showMigrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" />
          <div className="bg-white p-6 rounded shadow-lg z-10 max-w-lg">
            <h3 className="text-lg font-semibold">Migrate local records</h3>
            <p className="mt-2 text-sm text-gray-700">
              We found {pendingLocalCount} local assessment{pendingLocalCount === 1 ? '' : 's'} stored on this device. You can copy them to your account to access them from other devices.
            </p>
            <div className="mt-4 flex gap-3 justify-end">
              <Button variant="outline" onClick={handleKeepLocal}>Keep local</Button>
              <Button onClick={handleMigrateNow} disabled={isMigrating}>
                {isMigrating ? 'Migrating...' : 'Migrate now'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen bg-gray-50"
        style={{
          backgroundImage: "url(/background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="app">
          <header className="app-header" role="banner">
            <div className="flex items-center justify-between mb-4 pt-8">
              <Link to="/">
                <img
                  src="/logo.png"
                  alt="Aroha - Mental Health Support"
                  className="h-14 object-contain"
                />
              </Link>
              <nav
                role="navigation"
                aria-label="Main navigation"
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full backdrop-blur px-2 py-2 ring-2 ring-indigo-200 shadow-lg"
                  role="tablist"
                  aria-label="Section tabs"
                >
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className={
                        (isActive("/")
                          ? "bg-indigo-100 text-gray-900 shadow-sm "
                          : "text-gray-700 hover:text-gray-900 ") +
                        "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                      }
                      aria-current={isActive("/") ? "page" : undefined}
                      role="tab"
                      aria-selected={isActive("/")}
                    >
                      <HomeIcon className="mr-2 h-4 w-4" aria-hidden /> {t('navHome')}
                     </Button>
                  </Link>
                  <Link to="/phq9">
                    <Button
                      variant="ghost"
                      className={
                        (isActive("/phq9")
                          ? "bg-indigo-100 text-gray-900 shadow-sm "
                          : "text-gray-700 hover:text-gray-900 ") +
                        "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                      }
                      aria-current={isActive("/phq9") ? "page" : undefined}
                      role="tab"
                      aria-selected={isActive("/phq9")}
                    >
                      <ReaderIcon className="mr-2 h-4 w-4" aria-hidden /> {t('phq9Title')}
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button
                      variant="ghost"
                      className={
                        (isActive("/diary")
                          ? "bg-indigo-100 text-gray-900 shadow-sm "
                          : "text-gray-700 hover:text-gray-900 ") +
                        "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                      }
                      aria-current={isActive("/diary") ? "page" : undefined}
                      role="tab"
                      aria-selected={isActive("/diary")}
                    >
                      <Pencil2Icon className="mr-2 h-4 w-4" aria-hidden /> {t('diaryTitle')}
                    </Button>
                  </Link>
                  <Link to="/history">
                    <Button
                      variant="ghost"
                      className={
                        (isActive("/history")
                          ? "bg-indigo-100 text-gray-900 shadow-sm "
                          : "text-gray-700 hover:text-gray-900 ") +
                        "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                      }
                      aria-current={isActive("/history") ? "page" : undefined}
                      role="tab"
                      aria-selected={isActive("/history")}
                      >
                      <ActivityLogIcon className="mr-2 h-4 w-4" aria-hidden /> {t('historyTitle')}
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      className={
                        (isActive("/settings")
                          ? "bg-indigo-100 text-gray-900 shadow-sm "
                          : "text-gray-700 hover:text-gray-900 ") +
                        "rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                      }
                      aria-current={isActive("/settings") ? "page" : undefined}
                      role="tab"
                      aria-selected={isActive("/settings")}
                      >
                      <GearIcon className="mr-2 h-4 w-4" aria-hidden /> {t('settingsTitle')}
                    </Button>
                  </Link>
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-gray-900 rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                    >
                      <ExitIcon className="mr-2 h-4 w-4" aria-hidden /> {t('logoutButton')}
                    </Button>
                  ) : (
                    <Link to="/auth">
                      <Button
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                      >
                        <ExitIcon className="mr-2 h-4 w-4" aria-hidden /> {t('loginButton')}
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </header>
          <main id="main-content" className="py-8 px-4" role="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phq9" element={<PHQ9 />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/diary/all" element={<AllDiaries />} />
              <Route path="/diary/:date" element={<DiaryView />} />
              <Route path="/history" element={<History onExportPDF={handleExportPDF} />} />
              <Route path="/settings" element={<Settings onLocaleChange={handleLocaleChange} />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route
                path="/auth"
                element={
                  <Auth
                    defaultTab="login"
                    onAuthenticated={() => {
                      setIsAuthenticated(true);
                      navigate("/");
                    }}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

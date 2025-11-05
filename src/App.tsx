import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ConsentModal } from '@/pages/Consent'
import { PrivacyPage } from '@/pages/Privacy'
import { PHQ9 } from '@/pages/PHQ9'
import { History } from '@/pages/History'
import { Settings } from '@/pages/Settings'
import { Auth } from '@/pages/Auth'
import Diary from '@/pages/Diary'
import { type Locale } from '@/i18n/messages'
import { getLanguage, getRecords } from '@/utils/storage'
import { generatePDF } from '@/utils/pdf'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { ReaderIcon, ActivityLogIcon, GearIcon, LockClosedIcon, Pencil2Icon, ExitIcon } from '@radix-ui/react-icons'
import './App.css'

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [locale, setLocale] = useState<Locale>('en')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Load language preference
    const savedLocale = getLanguage() as Locale
    setLocale(savedLocale)

    // Check for existing Supabase session
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setIsAuthenticated(!!session)
      })

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const handleConsent = () => {
    // Consent handled in modal, reload locale if needed
    const savedLocale = getLanguage() as Locale
    setLocale(savedLocale)
  }

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
  }

  const handleLogout = async () => {
    // Sign out from Supabase
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut()
    }
    
    // Clear authentication state
    setIsAuthenticated(false)
    // Navigate to home/login
    navigate('/')
    // Note: We're not clearing localStorage data as that contains user's PHQ-9 records
  }

  const handleExportPDF = async () => {
    try {
      const records = await getRecords();
      // Sort by date descending (newest first)
      const sorted = records.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      generatePDF(sorted, locale);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert(locale === 'en' ? 'Failed to export PDF' : 'I rahua te kaweake PDF');
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen bg-gray-50"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <Auth defaultTab="login" onAuthenticated={() => {
          setIsAuthenticated(true)
          navigate('/')
        }} />
      </div>
    )
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <ConsentModal locale={locale} onConsent={handleConsent} />
      
      <div 
        className="min-h-screen bg-gray-50"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="app">
          <header className="app-header" role="banner">
            <h1 className="text-gray-800 text-3xl font-bold mb-4">Aroha - Mental Health Support</h1>
            <nav role="navigation" aria-label="Main navigation">
              <div className="w-full flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50/80 backdrop-blur px-2 py-2 ring-1 ring-indigo-100 shadow-sm" role="tablist" aria-label="Section tabs">
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className={(isActive('/') ? 'bg-indigo-100 text-gray-900 shadow-sm ' : 'text-gray-700 hover:text-gray-900 ') + 'rounded-full px-4 py-2 focus-visible:ring-indigo-400'}
                      aria-current={isActive('/') ? 'page' : undefined}
                      role="tab"
                      aria-selected={isActive('/')}
                    >
                      <ReaderIcon className="mr-2 h-4 w-4" aria-hidden /> PHQ-9
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button
                      variant="ghost"
                      className={(isActive('/diary') ? 'bg-indigo-100 text-gray-900 shadow-sm ' : 'text-gray-700 hover:text-gray-900 ') + 'rounded-full px-4 py-2 focus-visible:ring-indigo-400'}
                      aria-current={isActive('/diary') ? 'page' : undefined}
                      role="tab"
                      aria-selected={isActive('/diary')}
                    >
                      <Pencil2Icon className="mr-2 h-4 w-4" aria-hidden /> Diary
                    </Button>
                  </Link>
                  <Link to="/history">
                    <Button
                      variant="ghost"
                      className={(isActive('/history') ? 'bg-indigo-100 text-gray-900 shadow-sm ' : 'text-gray-700 hover:text-gray-900 ') + 'rounded-full px-4 py-2 focus-visible:ring-indigo-400'}
                      aria-current={isActive('/history') ? 'page' : undefined}
                      role="tab"
                      aria-selected={isActive('/history')}
                    >
                      <ActivityLogIcon className="mr-2 h-4 w-4" aria-hidden /> History
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      className={(isActive('/settings') ? 'bg-indigo-100 text-gray-900 shadow-sm ' : 'text-gray-700 hover:text-gray-900 ') + 'rounded-full px-4 py-2 focus-visible:ring-indigo-400'}
                      aria-current={isActive('/settings') ? 'page' : undefined}
                      role="tab"
                      aria-selected={isActive('/settings')}
                    >
                      <GearIcon className="mr-2 h-4 w-4" aria-hidden /> Settings
                    </Button>
                  </Link>
                  <Link to="/privacy">
                    <Button
                      variant="ghost"
                      className={(isActive('/privacy') ? 'bg-indigo-100 text-gray-900 shadow-sm ' : 'text-gray-700 hover:text-gray-900 ') + 'rounded-full px-4 py-2 focus-visible:ring-indigo-400'}
                      aria-current={isActive('/privacy') ? 'page' : undefined}
                      role="tab"
                      aria-selected={isActive('/privacy')}
                    >
                      <LockClosedIcon className="mr-2 h-4 w-4" aria-hidden /> Privacy
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 rounded-full px-4 py-2 focus-visible:ring-indigo-400"
                  >
                    <ExitIcon className="mr-2 h-4 w-4" aria-hidden /> Logout
                  </Button>
                </div>
              </div>
            </nav>
          </header>
          <main id="main-content" className="py-8 px-4" role="main">
            <Routes>
              <Route path="/" element={<PHQ9 locale={locale} />} />
              <Route path="/diary" element={<Diary locale={locale} />} />
              <Route path="/history" element={<History locale={locale} onExportPDF={handleExportPDF} />} />
              <Route path="/settings" element={<Settings locale={locale} onLocaleChange={handleLocaleChange} />} />
              <Route path="/privacy" element={<PrivacyPage locale={locale} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ConsentModal } from '@/pages/Consent'
import { PrivacyPage } from '@/pages/Privacy'
import { PHQ9 } from '@/pages/PHQ9'
import { History } from '@/pages/History'
import { Settings } from '@/pages/Settings'
import { type Locale } from '@/i18n/messages'
import { getLanguage, getRecords } from '@/utils/storage'
import { generatePDF } from '@/utils/pdf'
import './App.css'

type Page = 'phq9' | 'history' | 'settings' | 'privacy'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('phq9')
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    // Load language preference
    const savedLocale = getLanguage() as Locale
    setLocale(savedLocale)
  }, [])

  const handleConsent = () => {
    // Consent handled in modal, reload locale if needed
    const savedLocale = getLanguage() as Locale
    setLocale(savedLocale)
  }

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
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

  const renderPage = () => {
    switch (currentPage) {
      case 'phq9':
        return <PHQ9 locale={locale} />
      case 'history':
        return <History locale={locale} onExportPDF={handleExportPDF} />
      case 'settings':
        return <Settings locale={locale} onLocaleChange={handleLocaleChange} />
      case 'privacy':
        return <PrivacyPage locale={locale} />
      default:
        return <PHQ9 locale={locale} />
    }
  }

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
            <nav className="flex gap-2 border-b-2 border-gray-200 pb-2" role="navigation" aria-label="Main navigation">
              <Button 
                variant="ghost"
                onClick={() => setCurrentPage('phq9')}
                className={currentPage === 'phq9' ? 'border-b-2 border-blue-600 rounded-none text-blue-600 font-semibold' : 'border-b-2 border-transparent rounded-none'}
                aria-current={currentPage === 'phq9' ? 'page' : undefined}
              >
                PHQ-9
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setCurrentPage('history')}
                className={currentPage === 'history' ? 'border-b-2 border-blue-600 rounded-none text-blue-600 font-semibold' : 'border-b-2 border-transparent rounded-none'}
                aria-current={currentPage === 'history' ? 'page' : undefined}
              >
                History
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setCurrentPage('settings')}
                className={currentPage === 'settings' ? 'border-b-2 border-blue-600 rounded-none text-blue-600 font-semibold' : 'border-b-2 border-transparent rounded-none'}
                aria-current={currentPage === 'settings' ? 'page' : undefined}
              >
                Settings
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setCurrentPage('privacy')}
                className={currentPage === 'privacy' ? 'border-b-2 border-blue-600 rounded-none text-blue-600 font-semibold' : 'border-b-2 border-transparent rounded-none'}
                aria-current={currentPage === 'privacy' ? 'page' : undefined}
              >
                Privacy
              </Button>
            </nav>
          </header>
          <main id="main-content" className="py-8 px-4" role="main">
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  )
}

export default App

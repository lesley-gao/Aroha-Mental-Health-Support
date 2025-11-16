import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Timeline, 
  TimelineItem, 
  TimelineDot, 
  TimelineContent, 
  TimelineTime, 
  TimelineTitle, 
  TimelineDescription 
} from '@/components/ui/timeline';
import { Save, Calendar, X, ArrowUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BrowserSpeechToText } from '@/components/speech/BrowserSpeechToText';
import { useTranslation } from '@/i18n/useTranslation';

interface DiaryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Diary() {

  // component state
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentEntry, setCurrentEntry] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, locale } = useTranslation();

  const dateLocale = locale === 'mi' ? 'mi-NZ' : locale === 'zh' ? 'zh-CN' : 'en-NZ';

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    // Only load entry if there's a date query parameter from navigation
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
      loadEntryForDate(dateParam);
    }
    // Don't auto-load for selectedDate changes - only when user clicks a date
  }, [searchParams]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      // Try to detect authenticated user; if none, fall back to localStorage entries
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticatedUser(!!user);
        if (user) {
          const { data, error } = await supabase
            .from('diary_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('entry_date', { ascending: false });

          if (error) throw error;
          setEntries(data || []);
          return;
        }
  }

      // No authenticated user - load from localStorage
      const raw = localStorage.getItem('local_diary_entries');
      if (!raw) {
        setEntries([]);
      } else {
        try {
          const parsed = JSON.parse(raw) as DiaryEntry[];
          setEntries(parsed || []);
        } catch (err) {
          console.error('Error parsing local diary entries:', err);
          setEntries([]);
        }
      }
    } catch (error) {
      console.error('Error loading diary entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEntryForDate = async (date: string) => {
    try {
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', date)
        .maybeSingle();

      if (error) {
        console.error('Error loading diary entry:', error);
        throw error;
      }
      
      setCurrentTitle(data?.title || '');
      setCurrentEntry(data?.content || '');
    } catch (error) {
      console.error('Error loading entry for date:', error);
      setCurrentTitle('');
      setCurrentEntry('');
    }
  };

  const saveEntry = async () => {
    setIsSaving(true);
    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('diary_entries')
            .upsert({
              user_id: user.id,
              entry_date: selectedDate,
              title: currentTitle,
              content: currentEntry,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,entry_date'
            });

          if (error) throw error;

          // Reload entries to update the list
          await loadEntries();
        } else {
          // No user - save locally
          const raw = localStorage.getItem('local_diary_entries');
          const localEntries = raw ? (JSON.parse(raw) as DiaryEntry[]) : [];
          const newEntry: DiaryEntry = {
            id: crypto.randomUUID(),
            user_id: '',
            entry_date: selectedDate,
            title: currentTitle,
            content: currentEntry,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          localEntries.unshift(newEntry);
          localStorage.setItem('local_diary_entries', JSON.stringify(localEntries));
          setEntries(localEntries);
        }
      } else {
        // No supabase configured - save locally
        const raw = localStorage.getItem('local_diary_entries');
        const localEntries = raw ? (JSON.parse(raw) as DiaryEntry[]) : [];
        const newEntry: DiaryEntry = {
          id: crypto.randomUUID(),
          user_id: '',
          entry_date: selectedDate,
          title: currentTitle,
          content: currentEntry,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localEntries.unshift(newEntry);
        localStorage.setItem('local_diary_entries', JSON.stringify(localEntries));
        setEntries(localEntries);
      }

      // Clear the form fields and AI summary after successful save
      setCurrentTitle('');
      setCurrentEntry('');
      setAiSummary('');
    } catch (error) {
      console.error('Error saving diary entry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save entry: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSpeechTranscript = (transcript: string) => {
    // Append the speech transcript to current entry content
    setCurrentEntry(prev => {
      const needsSpace = prev.length > 0 && !prev.endsWith(' ') && !prev.endsWith('\n');
      return prev + (needsSpace ? ' ' : '') + transcript;
    });
  };

  const handleClearEntry = () => {
      if (currentEntry.trim() || currentTitle.trim()) {
      if (window.confirm(String(t('diaryClearConfirm'))) ) {
        setCurrentTitle('');
        setCurrentEntry('');
        setAiSummary('');
      }
    }
  };

  const handleInsertSummary = () => {
    if (aiSummary) {
      // Split summary into main text and emotions
      const parts = aiSummary.split(/\n\n💭 Emotions:\s*/);
      const summaryText = parts[0].trim();
      const emotions = parts[1] || '';
      
      setCurrentEntry(prev => {
        const needsSpace = prev.length > 0 && !prev.endsWith('\n');
        const separator = '\n--------------------------------\n';
        const header = '✨ AI Summary:\n';
        const emotionLine = emotions ? `\n💭 Emotion: ${emotions}` : '';
        
        return prev + (needsSpace ? '\n' : '') + separator + header + summaryText + emotionLine;
      });
      setAiSummary(''); // Clear summary after inserting
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('diaryPageTitle')}</h1>
        <p className="text-gray-600">{t('diarySubtitle')}</p>
        {!isAuthenticatedUser && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-800">
              {t('diaryLocalNotice')}
            </p>
            <div className="mt-3">
              <a href="/auth">
                <Button variant="default">{t('diaryLoginCreate')}</Button>
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main writing area */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/30">
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="entry-date" className="text-base font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {t('diarySelectDate')}
              </label>
              <input
                id="entry-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="entry-title" className="text-base font-medium text-gray-700 mb-2 block">
                {t('diaryEntryTitle')}
              </label>
              <Input
                id="entry-title"
                type="text"
                value={currentTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTitle(e.target.value)}
                placeholder={String(t('diaryTitlePlaceholder'))}
                className="w-full "
              />
            </div>

            <Textarea
              value={currentEntry}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentEntry(e.target.value)}
              placeholder={String(t('diaryPlaceholder'))}
              className="min-h-[400px] mb-4 resize-none"
            />

            {/* Browser Speech-to-Text Control (Fallback) */}
            <div className="mb-4">
              <BrowserSpeechToText 
                onTranscript={handleSpeechTranscript}
                showSummary={true}
                onSummary={(summary: string) => {
                  setAiSummary(summary);
                  console.log('AI Summary:', summary);
                }}
              />
            </div>

            {/* AI Summary Display */}
            {aiSummary && (
              <div className="mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base font-medium text-indigo-900">✨ {t('aiSummary')}</span>
                  <div className="ml-auto flex items-center gap-2">
                      <Button
                      onClick={handleInsertSummary}
                      size="sm"
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                    >
                      <ArrowUp className="w-4 h-4" />
                      {t('diaryInsertSummary')}
                    </Button>
                    <button
                      onClick={() => setAiSummary('')}
                      className="p-1.5 text-indigo-500 hover:text-indigo-800 hover:bg-indigo-100 rounded-full transition-colors"
                      aria-label={String(t('diaryClearSummary'))}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-base text-indigo-800 whitespace-pre-line">
                  {aiSummary}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-base text-gray-500">
                {currentEntry.length} {t('diaryCharacters')}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handleClearEntry}
                  disabled={!currentEntry.trim() && !currentTitle.trim()}
                  variant="outline"
                  className="flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('diaryClear')}
                </Button>
                <Button
                  onClick={saveEntry}
                  disabled={isSaving || !currentEntry.trim()}
                  className="flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? t('diarySaved') : t('diarySaveEntry')}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent entries sidebar - Timeline */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white/30">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">{t('diaryRecentEntries')}</h2>
            
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-center text-gray-500 py-4 text-base">{t('diaryNoEntries')}</div>
            ) : (
              <>
                <Timeline>
                  {entries.slice(0, 5).map((entry) => (
                    <TimelineItem key={entry.id} isActive={entry.entry_date === selectedDate}>
                      <TimelineDot isActive={entry.entry_date === selectedDate} />
                      <TimelineContent >
                        <button
                          onClick={() => setSelectedDate(entry.entry_date)}
                          className="w-full text-left group"
                        >
                          <TimelineTime className={entry.entry_date === selectedDate ? 'text-indigo-600' : ''}>
                              {new Date(entry.entry_date).toLocaleDateString(dateLocale, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TimelineTime>
                          {entry.title && (
                            <TimelineTitle className="mt-1 truncate group-hover:text-indigo-500 transition-colors">
                              {entry.title}
                            </TimelineTitle>
                          )}
                          <TimelineDescription className="mt-1 line-clamp-2">
                            {entry.content.substring(0, 80)}...
                          </TimelineDescription>
                        </button>
                        <button
                          onClick={() => navigate(`/diary/${entry.entry_date}`)}
                          className="text-sm text-right text-indigo-500 hover:text-indigo-800 hover:underline mt-2"
                        >
                          {t('diaryViewFull')}
                        </button>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
                {entries.length > 5 && (
                  <button
                    onClick={() => navigate('/diary/all')}
                    className="text-base text-indigo-500 hover:text-indigo-800 hover:underline mt-4 w-full text-center"
                  >
                    {t('diaryShowAllDiaries')}
                  </button>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

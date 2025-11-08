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
import { Save, Calendar, X, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BrowserSpeechToText } from '@/components/speech/BrowserSpeechToText';
import type { Locale } from '@/i18n/messages';

interface DiaryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface DiaryProps {
  locale: Locale;
}

export default function Diary({ locale }: DiaryProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentEntry, setCurrentEntry] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: 'My Diary',
      subtitle: 'Record your thoughts and feelings',
      entryTitle: 'Entry Title',
      titlePlaceholder: 'Give your entry a title...',
      placeholder: 'Write your thoughts here...',
      save: 'Save Entry',
      saved: 'Entry Saved',
      clear: 'Clear',
      clearConfirm: 'Are you sure you want to clear this entry?',
      noEntries: 'No entries yet. Start writing!',
      selectDate: 'Select Date',
      characters: 'characters',
      aiSummary: 'AI Summary',
      clearSummary: 'Clear',
      insertSummary: 'Insert',
      showAllDiaries: 'Show All Diaries'
    },
    mi: {
      title: 'Taku Pukapuka',
      subtitle: 'Tuhia ō whakaaro me ō kare-ā-roto',
      entryTitle: 'Taitara Tuhinga',
      titlePlaceholder: 'Hoatu he taitara ki tō tuhinga...',
      placeholder: 'Tuhia ō whakaaro ki konei...',
      save: 'Tiaki Tuhinga',
      saved: 'Kua Tiakina',
      clear: 'Whakakore',
      clearConfirm: 'Kei te tino hiahia koe ki te whakakore i tēnei tuhinga?',
      noEntries: 'Kāore anō kia tuhia. Tīmataria!',
      selectDate: 'Kōwhiri Rā',
      characters: 'reta',
      aiSummary: 'Whakarāpopoto AI',
      clearSummary: 'Whakakore',
      insertSummary: 'Whakauru',
      showAllDiaries: 'Whakaatu Ngā Pukapuka Katoa'
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

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
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
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
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
      if (window.confirm(t.clearConfirm)) {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main writing area */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white/30">
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="entry-date" className="text-base font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {t.selectDate}
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
                {t.entryTitle}
              </label>
              <Input
                id="entry-title"
                type="text"
                value={currentTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                className="w-full "
              />
            </div>

            <Textarea
              value={currentEntry}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentEntry(e.target.value)}
              placeholder={t.placeholder}
              className="min-h-[400px] mb-4 resize-none"
            />

            {/* Browser Speech-to-Text Control (Fallback) */}
            <div className="mb-4">
              <BrowserSpeechToText 
                onTranscript={handleSpeechTranscript}
                locale={locale}
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
                  <span className="text-base font-medium text-indigo-900">✨ {t.aiSummary}</span>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={handleInsertSummary}
                      className="text-xs text-indigo-500 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <ArrowDown className="w-3 h-3" />
                      {t.insertSummary}
                    </button>
                    <button
                      onClick={() => setAiSummary('')}
                      className="text-xs text-indigo-500 hover:text-indigo-800"
                    >
                      {t.clearSummary}
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
                {currentEntry.length} {t.characters}
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={handleClearEntry}
                  disabled={!currentEntry.trim() && !currentTitle.trim()}
                  variant="outline"
                  className="flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.clear}
                </Button>
                <Button
                  onClick={saveEntry}
                  disabled={isSaving || !currentEntry.trim()}
                  className="flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? t.saved : t.save}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent entries sidebar - Timeline */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white/30">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">Recent Entries</h2>
            
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-center text-gray-500 py-4 text-base">{t.noEntries}</div>
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
                            {new Date(entry.entry_date).toLocaleDateString(locale === 'mi' ? 'mi-NZ' : 'en-NZ', {
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
                          View Full
                        </button>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
                {entries.length > 5 && (
                  <button
                    onClick={() => navigate('/diary/all')}
                    className="text-sm text-indigo-500 hover:text-indigo-800 hover:underline mt-4 w-full text-center"
                  >
                    {t.showAllDiaries}
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

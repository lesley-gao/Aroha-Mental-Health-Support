import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SpeechToText } from '@/components/speech/SpeechToText';
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
      noEntries: 'No entries yet. Start writing!',
      selectDate: 'Select Date',
      characters: 'characters'
    },
    mi: {
      title: 'Taku Pukapuka',
      subtitle: 'Tuhia ō whakaaro me ō kare-ā-roto',
      entryTitle: 'Taitara Tuhinga',
      titlePlaceholder: 'Hoatu he taitara ki tō tuhinga...',
      placeholder: 'Tuhia ō whakaaro ki konei...',
      save: 'Tiaki Tuhinga',
      saved: 'Kua Tiakina',
      noEntries: 'Kāore anō kia tuhia. Tīmataria!',
      selectDate: 'Kōwhiri Rā',
      characters: 'reta'
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.en;

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    // Check if there's a date query parameter
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
    }
    loadEntryForDate(selectedDate);
  }, [selectedDate, searchParams]);

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
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main writing area */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <label htmlFor="entry-date" className="text-sm font-medium text-gray-700 flex items-center">
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
              <label htmlFor="entry-title" className="text-sm font-medium text-gray-700 mb-2 block">
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

            {/* Speech-to-Text Control */}
            <div className="mb-4">
              <SpeechToText 
                onTranscript={handleSpeechTranscript}
                locale={locale}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {currentEntry.length} {t.characters}
              </span>
              <Button
                onClick={saveEntry}
                disabled={isSaving || !currentEntry.trim()}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? t.saved : t.save}
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent entries sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Entries</h2>
            
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">Loading...</div>
            ) : entries.length === 0 ? (
              <div className="text-center text-gray-500 py-4 text-sm">{t.noEntries}</div>
            ) : (
              <div className="space-y-2">
                {entries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className={`w-full px-3 py-2 rounded-md text-sm transition-colors border ${
                      entry.entry_date === selectedDate
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedDate(entry.entry_date)}
                      className="w-full text-left mb-2"
                    >
                      <div className="font-medium">
                        {new Date(entry.entry_date).toLocaleDateString(locale === 'mi' ? 'mi-NZ' : 'en-NZ', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      {entry.title && (
                        <div className="text-xs font-semibold text-gray-700 truncate mt-1">
                          {entry.title}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 truncate">
                        {entry.content.substring(0, 50)}...
                      </div>
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/diary/${entry.entry_date}`)}
                      className="w-full gap-2 text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      View Full Entry
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

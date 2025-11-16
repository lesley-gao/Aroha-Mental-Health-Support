import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Timeline, 
  TimelineItem, 
  TimelineDot, 
  TimelineContent, 
  TimelineTime, 
  TimelineTitle, 
  TimelineDescription 
} from '@/components/ui/timeline';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import useTranslation from '@/i18n/useTranslation';

interface DiaryEntry {
  id: string;
  user_id: string;
  entry_date: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function AllDiaries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, locale: providerLocale } = useTranslation();

  useEffect(() => {
    loadEntries();
  }, []);

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

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <Card className="bg-white/30">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{t('diaryShowAllDiaries')}</h1>
            <Button 
              variant="default" 
              onClick={() => navigate('/diary')} 
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('backToDiary')}
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500 py-12">{t('loading')}</div>
          ) : entries.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-base">{t('diaryNoEntries')}</div>
          ) : (
            <Timeline>
              {entries.map((entry) => (
                <TimelineItem key={entry.id} isActive={false}>
                  <TimelineDot isActive={false} />
                  <TimelineContent>
                    <button
                      onClick={() => navigate(`/diary/${entry.entry_date}`)}
                      className="w-full text-left group"
                    >
                      <TimelineTime>
                        {new Date(entry.entry_date).toLocaleDateString(providerLocale === 'mi' ? 'mi-NZ' : providerLocale === 'zh' ? 'zh-CN' : 'en-NZ', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TimelineTime>
                      {entry.title && (
                        <TimelineTitle className="mt-1 truncate group-hover:text-indigo-600 transition-colors">
                          {entry.title}
                        </TimelineTitle>
                      )}
                      <TimelineDescription className="mt-1 line-clamp-2">
                        {entry.content.substring(0, 80)}...
                      </TimelineDescription>
                    </button>
                    <button
                      onClick={() => navigate(`/diary/${entry.entry_date}`)}
                      className="text-base text-right text-indigo-500 hover:text-indigo-800 hover:underline mt-2"
                    >
                      {t('diaryViewFull')}
                    </button>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </div>
      </Card>
    </div>
  );
}


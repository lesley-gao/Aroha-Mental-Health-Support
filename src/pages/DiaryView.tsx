/**
 * DiaryView Component
 * Displays individual diary entry in full-page view with navigation
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Locale } from '@/i18n/messages';
import { format } from 'date-fns';

interface DiaryEntry {
  id: string;
  entry_date: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface DiaryViewProps {
  locale: Locale;
}

export function DiaryView({ locale }: DiaryViewProps) {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [adjacentDates, setAdjacentDates] = useState<{
    previous: string | null;
    next: string | null;
  }>({ previous: null, next: null });

  const t = getTranslations(locale);

  useEffect(() => {
    if (date) {
      loadEntry(date);
      loadAdjacentDates(date);
    }
  }, [date]);

  const loadEntry = async (entryDate: string) => {
    if (!supabase) {
      console.error('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', entryDate)
        .single();

      if (error) {
        console.error('Error loading entry:', error);
        setEntry(null);
      } else {
        setEntry(data);
      }
    } catch (error) {
      console.error('Failed to load entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdjacentDates = async (currentDate: string) => {
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get previous entry date
      const { data: prevData } = await supabase
        .from('diary_entries')
        .select('entry_date')
        .eq('user_id', user.id)
        .lt('entry_date', currentDate)
        .order('entry_date', { ascending: false })
        .limit(1)
        .single();

      // Get next entry date
      const { data: nextData } = await supabase
        .from('diary_entries')
        .select('entry_date')
        .eq('user_id', user.id)
        .gt('entry_date', currentDate)
        .order('entry_date', { ascending: true })
        .limit(1)
        .single();

      setAdjacentDates({
        previous: prevData?.entry_date || null,
        next: nextData?.entry_date || null,
      });
    } catch (error) {
      console.error('Failed to load adjacent dates:', error);
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleEdit = () => {
    navigate(`/diary?date=${date}`);
  };

  const handlePrevious = () => {
    if (adjacentDates.previous) {
      navigate(`/diary/${adjacentDates.previous}`);
    }
  };

  const handleNext = () => {
    if (adjacentDates.next) {
      navigate(`/diary/${adjacentDates.next}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">{t.loading}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card>
          <CardHeader>
            <Button variant="ghost" onClick={() => navigate('/diary')} className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToDiary}
            </Button>
          </CardHeader>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t.noEntry}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader>
          {/* Navigation Bar */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate('/diary')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToDiary}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={!adjacentDates.previous}
              >
                <ChevronLeft className="h-4 w-4" />
                {t.previous}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={!adjacentDates.next}
              >
                {t.next}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Entry Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {entry.title || t.untitled}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDisplayDate(entry.entry_date)}</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              {t.edit}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Entry Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {entry.content}
            </div>
          </div>

          {/* Entry Metadata */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                {t.created}: {format(new Date(entry.created_at), 'PPp')}
              </div>
              {entry.updated_at !== entry.created_at && (
                <div>
                  {t.lastModified}: {format(new Date(entry.updated_at), 'PPp')}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Translations
function getTranslations(locale: Locale) {
  interface Translations {
    loading: string;
    backToDiary: string;
    noEntry: string;
    previous: string;
    next: string;
    untitled: string;
    edit: string;
    created: string;
    lastModified: string;
  }

  const translations: Record<string, Translations> = {
    en: {
      loading: 'Loading...',
      backToDiary: 'Back to Diary',
      noEntry: 'No entry found for this date',
      previous: 'Previous',
      next: 'Next',
      untitled: 'Untitled Entry',
      edit: 'Edit',
      created: 'Created',
      lastModified: 'Last modified',
    },
    mi: {
      loading: 'E uta ana...',
      backToDiary: 'Hoki ki te Diary',
      noEntry: 'Kāore he tāurunga mō tēnei rā',
      previous: 'O Mua',
      next: 'E Haere Ana',
      untitled: 'Tāurunga Kāore i Ingoatia',
      edit: 'Whakatika',
      created: 'I Hangaia',
      lastModified: 'I whakapaihia whakamutunga',
    },
  };

  return translations[locale] || translations.en;
}

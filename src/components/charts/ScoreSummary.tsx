/**
 * ScoreSummary Component
 * Displays current score, trend, and statistics for PHQ-9 assessments
 */

import { TrendingUp } from 'lucide-react';
import type { ScoreSummary } from '../../utils/chartUtils';
import { getSeverityColor, getSeverityLabel } from '../../utils/chartUtils';
import { getSeverityBgColor, type SeverityLevel } from '../../utils/severity';

interface ScoreSummaryProps {
  summary: ScoreSummary;
  currentSeverity: string;
  locale?: string;
  trend?: { direction: 'up' | 'down' | 'stable'; change: number } | null;
}

export function ScoreSummaryCard({ summary, currentSeverity, locale = 'en', trend }: ScoreSummaryProps) {
  const t = getTranslations(locale);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 border-2 border-indigo-100 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100 mb-4">
        {t.title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Score */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className=" text-gray-600 dark:text-gray-400 mb-1">
            {t.currentScore}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.current ?? '—'}
          </p>
          {summary.current !== null && (
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-base font-medium ${getSeverityBgColor(currentSeverity as SeverityLevel)} ${getSeverityColor(currentSeverity as SeverityLevel)}`}>
              {getSeverityLabel(currentSeverity)}
            </span>
          )}
        </div>

        {/* Trend Comparison */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className=" text-gray-600 dark:text-gray-400 mb-1">
            {t.trend}
          </p>
          {trend ? (
            <div className="flex items-start gap-2 mt-2">
              <TrendingUp className={`h-5 w-5 mt-0.5 ${
                trend.direction === 'down' ? 'text-green-600 rotate-180' :
                trend.direction === 'up' ? 'text-amber-600' :
                'text-gray-600 rotate-90'
              }`} />
              <div>
                <p className="font-bold text-2xl">
                  {trend.direction === 'down' && locale === 'en' && `Decreased by ${trend.change} points`}
                  {trend.direction === 'down' && locale === 'mi' && `Kua heke ${trend.change} piro`}
                  {trend.direction === 'up' && locale === 'en' && `Increased by ${trend.change} points`}
                  {trend.direction === 'up' && locale === 'mi' && `Kua piki ${trend.change} piro`}
                  {trend.direction === 'stable' && locale === 'en' && 'Unchanged'}
                  {trend.direction === 'stable' && locale === 'mi' && 'Kāore i rerekē'}
                </p>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                  {locale === 'en' ? 'vs previous' : 'vs o mua'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-base text-gray-500">—</p>
          )}
        </div>

        {/* Average Score */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className=" text-gray-600 dark:text-gray-400 mb-1">
            {t.averageScore}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.average.toFixed(1)}
          </p>
          {summary.previous !== null && (
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
              {t.previous}: {summary.previous}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Translations
function getTranslations(locale: string) {
  interface Translations {
    title: string;
    currentScore: string;
    trend: string;
    averageScore: string;
    previous: string;
    change: string;
    improving: string;
    worsening: string;
    stable: string;
    insufficient_data: string;
    improvingMessage: string;
    worseningMessage: string;
    insufficientDataMessage: string;
  }

  const translations: Record<string, Translations> = {
    en: {
      title: 'Score Summary',
      currentScore: 'Latest Score',
      trend: 'Trend',
      averageScore: 'Average Score',
      previous: 'Previous',
      change: 'change',
      improving: 'Improving',
      worsening: 'Worsening',
      stable: 'Stable',
      insufficient_data: 'No Data',
      improvingMessage: 'Great progress! Your scores are improving over time.',
      worseningMessage: 'Your scores have increased. Consider reaching out to a healthcare professional if needed.',
      insufficientDataMessage: 'Complete more assessments to see your progress trend.',
    },
    mi: {
      title: 'Whakarāpopototanga Kaute',
      currentScore: 'Kaute o Nāianei',
      trend: 'Ia',
      averageScore: 'Kaute Toharite',
      previous: 'O Mua',
      change: 'panoni',
      improving: 'Kei te Pai Ake',
      worsening: 'Kei te Kino Ake',
      stable: 'Tūmau',
      insufficient_data: 'Kāore he Raraunga',
      improvingMessage: 'Pai rawa! Kei te pai ake ō kaute i ngā wā katoa.',
      worseningMessage: 'Kua piki ake ō kaute. Me whakaaro ki te tūhono ki tētahi kaimahi hauora mēnā e hiahia ana.',
      insufficientDataMessage: 'Me whakaoti ētahi atu aromatawai kia kite i tō ahunga whakamua.',
    },
  };

  return translations[locale] || translations.en;
}

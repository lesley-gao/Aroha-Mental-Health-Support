/**
 * ScoreSummary Component
 * Displays current score, trend, and statistics for PHQ-9 assessments
 */

import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { ScoreSummary } from '../../utils/chartUtils';
import { getSeverityColor, getSeverityLabel } from '../../utils/chartUtils';

interface ScoreSummaryProps {
  summary: ScoreSummary;
  currentSeverity: string;
  locale?: string;
}

export function ScoreSummaryCard({ summary, currentSeverity, locale = 'en' }: ScoreSummaryProps) {
  const t = getTranslations(locale);

  // Trend icon and color
  const getTrendDisplay = () => {
    switch (summary.trend) {
      case 'improving':
        return {
          icon: <TrendingDown className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          text: t.improving,
        };
      case 'worsening':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          text: t.worsening,
        };
      case 'stable':
        return {
          icon: <Minus className="w-5 h-5" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          text: t.stable,
        };
      default:
        return {
          icon: <Minus className="w-5 h-5" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          text: t.insufficient_data,
        };
    }
  };

  const trendDisplay = getTrendDisplay();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t.title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Score */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t.currentScore}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.current ?? '—'}
          </p>
          {summary.current !== null && (
            <p className="text-sm mt-1" style={{ color: getSeverityColor(currentSeverity) }}>
              {getSeverityLabel(currentSeverity)}
            </p>
          )}
        </div>

        {/* Trend */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t.trend}
          </p>
          <div className={`flex items-center gap-2 ${trendDisplay.color}`}>
            {trendDisplay.icon}
            <span className="text-lg font-semibold">{trendDisplay.text}</span>
          </div>
          {summary.trendPercentage > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {summary.trendPercentage}% {t.change}
            </p>
          )}
        </div>

        {/* Average Score */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t.averageScore}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {summary.average.toFixed(1)}
          </p>
          {summary.previous !== null && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t.previous}: {summary.previous}
            </p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {summary.trend === 'improving' && (
        <div className={`mt-4 p-3 rounded-lg ${trendDisplay.bgColor}`}>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💚 {t.improvingMessage}
          </p>
        </div>
      )}

      {summary.trend === 'worsening' && (
        <div className={`mt-4 p-3 rounded-lg ${trendDisplay.bgColor}`}>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ⚠️ {t.worseningMessage}
          </p>
        </div>
      )}

      {summary.trend === 'insufficient_data' && (
        <div className={`mt-4 p-3 rounded-lg ${trendDisplay.bgColor}`}>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ℹ️ {t.insufficientDataMessage}
          </p>
        </div>
      )}
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
      currentScore: 'Current Score',
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

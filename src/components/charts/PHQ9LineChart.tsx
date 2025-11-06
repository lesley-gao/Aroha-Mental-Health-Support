/**
 * PHQ9LineChart Component
 * Displays PHQ-9 scores over time with severity color zones
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ChartDataPoint } from '../../utils/chartUtils';
import { getSeverityColor } from '../../utils/chartUtils';

interface PHQ9LineChartProps {
  data: ChartDataPoint[];
  locale?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
}

export function PHQ9LineChart({ data, locale = 'en' }: PHQ9LineChartProps) {
  const t = getTranslations(locale);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {dataPoint.formattedDate}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.score}: <span className="font-semibold">{dataPoint.score}</span>
          </p>
          <p className="text-sm" style={{ color: getSeverityColor(dataPoint.severity) }}>
            {getSeverityLabel(dataPoint.severity, locale)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          {/* Severity Reference Lines */}
          <ReferenceLine y={5} stroke="#10b981" strokeDasharray="3 3" label={{ value: t.minimal, position: 'right', fill: '#10b981', fontSize: 12 }} />
          <ReferenceLine y={10} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: t.mild, position: 'right', fill: '#3b82f6', fontSize: 12 }} />
          <ReferenceLine y={15} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: t.moderate, position: 'right', fill: '#f59e0b', fontSize: 12 }} />
          <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label={{ value: t.moderately_severe, position: 'right', fill: '#ef4444', fontSize: 12 }} />
          
          <XAxis 
            dataKey="formattedDate" 
            stroke="#6b7280"
            style={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 27]} 
            stroke="#6b7280"
            style={{ fontSize: 12 }}
            label={{ value: t.score, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={{ fill: '#8b5cf6', r: 5 }}
            activeDot={{ r: 8 }}
            name={t.phq9Score}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Helper function for severity labels
function getSeverityLabel(severity: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    en: {
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      moderately_severe: 'Moderately Severe',
      severe: 'Severe',
    },
    mi: {
      minimal: 'Iti',
      mild: 'Māmā',
      moderate: 'Waenga',
      moderately_severe: 'Tino Waenga',
      severe: 'Tino Taumaha',
    },
  };

  return labels[locale]?.[severity.toLowerCase()] || severity;
}

// Translations
function getTranslations(locale: string) {
  interface Translations {
    score: string;
    minimal: string;
    mild: string;
    moderate: string;
    moderately_severe: string;
    phq9Score: string;
  }

  const translations: Record<string, Translations> = {
    en: {
      score: 'Score',
      minimal: 'Minimal',
      mild: 'Mild',
      moderate: 'Moderate',
      moderately_severe: 'Mod. Severe',
      phq9Score: 'PHQ-9 Score',
    },
    mi: {
      score: 'Kaute',
      minimal: 'Iti',
      mild: 'Māmā',
      moderate: 'Waenga',
      moderately_severe: 'Tino Waenga',
      phq9Score: 'Kaute PHQ-9',
    },
  };

  return translations[locale] || translations.en;
}

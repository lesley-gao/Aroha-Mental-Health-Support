/**
 * Chart Utilities for PHQ-9 Data Visualization
 * Transforms PHQ-9 records into formats suitable for Recharts components
 */

import type { PHQ9RecordDB } from '../lib/supabase';

// Type definitions for chart data
export interface ChartDataPoint {
  date: string;
  score: number;
  severity: string;
  formattedDate: string;
}

export interface ScoreSummary {
  current: number | null;
  previous: number | null;
  average: number;
  trend: 'improving' | 'worsening' | 'stable' | 'insufficient_data';
  trendPercentage: number;
}

/**
 * Transform PHQ-9 records into chart-ready data points
 * Sorts by date ascending (oldest first) for proper line chart display
 */
export function transformToChartData(records: PHQ9RecordDB[]): ChartDataPoint[] {
  if (!records || records.length === 0) {
    return [];
  }

  // Sort by date ascending
  const sorted = [...records].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return sorted.map((record) => ({
    date: record.created_at,
    score: record.total,
    severity: record.severity,
    formattedDate: formatChartDate(record.created_at),
  }));
}

/**
 * Format date for chart display based on data density
 * - If < 30 days span: Show full date (e.g., "Jan 15")
 * - If >= 30 days span: Show abbreviated (e.g., "1/15")
 */
export function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

/**
 * Calculate score summary statistics
 * Includes current, previous, average, and trend analysis
 */
export function calculateScoreSummary(records: PHQ9RecordDB[]): ScoreSummary {
  if (!records || records.length === 0) {
    return {
      current: null,
      previous: null,
      average: 0,
      trend: 'insufficient_data',
      trendPercentage: 0,
    };
  }

  // Sort by date descending to get most recent first
  const sorted = [...records].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const current = sorted[0].total;
  const previous = sorted.length > 1 ? sorted[1].total : null;
  
  // Calculate average
  const sum = records.reduce((acc, record) => acc + record.total, 0);
  const average = Math.round((sum / records.length) * 10) / 10; // Round to 1 decimal

  // Calculate trend
  let trend: 'improving' | 'worsening' | 'stable' | 'insufficient_data' = 'insufficient_data';
  let trendPercentage = 0;

  if (previous !== null) {
    const difference = current - previous;
    
    if (difference < -2) {
      trend = 'improving'; // Score decreased by more than 2
      trendPercentage = Math.round(Math.abs((difference / previous) * 100));
    } else if (difference > 2) {
      trend = 'worsening'; // Score increased by more than 2
      trendPercentage = Math.round((difference / previous) * 100);
    } else {
      trend = 'stable'; // Change is within ±2 points
      trendPercentage = 0;
    }
  }

  return {
    current,
    previous,
    average,
    trend,
    trendPercentage,
  };
}

/**
 * Get severity color for charts
 * Returns consistent colors across all visualizations
 */
export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'minimal':
      return '#10b981'; // green-500
    case 'mild':
      return '#3b82f6'; // blue-500
    case 'moderate':
      return '#f59e0b'; // amber-500
    case 'moderately_severe':
      return '#ef4444'; // red-500
    case 'severe':
      return '#dc2626'; // red-600
    default:
      return '#6b7280'; // gray-500
  }
}

/**
 * Get severity label for display
 * Handles underscores and capitalization
 */
export function getSeverityLabel(severity: string): string {
  return severity
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Filter records by date range
 * Useful for "Last 30 days", "Last 90 days" filters
 */
export function filterRecordsByDateRange(
  records: PHQ9RecordDB[],
  days: number
): PHQ9RecordDB[] {
  if (!records || records.length === 0) {
    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return records.filter(
    (record) => new Date(record.created_at) >= cutoffDate
  );
}

/**
 * Group records by month for monthly averages
 * Useful for long-term trend analysis
 */
export function groupRecordsByMonth(records: PHQ9RecordDB[]): {
  month: string;
  average: number;
  count: number;
}[] {
  if (!records || records.length === 0) {
    return [];
  }

  const grouped = new Map<string, { sum: number; count: number }>();

  records.forEach((record) => {
    const date = new Date(record.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const existing = grouped.get(monthKey) || { sum: 0, count: 0 };
    grouped.set(monthKey, {
      sum: existing.sum + record.total,
      count: existing.count + 1,
    });
  });

  return Array.from(grouped.entries())
    .map(([month, data]) => ({
      month,
      average: Math.round((data.sum / data.count) * 10) / 10,
      count: data.count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

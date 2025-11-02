/**
 * Severity calculation utilities for PHQ-9 scores
 * Based on standard PHQ-9 severity thresholds
 */

export type SeverityLevel = 'Minimal' | 'Mild' | 'Moderate' | 'Moderately severe' | 'Severe';

/**
 * Calculate PHQ-9 severity based on total score
 * 
 * Thresholds:
 * - 0-4: Minimal depression
 * - 5-9: Mild depression
 * - 10-14: Moderate depression
 * - 15-19: Moderately severe depression
 * - 20-27: Severe depression
 * 
 * @param total - PHQ-9 total score (0-27)
 * @returns Severity level as string
 */
export function getSeverity(total: number): SeverityLevel {
  if (total >= 20) {
    return 'Severe';
  } else if (total >= 15) {
    return 'Moderately severe';
  } else if (total >= 10) {
    return 'Moderate';
  } else if (total >= 5) {
    return 'Mild';
  } else {
    return 'Minimal';
  }
}

/**
 * Check if score warrants a nudge message (score >= 10)
 * @param total - PHQ-9 total score
 * @returns true if nudge should be shown
 */
export function shouldShowNudge(total: number): boolean {
  return total >= 10;
}

/**
 * Check if score warrants escalation/crisis resources (score >= 15)
 * @param total - PHQ-9 total score
 * @returns true if escalation should be triggered
 */
export function shouldEscalate(total: number): boolean {
  return total >= 15;
}

/**
 * Get color code for severity level (for UI styling)
 * @param severity - The severity level
 * @returns Tailwind color class
 */
export function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'Minimal':
      return 'text-green-600';
    case 'Mild':
      return 'text-yellow-600';
    case 'Moderate':
      return 'text-orange-600';
    case 'Moderately severe':
      return 'text-red-600';
    case 'Severe':
      return 'text-red-700';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get background color for severity level (for UI styling)
 * @param severity - The severity level
 * @returns Tailwind background color class
 */
export function getSeverityBgColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'Minimal':
      return 'bg-green-50';
    case 'Mild':
      return 'bg-yellow-50';
    case 'Moderate':
      return 'bg-orange-50';
    case 'Moderately severe':
      return 'bg-red-50';
    case 'Severe':
      return 'bg-red-100';
    default:
      return 'bg-gray-50';
  }
}

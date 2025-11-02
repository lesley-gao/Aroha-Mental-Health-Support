/**
 * Unit tests for PHQ-9 severity calculation
 * Tests the getSeverity function that maps total scores to clinical severity levels
 */

import { getSeverity } from '../utils/severity';

describe('getSeverity', () => {
  describe('severity thresholds', () => {
    it('should return "Minimal" for score 0', () => {
      expect(getSeverity(0)).toBe('Minimal');
    });

    it('should return "Minimal" for scores 1-4', () => {
      expect(getSeverity(1)).toBe('Minimal');
      expect(getSeverity(2)).toBe('Minimal');
      expect(getSeverity(3)).toBe('Minimal');
      expect(getSeverity(4)).toBe('Minimal');
    });

    it('should return "Mild" for scores 5-9', () => {
      expect(getSeverity(5)).toBe('Mild');
      expect(getSeverity(6)).toBe('Mild');
      expect(getSeverity(7)).toBe('Mild');
      expect(getSeverity(8)).toBe('Mild');
      expect(getSeverity(9)).toBe('Mild');
    });

    it('should return "Moderate" for scores 10-14', () => {
      expect(getSeverity(10)).toBe('Moderate');
      expect(getSeverity(11)).toBe('Moderate');
      expect(getSeverity(12)).toBe('Moderate');
      expect(getSeverity(13)).toBe('Moderate');
      expect(getSeverity(14)).toBe('Moderate');
    });

    it('should return "Moderately severe" for scores 15-19', () => {
      expect(getSeverity(15)).toBe('Moderately severe');
      expect(getSeverity(16)).toBe('Moderately severe');
      expect(getSeverity(17)).toBe('Moderately severe');
      expect(getSeverity(18)).toBe('Moderately severe');
      expect(getSeverity(19)).toBe('Moderately severe');
    });

    it('should return "Severe" for scores 20-27', () => {
      expect(getSeverity(20)).toBe('Severe');
      expect(getSeverity(21)).toBe('Severe');
      expect(getSeverity(22)).toBe('Severe');
      expect(getSeverity(23)).toBe('Severe');
      expect(getSeverity(24)).toBe('Severe');
      expect(getSeverity(25)).toBe('Severe');
      expect(getSeverity(26)).toBe('Severe');
      expect(getSeverity(27)).toBe('Severe');
    });
  });

  describe('boundary conditions', () => {
    it('should handle minimum boundary (0)', () => {
      expect(getSeverity(0)).toBe('Minimal');
    });

    it('should handle maximum boundary (27)', () => {
      expect(getSeverity(27)).toBe('Severe');
    });

    it('should handle nudge threshold boundary (10)', () => {
      expect(getSeverity(9)).toBe('Mild');
      expect(getSeverity(10)).toBe('Moderate');
    });

    it('should handle escalation threshold boundary (15)', () => {
      expect(getSeverity(14)).toBe('Moderate');
      expect(getSeverity(15)).toBe('Moderately severe');
    });

    it('should handle severe threshold boundary (20)', () => {
      expect(getSeverity(19)).toBe('Moderately severe');
      expect(getSeverity(20)).toBe('Severe');
    });
  });

  describe('clinical interpretation validation', () => {
    it('should map scores correctly for treatment recommendations', () => {
      // Minimal: No treatment typically needed
      expect(getSeverity(4)).toBe('Minimal');
      
      // Mild: Watchful waiting, education
      expect(getSeverity(7)).toBe('Mild');
      
      // Moderate: Consider treatment (nudge threshold)
      expect(getSeverity(12)).toBe('Moderate');
      
      // Moderately severe: Active treatment warranted (escalation threshold)
      expect(getSeverity(17)).toBe('Moderately severe');
      
      // Severe: Immediate treatment, possible hospitalization
      expect(getSeverity(24)).toBe('Severe');
    });
  });

  describe('edge cases', () => {
    it('should handle negative scores gracefully', () => {
      // While not expected in normal use, test defensive behavior
      expect(getSeverity(-1)).toBe('Minimal');
    });

    it('should handle scores above maximum', () => {
      // Test defensive behavior for invalid input
      expect(getSeverity(30)).toBe('Severe');
    });
  });

  describe('consistency checks', () => {
    it('should return consistent results for same input', () => {
      const score = 12;
      expect(getSeverity(score)).toBe(getSeverity(score));
    });

    it('should return string type', () => {
      expect(typeof getSeverity(10)).toBe('string');
    });

    it('should never return empty string', () => {
      for (let score = 0; score <= 27; score++) {
        expect(getSeverity(score).length).toBeGreaterThan(0);
      }
    });

    it('should return one of five valid severity levels', () => {
      const validSeverities = ['Minimal', 'Mild', 'Moderate', 'Moderately severe', 'Severe'];
      
      for (let score = 0; score <= 27; score++) {
        expect(validSeverities).toContain(getSeverity(score));
      }
    });
  });
});

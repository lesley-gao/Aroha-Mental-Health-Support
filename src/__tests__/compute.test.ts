/**
 * Unit tests for PHQ-9 computation logic
 * Tests the computePHQ9Total function that sums answers to calculate depression score
 */

describe('computePHQ9Total', () => {
  /**
   * Helper function to compute PHQ-9 total score
   * This mirrors the logic in src/pages/PHQ9.tsx
   */
  const computePHQ9Total = (answers: (number | null)[]): number => {
    return answers.reduce((sum, answer) => (sum ?? 0) + (answer ?? 0), 0) as number;
  };

  describe('valid score calculations', () => {
    it('should return 0 for all zeros', () => {
      const answers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      expect(computePHQ9Total(answers)).toBe(0);
    });

    it('should return 27 for all maximum scores', () => {
      const answers = [3, 3, 3, 3, 3, 3, 3, 3, 3];
      expect(computePHQ9Total(answers)).toBe(27);
    });

    it('should correctly sum mixed scores', () => {
      const answers = [0, 1, 2, 3, 0, 1, 2, 3, 1];
      expect(computePHQ9Total(answers)).toBe(13);
    });

    it('should calculate score for minimal depression (1-4)', () => {
      const answers = [0, 0, 0, 1, 0, 0, 1, 0, 0];
      expect(computePHQ9Total(answers)).toBe(2);
    });

    it('should calculate score for mild depression (5-9)', () => {
      const answers = [1, 1, 0, 1, 0, 1, 1, 1, 1];
      expect(computePHQ9Total(answers)).toBe(7);
    });

    it('should calculate score for moderate depression (10-14)', () => {
      const answers = [1, 2, 1, 2, 1, 1, 2, 1, 1];
      expect(computePHQ9Total(answers)).toBe(12);
    });

    it('should calculate score for moderately severe depression (15-19)', () => {
      const answers = [2, 2, 2, 2, 2, 2, 2, 1, 1];
      expect(computePHQ9Total(answers)).toBe(16);
    });

    it('should calculate score for severe depression (20-27)', () => {
      const answers = [3, 3, 2, 3, 2, 3, 2, 2, 3];
      expect(computePHQ9Total(answers)).toBe(23);
    });
  });

  describe('edge cases', () => {
    it('should handle null values as 0', () => {
      const answers = [null, 1, null, 2, null, 1, null, 0, 1];
      expect(computePHQ9Total(answers)).toBe(5);
    });

    it('should handle all null values', () => {
      const answers = [null, null, null, null, null, null, null, null, null];
      expect(computePHQ9Total(answers)).toBe(0);
    });

    it('should handle mix of null and valid values', () => {
      const answers = [3, null, 2, null, 1, null, 0, null, 3];
      expect(computePHQ9Total(answers)).toBe(9);
    });
  });

  describe('boundary conditions', () => {
    it('should handle single non-zero answer', () => {
      const answers = [0, 0, 0, 0, 1, 0, 0, 0, 0];
      expect(computePHQ9Total(answers)).toBe(1);
    });

    it('should handle threshold for nudge (score = 10)', () => {
      const answers = [1, 1, 1, 1, 1, 1, 1, 1, 2];
      expect(computePHQ9Total(answers)).toBe(10);
    });

    it('should handle threshold for escalation (score = 15)', () => {
      const answers = [2, 2, 2, 2, 2, 1, 1, 1, 2];
      expect(computePHQ9Total(answers)).toBe(15);
    });

    it('should handle threshold for severe (score = 20)', () => {
      const answers = [3, 2, 2, 3, 2, 2, 2, 2, 2];
      expect(computePHQ9Total(answers)).toBe(20);
    });
  });

  describe('array validation', () => {
    it('should handle exactly 9 items', () => {
      const answers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      expect(answers).toHaveLength(9);
      expect(computePHQ9Total(answers)).toBe(9);
    });

    it('should work with sparse arrays', () => {
      const answers = new Array(9).fill(0);
      answers[4] = 3;
      expect(computePHQ9Total(answers)).toBe(3);
    });
  });

  describe('score ranges validation', () => {
    it('should never exceed maximum score of 27', () => {
      const maxAnswers = [3, 3, 3, 3, 3, 3, 3, 3, 3];
      const total = computePHQ9Total(maxAnswers);
      expect(total).toBeLessThanOrEqual(27);
    });

    it('should never be negative', () => {
      const minAnswers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const total = computePHQ9Total(minAnswers);
      expect(total).toBeGreaterThanOrEqual(0);
    });

    it('should always return an integer', () => {
      const answers = [1, 2, 1, 2, 1, 2, 1, 2, 1];
      const total = computePHQ9Total(answers);
      expect(Number.isInteger(total)).toBe(true);
    });
  });
});

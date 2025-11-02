/**
 * End-to-End tests for Aroha MVP - PHQ-9 User Journey
 * 
 * Tests the complete user flow:
 * 1. Consent modal on first visit
 * 2. Language selection
 * 3. PHQ-9 assessment completion
 * 4. History viewing
 * 5. PDF export
 * 6. Data management
 */

import { test, expect } from '@playwright/test';

// Helper function to clear localStorage before tests
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('First-time User Flow', () => {
  test('should show consent modal on first visit', async ({ page }) => {
    await page.goto('/');
    
    // Consent modal should be visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/Your data is stored locally/i)).toBeVisible();
    
    // Should have "I Consent" button
    const consentButton = page.getByRole('button', { name: /I Consent/i });
    await expect(consentButton).toBeVisible();
    
    // Click consent
    await consentButton.click();
    
    // Modal should close
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should not show consent modal on subsequent visits', async ({ page }) => {
    // First visit - give consent
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
    
    // Reload page
    await page.reload();
    
    // Consent modal should not appear
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('Language Selection', () => {
  test('should switch to te reo Māori', async ({ page }) => {
    await page.goto('/');
    
    // Dismiss consent modal
    await page.getByRole('button', { name: /I Consent/i }).click();
    
    // Navigate to Settings
    await page.getByRole('button', { name: /Settings/i }).click();
    
    // Select te reo Māori
    await page.getByLabel('te reo Māori').click();
    
    // Navigate back to PHQ-9 page
    await page.getByRole('button', { name: /PHQ-9/i }).first().click();
    
    // Verify Māori text is displayed
    await expect(page.getByText(/Kia ora/i)).toBeVisible();
  });

  test('should persist language preference', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
    
    // Change to Māori
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByLabel('te reo Māori').click();
    
    // Reload page
    await page.reload();
    
    // Navigate to Settings
    await page.getByRole('button', { name: /Settings/i }).click();
    
    // Māori should still be selected
    await expect(page.getByLabel('te reo Māori')).toBeChecked();
  });
});

test.describe('PHQ-9 Assessment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
  });

  test('should complete PHQ-9 assessment with minimal score', async ({ page }) => {
    // Navigate to PHQ-9 (default page)
    await expect(page.getByText(/PHQ-9 Depression Screening/i)).toBeVisible();
    
    // Answer all 9 questions with "Not at all" (value 0)
    const radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    expect(radioButtons.length).toBe(9);
    
    for (const radio of radioButtons) {
      await radio.click();
    }
    
    // Submit form
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Should show success message and score
    await expect(page.getByText(/Total Score: 0/i)).toBeVisible();
    await expect(page.getByText(/Severity: Minimal/i)).toBeVisible();
  });

  test('should complete PHQ-9 assessment with moderate score', async ({ page }) => {
    // Answer questions to get score of 12 (moderate)
    const questions = await page.locator('[role="radiogroup"]').all();
    
    // Answer pattern: [1, 2, 1, 2, 1, 1, 2, 1, 1] = 12
    const answers = [1, 2, 1, 2, 1, 1, 2, 1, 1];
    
    for (let i = 0; i < questions.length; i++) {
      const radios = await questions[i].getByRole('radio').all();
      await radios[answers[i]].click();
    }
    
    // Submit
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Verify score
    await expect(page.getByText(/Total Score: 12/i)).toBeVisible();
    await expect(page.getByText(/Severity: Moderate/i)).toBeVisible();
    
    // Should show nudge message (score >= 10)
    await expect(page.getByText(/consider.*mindfulness/i)).toBeVisible();
  });

  test('should show escalation banner for high score', async ({ page }) => {
    // Answer all questions with maximum score (3)
    const radioButtons = await page.getByRole('radio').all();
    
    // Click every 4th radio button (value 3 - "Nearly every day")
    for (let i = 3; i < radioButtons.length; i += 4) {
      await radioButtons[i].click();
    }
    
    // Submit
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Should show high score
    await expect(page.getByText(/Total Score: 27/i)).toBeVisible();
    await expect(page.getByText(/Severity: Severe/i)).toBeVisible();
    
    // Should show escalation banner with crisis resources (score >= 15)
    await expect(page.getByText(/crisis/i)).toBeVisible();
    await expect(page.getByText(/0800 543 354/i)).toBeVisible(); // Lifeline
  });

  test('should require all questions to be answered', async ({ page }) => {
    // Try to submit without answering
    const submitButton = page.getByRole('button', { name: /Submit/i });
    await expect(submitButton).toBeDisabled();
    
    // Answer 8 out of 9 questions
    const radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    
    for (let i = 0; i < 8; i++) {
      await radioButtons[i].click();
    }
    
    // Submit button should still be disabled
    await expect(submitButton).toBeDisabled();
    
    // Answer the last question
    await radioButtons[8].click();
    
    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('History and Records', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
  });

  test('should display submitted assessment in history', async ({ page }) => {
    // Complete assessment
    const radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    for (const radio of radioButtons) {
      await radio.click();
    }
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Navigate to History
    await page.getByRole('button', { name: /History/i }).click();
    
    // Should show the record
    await expect(page.getByText(/Total Score: 0/i)).toBeVisible();
    await expect(page.getByText(/Severity: Minimal/i)).toBeVisible();
    
    // Should show timestamp
    await expect(page.getByText(/\d{4}-\d{2}-\d{2}/)).toBeVisible();
  });

  test('should show multiple assessments in history', async ({ page }) => {
    // Complete first assessment (score 0)
    let radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    for (const radio of radioButtons) {
      await radio.click();
    }
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Navigate back to PHQ-9
    await page.getByRole('button', { name: /PHQ-9/i }).first().click();
    
    // Complete second assessment (score 9)
    radioButtons = await page.getByRole('radio', { name: /Several days/i }).all();
    for (const radio of radioButtons) {
      await radio.click();
    }
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Navigate to History
    await page.getByRole('button', { name: /History/i }).click();
    
    // Should show both records
    const scoreElements = await page.getByText(/Total Score: \d+/).all();
    expect(scoreElements.length).toBeGreaterThanOrEqual(2);
  });

  test('should export PDF from history', async ({ page }) => {
    // Complete an assessment
    const radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    for (const radio of radioButtons) {
      await radio.click();
    }
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Navigate to History
    await page.getByRole('button', { name: /History/i }).click();
    
    // Click Export PDF button
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export.*PDF/i }).click();
    
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/phq9.*\.pdf/i);
  });
});

test.describe('Data Management and Privacy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
  });

  test('should delete all data', async ({ page }) => {
    // Complete an assessment
    const radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    for (const radio of radioButtons) {
      await radio.click();
    }
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Navigate to Settings then Privacy
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByRole('link', { name: /Privacy/i }).click();
    
    // Click Delete my data
    await page.getByRole('button', { name: /Delete.*data/i }).click();
    
    // Confirm deletion (if there's a confirmation dialog)
    const confirmButton = page.getByRole('button', { name: /Confirm|Yes|Delete/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Navigate to History
    await page.getByRole('button', { name: /History/i }).click();
    
    // Should show empty state
    await expect(page.getByText(/No.*records|empty/i)).toBeVisible();
  });

  test('should export JSON data', async ({ page }) => {
    // Complete an assessment
    const radioButtons = await page.getByRole('radio', { name: /Not at all/i }).all();
    for (const radio of radioButtons) {
      await radio.click();
    }
    await page.getByRole('button', { name: /Submit/i }).click();
    
    // Navigate to Privacy
    await page.getByRole('button', { name: /Settings/i }).click();
    await page.getByRole('link', { name: /Privacy/i }).click();
    
    // Click Export JSON
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export.*JSON/i }).click();
    
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/\.json$/i);
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through elements
    await page.keyboard.press('Tab'); // Skip to main link
    await page.keyboard.press('Tab'); // First nav button
    await page.keyboard.press('Tab'); // Second nav button
    await page.keyboard.press('Tab'); // Third nav button
    
    // Should be able to activate with Enter
    await page.keyboard.press('Enter');
    
    // Focus should be visible (check for focus ring)
    const focused = await page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    // Navigation should have role
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    // Main content should have role
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
    
    // Radio groups should have proper labels
    const radioGroups = await page.getByRole('radiogroup').all();
    expect(radioGroups.length).toBe(9);
  });

  test('should support skip-to-main link', async ({ page }) => {
    // Focus on body
    await page.locator('body').focus();
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Skip link should be focused
    const skipLink = page.getByRole('link', { name: /Skip to main/i });
    await expect(skipLink).toBeFocused();
    
    // Activate skip link
    await page.keyboard.press('Enter');
    
    // Main content should be focused
    const main = page.getByRole('main');
    await expect(main).toBeFocused();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
    
    // Navigation should be visible
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Questions should be visible and scrollable
    await expect(page.getByText(/Little interest/i)).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    await page.goto('/');
    await page.getByRole('button', { name: /I Consent/i }).click();
    
    // Content should be properly sized
    await expect(page.getByRole('main')).toBeVisible();
  });
});

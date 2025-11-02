/**
 * PDF export utilities for PHQ-9 assessment records
 * Uses jsPDF to generate downloadable PDF summaries
 */

import jsPDF from 'jspdf';
import { type PHQ9Record } from './storage';

/**
 * Generate and download a PDF summary of PHQ-9 assessment records
 * @param records - Array of PHQ9Record objects to include in the PDF
 * @param locale - Language locale for header text ('en' or 'mi')
 */
export function generatePDF(records: PHQ9Record[], locale: 'en' | 'mi' = 'en'): void {
  if (records.length === 0) {
    alert(locale === 'en' ? 'No records to export' : 'Kāore he rēkōtanga hei kaweake');
    return;
  }

  // Create new PDF document (A4 portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Helper to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(
    locale === 'en' ? 'PHQ-9 Assessment Summary' : 'Whakarāpopoto Aromatawai PHQ-9',
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 12;

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const now = new Date();
  const exportDate = now.toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(
    locale === 'en' ? `Exported: ${exportDate}` : `Kawea: ${exportDate}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 10;

  // Summary statistics
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'Summary Statistics' : 'Tātauranga Whakarāpopoto', margin, yPosition);
  yPosition += lineHeight;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const totalAssessments = records.length;
  const averageScore = (records.reduce((sum, r) => sum + r.total, 0) / totalAssessments).toFixed(1);
  const latestScore = records[0].total;
  const oldestScore = records[records.length - 1].total;
  const scoreChange = latestScore - oldestScore;
  
  doc.text(`${locale === 'en' ? 'Total assessments' : 'Aromatawai katoa'}: ${totalAssessments}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`${locale === 'en' ? 'Average score' : 'Kaute toharite'}: ${averageScore} / 27`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`${locale === 'en' ? 'Latest score' : 'Kaute hou rawa'}: ${latestScore} / 27`, margin, yPosition);
  yPosition += lineHeight;
  
  if (totalAssessments > 1) {
    const changeText = scoreChange > 0 
      ? `+${scoreChange}` 
      : scoreChange < 0 
      ? `${scoreChange}` 
      : '0';
    doc.text(
      `${locale === 'en' ? 'Change from first' : 'Rerekē mai i te tuatahi'}: ${changeText} ${locale === 'en' ? 'points' : 'piro'}`,
      margin,
      yPosition
    );
    yPosition += lineHeight;
  }
  
  yPosition += 5;

  // Disclaimer
  checkPageBreak(15);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  const disclaimer = locale === 'en'
    ? 'This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.'
    : 'He taputapu whakamōhiotanga anake tēnei, ehara i te whakakapi mō te tohutohu rata ngaio, te taumate, te maimoatanga rānei.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 2 * margin);
  doc.text(disclaimerLines, margin, yPosition);
  yPosition += disclaimerLines.length * 4 + 5;
  doc.setTextColor(0, 0, 0);

  // Assessment records header
  checkPageBreak(20);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'Assessment History' : 'Hītori Aromatawai', margin, yPosition);
  yPosition += lineHeight + 2;

  // Table header
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const col1 = margin;
  const col2 = margin + 15;
  const col3 = margin + 75;
  const col4 = margin + 100;
  const col5 = margin + 145;

  doc.text('#', col1, yPosition);
  doc.text(locale === 'en' ? 'Date' : 'Rā', col2, yPosition);
  doc.text(locale === 'en' ? 'Score' : 'Kaute', col3, yPosition);
  doc.text(locale === 'en' ? 'Severity' : 'Taimaha', col4, yPosition);
  doc.text(locale === 'en' ? 'Answers' : 'Whakautu', col5, yPosition);
  yPosition += 1;

  // Draw line under header
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // Records
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  records.forEach((record, index) => {
    checkPageBreak(12);

    const recordNum = (index + 1).toString();
    const date = new Date(record.createdAt);
    const dateStr = date.toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const score = `${record.total}/27`;
    const severity = getSeverityTranslation(record.severity, locale);
    const answers = record.answers.join(', ');

    doc.text(recordNum, col1, yPosition);
    doc.text(dateStr, col2, yPosition);
    doc.text(score, col3, yPosition);
    doc.text(severity, col4, yPosition);
    
    // Wrap answers if too long
    const answersText = doc.splitTextToSize(answers, pageWidth - col5 - margin);
    doc.text(answersText, col5, yPosition);
    
    yPosition += Math.max(lineHeight, answersText.length * 4);
  });

  // Footer on last page
  yPosition = pageHeight - margin + 5;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    locale === 'en' 
      ? 'Generated by Aroha - Mental Health Support Tool' 
      : 'Kua hangahia e Aroha - Taputapu Tautoko Hauora Hinengaro',
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );

  // Generate filename with timestamp
  const timestamp = now.toISOString().split('T')[0];
  const filename = `phq9-summary-${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
}

/**
 * Get translated severity label
 */
function getSeverityTranslation(severity: string, locale: 'en' | 'mi'): string {
  if (locale === 'mi') {
    switch (severity) {
      case 'Minimal': return 'Iti rawa';
      case 'Mild': return 'Māmā';
      case 'Moderate': return 'Wāwāhi';
      case 'Moderately severe': return 'Taimaha Wāwāhi';
      case 'Severe': return 'Taimaha';
      default: return severity;
    }
  }
  return severity;
}

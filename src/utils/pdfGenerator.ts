import { jsPDF } from 'jspdf';
import { DisputeAppealResult } from '../types/claim';

/**
 * Builds the official legal appeal letter PDF using jsPDF.
 */
export function buildAppealPdfDocument(appeal: DisputeAppealResult): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54; // 0.75 in
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const renderHeaderWatermark = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 160);
    doc.text('CLAIMLENS LEGAL DISPUTE ADVOCACY · FORMAL GRIEVANCE NOTICE', margin, 36);
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, 42, pageWidth - margin, 42);
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      y = margin;
      renderHeaderWatermark();
    }
  };

  renderHeaderWatermark();
  y = 60;

  // Top Legal Heading
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('FORMAL FIRST-LEVEL CLAIM APPEAL & GRIEVANCE NOTICE', margin, y);
  y += 20;

  doc.setDrawColor(37, 99, 235); // Blue-600
  doc.setLineWidth(1.5);
  doc.line(margin, y, margin + 180, y);
  y += 18;

  // Parse markdown content line by line
  const rawLines = appeal.appeal_letter_markdown.split('\n');

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (line.startsWith('# FORMAL FIRST-LEVEL')) {
      continue;
    }

    if (line.startsWith('### ')) {
      const headingText = line.replace('### ', '').replace(/\*\*/g, '');
      checkPageBreak(30);
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138); // blue-900
      doc.text(headingText, margin, y);
      y += 16;
      continue;
    }

    if (line.startsWith('---')) {
      checkPageBreak(15);
      y += 4;
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.75);
      doc.line(margin, y, margin + contentWidth, y);
      y += 12;
      continue;
    }

    if (line.length === 0) {
      y += 6;
      continue;
    }

    const plainText = line.replace(/\*\*/g, '');

    const isMetadataLine =
      line.startsWith('**Date:**') ||
      line.startsWith('**To:**') ||
      line.startsWith('**From:**') ||
      line.startsWith('**Policyholder') ||
      line.startsWith('**Claim Reference') ||
      line.startsWith('**Date of Service') ||
      line.startsWith('**Servicing Provider') ||
      line.startsWith('**Total Disputed') ||
      line.startsWith('**Denial Code');

    if (isMetadataLine) {
      checkPageBreak(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      const colonIndex = plainText.indexOf(':');
      if (colonIndex !== -1) {
        const label = plainText.substring(0, colonIndex + 1);
        const value = plainText.substring(colonIndex + 1).trim();
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, margin + 140, y);
      } else {
        doc.text(plainText, margin, y);
      }
      y += 14;
      continue;
    }

    // Regular paragraphs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);

    const splitParagraph = doc.splitTextToSize(plainText, contentWidth);
    const neededHeight = splitParagraph.length * 13;
    checkPageBreak(neededHeight);

    doc.text(splitParagraph, margin, y);
    y += neededHeight + 4;
  }

  // Page numbering
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${p} of ${totalPages} · Claim Reference #${appeal.claim_id}`,
      pageWidth / 2,
      pageHeight - 24,
      { align: 'center' }
    );
  }

  return doc;
}

export function downloadAppealPdf(appeal: DisputeAppealResult, fileName?: string): void {
  const doc = buildAppealPdfDocument(appeal);
  const name = fileName || `Appeal_Letter_Claim_${appeal.claim_id || 'Dispute'}.pdf`;
  doc.save(name);
}

export function getAppealPdfBase64(appeal: DisputeAppealResult): string {
  const doc = buildAppealPdfDocument(appeal);
  const dataUri = doc.output('datauristring');
  // data:application/pdf;filename=generated.pdf;base64,JVBERi0xLjM...
  const parts = dataUri.split(',');
  return parts.length > 1 ? parts[1] : '';
}

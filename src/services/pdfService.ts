import { jsPDF } from 'jspdf';
import { QuizResult } from '../types/quiz';

export function buildCertificateDoc(result: QuizResult): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = 297;
  const height = 210;

  // Background clean canvas
  doc.setFillColor(252, 253, 252);
  doc.rect(0, 0, width, height, 'F');

  // Outer institutional border - Dark Navy (#00324D)
  doc.setDrawColor(0, 50, 77);
  doc.setLineWidth(3);
  doc.rect(8, 8, width - 16, height - 16);

  // Inner border - Turquoise / SENA Green (#0097A7 / #39A900)
  doc.setDrawColor(0, 151, 167);
  doc.setLineWidth(1.2);
  doc.rect(12, 12, width - 24, height - 24);

  // Thin gold accent line
  doc.setDrawColor(217, 160, 23);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, width - 28, height - 28);

  // Top header banner background
  doc.setFillColor(0, 50, 77);
  doc.rect(14, 14, width - 28, 22, 'F');

  // Header Title Text in 100% ENGLISH
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('NATIONAL APPRENTICESHIP SERVICE — SENA', width / 2, 23, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 240, 245);
  doc.text('SENA GLOBAL CITY · BILINGUAL TRAINING INITIATIVE', width / 2, 30, { align: 'center' });

  // Main Award Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(0, 50, 77);
  doc.text('CERTIFICATE OF RECOGNITION', width / 2, 47, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 151, 167);
  doc.text('GLOBAL TOURISM DISTRICT', width / 2, 55, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text('"Discover · Welcome · Experience"', width / 2, 62, { align: 'center' });

  // "This certifies that"
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to officially certify that:', width / 2, 70, { align: 'center' });

  // Participant Name (Huge & Prestigious)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(0, 50, 77);
  doc.text(result.participantName.toUpperCase(), width / 2, 80, { align: 'center' });

  // Underline under participant name
  doc.setDrawColor(0, 151, 167);
  doc.setLineWidth(0.8);
  const nameWidth = Math.min(doc.getTextWidth(result.participantName.toUpperCase()) + 15, 160);
  doc.line(width / 2 - nameWidth / 2, 83, width / 2 + nameWidth / 2, 83);

  // Participant role & program
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85);
  const roleText = result.participantType === 'Aprendiz'
    ? `SENA Apprentice · Record / ID: ${result.ficha || 'N/A'}`
    : 'SENA Instructor · Professional Training Area';
  doc.text(roleText, width / 2, 89, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 50, 77);
  doc.text(`Topic / Specialization: ${result.program}`, width / 2, 95, { align: 'center' });

  // Photo slot or emblem on the left
  const photoX = 22;
  const photoY = 103;
  const photoW = 34;
  const photoH = 42;

  let hasCustomPhoto = false;
  if (result.photoUrl && result.photoUrl.startsWith('data:image/')) {
    try {
      const format = result.photoUrl.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(result.photoUrl, format, photoX, photoY, photoW, photoH);
      hasCustomPhoto = true;
    } catch (e) {
      console.warn('Could not render participant photo in PDF:', e);
    }
  }

  // Draw photo frame
  doc.setDrawColor(0, 151, 167);
  doc.setLineWidth(1);
  doc.rect(photoX, photoY, photoW, photoH);

  if (!hasCustomPhoto) {
    doc.setFillColor(240, 248, 250);
    doc.rect(photoX, photoY, photoW, photoH, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 151, 167);
    doc.text('GLOBAL', photoX + photoW / 2, photoY + photoH / 2 - 2, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('DISTRICT', photoX + photoW / 2, photoY + photoH / 2 + 3, { align: 'center' });
  }

  // Center Scorecard Box
  const cardX = 64;
  const cardY = 103;
  const cardW = width - cardX - 22; // spanning to right margin
  const cardH = 42;

  // Background for scorecard
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.roundedRect(cardX, cardY, cardW, cardH, 3, 3, 'FD');

  // Metric 1: Score
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL SCORE', cardX + 26, cardY + 9, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 50, 77);
  doc.text(`${result.totalScore} pts`, cardX + 26, cardY + 19, { align: 'center' });

  // Metric 2: Correct Answers
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CORRECT ANSWERS', cardX + 78, cardY + 9, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 151, 167);
  doc.text(`${result.correctAnswers} / ${result.totalQuestions}`, cardX + 78, cardY + 19, { align: 'center' });

  // Metric 3: Accuracy
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ACCURACY RATE', cardX + 130, cardY + 9, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 50, 77);
  doc.text(`${result.accuracyPercentage}%`, cardX + 130, cardY + 19, { align: 'center' });

  // Metric 4: Certified Level
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CERTIFIED LEVEL', cardX + 180, cardY + 9, { align: 'center' });

  // Level Badge color
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  if (result.level === 'ENGLISH MASTER') {
    doc.setTextColor(190, 130, 0);
  } else if (result.level === 'ENGLISH PRO') {
    doc.setTextColor(0, 140, 120);
  } else if (result.level === 'ENGLISH CHALLENGER') {
    doc.setTextColor(0, 100, 200);
  } else {
    doc.setTextColor(120, 50, 180);
  }
  doc.text(result.level, cardX + 180, cardY + 19, { align: 'center' });

  // Institutional evaluation statement inside scorecard (in 100% English)
  doc.setDrawColor(203, 213, 225);
  doc.line(cardX + 10, cardY + 25, cardX + cardW - 10, cardY + 25);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const recognitionSummary =
    `For outstanding participation and demonstrated proficiency in technical English vocabulary and professional communication within the Global Tourism District.`;
  doc.text(recognitionSummary, cardX + cardW / 2, cardY + 34, { align: 'center' });

  // Bottom section: Clean institutional seal and credential stamp in English
  const bottomY = 160;

  // Institutional Verification Seal in center
  doc.setFillColor(240, 249, 250);
  doc.setDrawColor(0, 151, 167);
  doc.setLineWidth(1);
  doc.circle(width / 2, bottomY + 12, 12, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 151, 167);
  doc.text('SENA GLOBAL', width / 2, bottomY + 10, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(0, 50, 77);
  doc.text('VERIFIED', width / 2, bottomY + 14, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(217, 160, 23);
  doc.text('★ ★ ★', width / 2, bottomY + 18, { align: 'center' });

  // Side decorative validation lines (replacing signature lines)
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(40, bottomY + 12, width / 2 - 20, bottomY + 12);
  doc.line(width / 2 + 20, bottomY + 12, width - 40, bottomY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 50, 77);
  doc.text('SPEAK · CREATE · CONNECT', width / 2, bottomY + 29, { align: 'center' });

  // Footer metadata in English
  const certDate = new Date(result.completedAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date of Issue: ${certDate}  ·  Credential Folio: GTD-${result.id.slice(0, 8).toUpperCase()}  ·  Colombia`, width / 2, height - 12, {
    align: 'center',
  });

  return doc;
}

export async function generateCertificatePDF(result: QuizResult): Promise<void> {
  const doc = buildCertificateDoc(result);
  const cleanName = result.participantName.trim().replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`GlobalTourismDistrict_Certificate_${cleanName}.pdf`);
}

export function getCertificateFileName(result: QuizResult): string {
  const cleanName = result.participantName.trim().replace(/[^a-zA-Z0-9]/g, '_');
  return `GlobalTourismDistrict_Certificate_${cleanName}.pdf`;
}

export async function generateCertificateFile(result: QuizResult): Promise<File> {
  const doc = buildCertificateDoc(result);
  const fileName = getCertificateFileName(result);
  const blob = doc.output('blob');
  return new File([blob], fileName, { type: 'application/pdf' });
}

/**
 * Generates an official PDF report of all participants:
 * - Nombre
 * - Nombre del programa / tema
 * - Puntaje
 * - Precisión
 * - Nivel
 * - Fecha de participación
 */
export async function generateParticipantsReportPDF(results: QuizResult[]): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = 297;
  const height = 210;
  const marginLeft = 14;
  const marginRight = 14;
  const usableWidth = width - marginLeft - marginRight; // 269mm

  // Sort participants by score descending, then accuracy descending
  const sorted = [...results].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.accuracyPercentage - a.accuracyPercentage;
  });

  const totalParticipants = sorted.length;
  const avgScore =
    totalParticipants > 0
      ? Math.round(sorted.reduce((acc, curr) => acc + curr.totalScore, 0) / totalParticipants)
      : 0;
  const avgAccuracy =
    totalParticipants > 0
      ? Math.round(sorted.reduce((acc, curr) => acc + curr.accuracyPercentage, 0) / totalParticipants)
      : 0;

  const nowFormatted = new Date().toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  interface TableCol {
    header: string;
    width: number;
    align: 'left' | 'center' | 'right';
  }

  // Table columns definition
  const columns: TableCol[] = [
    { header: '#', width: 14, align: 'center' },
    { header: 'Nombre del Participante', width: 62, align: 'left' },
    { header: 'Programa de Formación / Tema', width: 70, align: 'left' },
    { header: 'Puntaje', width: 28, align: 'center' },
    { header: 'Precisión', width: 24, align: 'center' },
    { header: 'Nivel', width: 36, align: 'center' },
    { header: 'Fecha de Participación', width: 35, align: 'center' },
  ];

  const drawPageHeader = (pageNumber: number, isFirstPage: boolean) => {
    // Top SENA Green Bar
    doc.setFillColor(57, 169, 0); // #39A900
    doc.rect(0, 0, width, 4, 'F');

    // Navy secondary line
    doc.setFillColor(0, 50, 77); // #00324D
    doc.rect(0, 4, width, 1.5, 'F');

    if (isFirstPage) {
      // Main Header Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 50, 77);
      doc.text('GLOBAL TOURISM DISTRICT · ENGLISH CHALLENGE', marginLeft, 13);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(57, 169, 0);
      doc.text('INFORME OFICIAL DE RESULTADOS Y PARTICIPANTES DEL STAND', marginLeft, 18.5);

      // Meta badge / Stats box on the right
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.roundedRect(width - marginRight - 105, 7.5, 105, 14, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Fecha de emisión: ${nowFormatted}`, width - marginRight - 102, 11.5);
      doc.text(
        `Total Participantes: ${totalParticipants}  ·  Promedio Puntaje: ${avgScore} pts  ·  Promedio Aciertos: ${avgAccuracy}%`,
        width - marginRight - 102,
        17.5
      );
    } else {
      // Compact page header on subsequent pages
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 50, 77);
      doc.text('GLOBAL TOURISM DISTRICT · INFORME OFICIAL DE RESULTADOS (Continuación)', marginLeft, 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Fecha de emisión: ${nowFormatted}`, width - marginRight, 10, { align: 'right' });
    }
  };

  const drawTableHeader = (startY: number) => {
    // Header background
    doc.setFillColor(0, 50, 77); // #00324D
    doc.rect(marginLeft, startY, usableWidth, 7.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    let curX = marginLeft;
    for (const col of columns) {
      if (col.align === 'center') {
        doc.text(col.header, curX + col.width / 2, startY + 5, { align: 'center' });
      } else if (col.align === 'right') {
        doc.text(col.header, curX + col.width - 2, startY + 5, { align: 'right' });
      } else {
        doc.text(col.header, curX + 2, startY + 5);
      }
      curX += col.width;
    }

    return startY + 7.5;
  };

  let currentY = 24;
  let pageIndex = 1;

  drawPageHeader(pageIndex, true);
  currentY = drawTableHeader(currentY);

  if (sorted.length === 0) {
    // Empty message row
    doc.setFillColor(255, 255, 255);
    doc.rect(marginLeft, currentY, usableWidth, 14, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginLeft, currentY, usableWidth, 14, 'S');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('No hay participantes registrados en el sistema.', width / 2, currentY + 8.5, {
      align: 'center',
    });
  } else {
    sorted.forEach((p, index) => {
      // Check if we need a new page
      if (currentY + 7.5 > height - 16) {
        doc.addPage();
        pageIndex++;
        drawPageHeader(pageIndex, false);
        currentY = drawTableHeader(14);
      }

      // Alternating row background
      const isAlt = index % 2 === 1;
      if (isAlt) {
        doc.setFillColor(248, 250, 252); // #f8fafc
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(marginLeft, currentY, usableWidth, 7, 'F');

      // Thin bottom border
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(marginLeft, currentY + 7, marginLeft + usableWidth, currentY + 7);

      let curX = marginLeft;

      // Col 1: Posición / Rank
      doc.setFont('helvetica', index < 3 ? 'bold' : 'normal');
      doc.setFontSize(8);
      if (index === 0) {
        doc.setTextColor(217, 160, 23); // Gold
        doc.text('1 *', curX + columns[0].width / 2, currentY + 4.8, { align: 'center' });
      } else if (index === 1) {
        doc.setTextColor(100, 116, 139); // Silver
        doc.text('2', curX + columns[0].width / 2, currentY + 4.8, { align: 'center' });
      } else if (index === 2) {
        doc.setTextColor(180, 83, 9); // Bronze
        doc.text('3', curX + columns[0].width / 2, currentY + 4.8, { align: 'center' });
      } else {
        doc.setTextColor(100, 116, 139);
        doc.text(`${index + 1}`, curX + columns[0].width / 2, currentY + 4.8, { align: 'center' });
      }
      curX += columns[0].width;

      // Col 2: Nombre del Participante
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42); // slate-900
      let nameText = p.participantName.trim();
      if (nameText.length > 34) {
        nameText = nameText.slice(0, 32) + '...';
      }
      doc.text(nameText, curX + 2, currentY + 4.8);
      curX += columns[1].width;

      // Col 3: Programa / Tema
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85); // slate-700
      let progText = p.program.trim();
      if (progText.length > 40) {
        progText = progText.slice(0, 38) + '...';
      }
      doc.text(progText, curX + 2, currentY + 4.8);
      curX += columns[2].width;

      // Col 4: Puntaje
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 50, 77);
      doc.text(`${p.totalScore} pts`, curX + columns[3].width / 2, currentY + 4.8, {
        align: 'center',
      });
      curX += columns[3].width;

      // Col 5: Precisión
      doc.setFont('helvetica', 'bold');
      if (p.accuracyPercentage >= 90) {
        doc.setTextColor(57, 169, 0); // SENA Green
      } else if (p.accuracyPercentage >= 70) {
        doc.setTextColor(14, 165, 233); // Cyan
      } else {
        doc.setTextColor(100, 116, 139);
      }
      doc.text(`${p.accuracyPercentage}%`, curX + columns[4].width / 2, currentY + 4.8, {
        align: 'center',
      });
      curX += columns[4].width;

      // Col 6: Nivel
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      if (p.level === 'ENGLISH MASTER') {
        doc.setTextColor(217, 119, 6);
      } else if (p.level === 'ENGLISH PRO') {
        doc.setTextColor(16, 185, 129);
      } else if (p.level === 'ENGLISH CHALLENGER') {
        doc.setTextColor(6, 182, 212);
      } else {
        doc.setTextColor(139, 92, 246);
      }
      doc.text(p.level, curX + columns[5].width / 2, currentY + 4.8, { align: 'center' });
      curX += columns[5].width;

      // Col 7: Fecha de Participación
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      const rowDate = p.completedAt
        ? new Date(p.completedAt).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A';
      doc.text(rowDate, curX + columns[6].width / 2, currentY + 4.8, { align: 'center' });

      currentY += 7;
    });
  }

  // Draw Page Footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Subtle footer separator
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, height - 10, width - marginRight, height - 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'SENA · Global Tourism District — Informe generado automáticamente desde la plataforma del stand',
      marginLeft,
      height - 6
    );

    doc.text(`Página ${i} de ${totalPages}`, width - marginRight, height - 6, {
      align: 'right',
    });
  }

  const fileDate = new Date().toISOString().slice(0, 10);
  doc.save(`GlobalTourismDistrict_Informe_Participantes_${fileDate}.pdf`);
}

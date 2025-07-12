import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { Contract } from '@shared/schema';

export async function generatePDF(contract: Contract, signatureData?: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const fontSize = 12;
  const titleFontSize = 20;
  const subtitleFontSize = 14;

  // Header background
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(0.02, 0.4, 0.8), // Blue header
  });

  // Platform logo area
  page.drawText("فلوس كاش", {
    x: width - 120,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page.drawText("FLOUS CASH", {
    x: width - 120,
    y: height - 75,
    size: 12,
    font: font,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Title
  page.drawText("عقد خدمة مالية رسمي", {
    x: width - 200,
    y: height - 100,
    size: titleFontSize,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // Contract details
  const contractData = contract.contractData as any;
  
  let yPos = height - 160;
  const lineHeight = 25;

  // Contract info box
  page.drawRectangle({
    x: 30,
    y: yPos - 20,
    width: width - 60,
    height: 200,
    color: rgb(0.97, 0.97, 0.97),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });

  page.drawText("بيانات العقد:", {
    x: width - 120,
    y: yPos,
    size: subtitleFontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPos -= 30;

  const getServiceType = (type: string) => {
    switch (type) {
      case 'funding': return 'تمويل';
      case 'investment': return 'استثمار';
      case 'saving': return 'ادخار';
      default: return type;
    }
  };

  const details = [
    { label: "رقم العقد", value: `FC-${contract.id.toString().padStart(6, '0')}` },
    { label: "التاريخ", value: new Date(contract.createdAt!).toLocaleDateString('ar-EG') },
    { label: "نوع الخدمة", value: getServiceType(contract.type) },
    { label: "الاسم الكامل", value: contractData.userName || 'غير محدد' },
    { label: "البريد الإلكتروني", value: contractData.userEmail || 'غير محدد' },
    { label: "المبلغ", value: `${contractData.amount || contractData.investmentAmount || 'غير محدد'} جنيه مصري` },
  ];

  if (contract.type === 'funding') {
    details.push({ label: "الغرض", value: contractData.purpose || 'غير محدد' });
    details.push({ label: "الدخل الشهري", value: `${contractData.monthlyIncome || 'غير محدد'} جنيه` });
  }

  if (contract.type === 'investment') {
    details.push({ label: "خطة الاستثمار", value: contractData.planName || 'غير محدد' });
    details.push({ label: "العائد المتوقع", value: `${contractData.expectedReturn || '40'}%` });
    details.push({ label: "المدة", value: `${contractData.duration || 10} أيام` });
  }

  details.forEach((detail) => {
    page.drawText(`${detail.label}: ${detail.value}`, {
      x: width - 450,
      y: yPos,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
    yPos -= lineHeight;
  });

  // Terms section
  yPos -= 40;
  page.drawText("الشروط والأحكام:", {
    x: width - 120,
    y: yPos,
    size: subtitleFontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPos -= 30;
  const terms = [
    "• يلتزم الطرف الثاني بسداد المبلغ في الموعد المحدد",
    "• جميع المعاملات محمية بموجب القانون المصري",
    "• العقد ساري المفعول من تاريخ التوقيع",
    "• للاستفسارات يرجى التواصل مع خدمة العملاء"
  ];

  terms.forEach((term) => {
    page.drawText(term, {
      x: width - 500,
      y: yPos,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });
    yPos -= 20;
  });

  // Signature section
  yPos -= 40;
  page.drawRectangle({
    x: 30,
    y: yPos - 80,
    width: width - 60,
    height: 100,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });

  page.drawText("التوقيع والختم:", {
    x: width - 120,
    y: yPos - 20,
    size: subtitleFontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  if (signatureData) {
    page.drawText(`التوقيع: ${signatureData}`, {
      x: width - 200,
      y: yPos - 50,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  // Digital stamp
  page.drawText("ختم رسمي", {
    x: 100,
    y: yPos - 50,
    size: 12,
    font: boldFont,
    color: rgb(0.8, 0, 0),
  });

  page.drawRectangle({
    x: 80,
    y: yPos - 70,
    width: 80,
    height: 40,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0, 0),
    borderWidth: 2,
  });

  // Footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 60,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText("منصة فلوس كاش - خدمات مالية موثوقة ومرخصة", {
    x: width - 250,
    y: 35,
    size: 10,
    font: font,
    color: rgb(1, 1, 1),
  });

  page.drawText("www.flouscash.com | support@flouscash.com", {
    x: width - 200,
    y: 20,
    size: 8,
    font: font,
    color: rgb(0.8, 0.8, 0.8),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
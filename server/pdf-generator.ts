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
  const margin = 50;
  
  // Header
  page.drawText('Flous Cash', {
    x: width / 2 - 50,
    y: height - margin,
    size: titleFontSize,
    font: boldFont,
    color: rgb(0.13, 0.55, 0.95), // Primary blue
  });
  
  page.drawText('عقد الخدمات المالية', {
    x: width / 2 - 70,
    y: height - margin - 30,
    size: 16,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  // Contract details
  let yPosition = height - margin - 80;
  const lineHeight = 25;
  
  const contractData = contract.contractData as any;
  
  // Contract ID
  page.drawText(`رقم العقد: ${contract.id}`, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: boldFont,
  });
  yPosition -= lineHeight;
  
  // Date
  page.drawText(`التاريخ: ${new Date(contract.createdAt!).toLocaleDateString('ar-EG')}`, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: font,
  });
  yPosition -= lineHeight * 2;
  
  // User information
  page.drawText('بيانات العميل:', {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: boldFont,
  });
  yPosition -= lineHeight;
  
  if (contractData.userName) {
    page.drawText(`الاسم: ${contractData.userName}`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
  }
  
  if (contractData.userEmail) {
    page.drawText(`البريد الإلكتروني: ${contractData.userEmail}`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
  }
  
  yPosition -= lineHeight;
  
  // Service details
  page.drawText('تفاصيل الخدمة:', {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: boldFont,
  });
  yPosition -= lineHeight;
  
  if (contract.type === 'funding') {
    page.drawText(`نوع الخدمة: طلب تمويل`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`المبلغ: ${contractData.amount} جنيه`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`الغرض: ${contractData.purpose}`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`الراتب الشهري: ${contractData.monthlyIncome} جنيه`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
  } else if (contract.type === 'investment') {
    page.drawText(`نوع الخدمة: خطة استثمارية`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`اسم الخطة: ${contractData.planName}`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`مبلغ الاستثمار: ${contractData.investmentAmount} جنيه`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`العائد المتوقع: ${contractData.expectedReturn}%`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
    
    page.drawText(`مدة الاستثمار: ${contractData.duration} شهر`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
    yPosition -= lineHeight;
  }
  
  yPosition -= lineHeight * 2;
  
  // Terms and conditions
  page.drawText('الشروط والأحكام:', {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: boldFont,
  });
  yPosition -= lineHeight;
  
  const terms = [
    '1. يلتزم العميل بتقديم المعلومات الصحيحة والكاملة',
    '2. تخضع جميع المعاملات لقوانين جمهورية مصر العربية',
    '3. يحق للشركة مراجعة الطلب والموافقة عليه أو رفضه',
    '4. العميل مسؤول عن سداد جميع المبالغ المستحقة في المواعيد المحددة',
    '5. هذا العقد ملزم لجميع الأطراف بمجرد التوقيع عليه',
  ];
  
  terms.forEach(term => {
    page.drawText(term, {
      x: margin + 20,
      y: yPosition,
      size: fontSize - 1,
      font: font,
    });
    yPosition -= lineHeight;
  });
  
  yPosition -= lineHeight * 2;
  
  // Signature section
  page.drawText('التوقيع:', {
    x: margin,
    y: yPosition,
    size: fontSize,
    font: boldFont,
  });
  yPosition -= lineHeight;
  
  if (signatureData) {
    page.drawText(`توقيع العميل: ${signatureData}`, {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
  } else {
    page.drawText('توقيع العميل: ________________', {
      x: margin + 20,
      y: yPosition,
      size: fontSize,
      font: font,
    });
  }
  yPosition -= lineHeight * 2;
  
  // Footer
  page.drawText('تم إنشاء هذا العقد بواسطة منصة Flous Cash', {
    x: margin,
    y: margin,
    size: fontSize - 2,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  page.drawText('مرخص من البنك المركزي المصري', {
    x: margin,
    y: margin - 15,
    size: fontSize - 2,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Official stamp placeholder
  page.drawRectangle({
    x: width - margin - 100,
    y: margin + 20,
    width: 80,
    height: 60,
    borderColor: rgb(0.13, 0.55, 0.95),
    borderWidth: 2,
  });
  
  page.drawText('ختم', {
    x: width - margin - 80,
    y: margin + 45,
    size: fontSize,
    font: boldFont,
    color: rgb(0.13, 0.55, 0.95),
  });
  
  page.drawText('Flous Cash', {
    x: width - margin - 90,
    y: margin + 30,
    size: fontSize - 2,
    font: font,
    color: rgb(0.13, 0.55, 0.95),
  });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

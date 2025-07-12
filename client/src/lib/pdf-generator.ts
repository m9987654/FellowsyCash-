// Client-side PDF utilities
// Note: The actual PDF generation happens on the server
// This file contains client-side helpers for PDF-related functionality

export interface ContractData {
  id: number;
  type: 'funding' | 'investment' | 'savings';
  contractData: {
    userName?: string;
    userEmail?: string;
    amount?: string;
    purpose?: string;
    monthlyIncome?: string;
    planName?: string;
    investmentAmount?: string;
    expectedReturn?: string;
    duration?: number;
  };
  signatureData?: string;
  createdAt: string;
}

export const downloadContractPDF = async (contractId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/contracts/${contractId}/pdf`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to download contract');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contract-${contractId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading contract PDF:', error);
    throw error;
  }
};

export const previewContract = (contract: ContractData): string => {
  const { contractData } = contract;
  
  let serviceDetails = '';
  if (contract.type === 'funding') {
    serviceDetails = `
      <div class="service-details">
        <h3>تفاصيل طلب التمويل</h3>
        <p><strong>المبلغ:</strong> ${contractData.amount} جنيه</p>
        <p><strong>الغرض:</strong> ${contractData.purpose}</p>
        <p><strong>الراتب الشهري:</strong> ${contractData.monthlyIncome} جنيه</p>
      </div>
    `;
  } else if (contract.type === 'investment') {
    serviceDetails = `
      <div class="service-details">
        <h3>تفاصيل الخطة الاستثمارية</h3>
        <p><strong>اسم الخطة:</strong> ${contractData.planName}</p>
        <p><strong>مبلغ الاستثمار:</strong> ${contractData.investmentAmount} جنيه</p>
        <p><strong>العائد المتوقع:</strong> ${contractData.expectedReturn}%</p>
        <p><strong>مدة الاستثمار:</strong> ${contractData.duration} شهر</p>
      </div>
    `;
  }

  return `
    <div class="contract-preview" style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <div class="header" style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2196F3;">Flous Cash</h1>
        <h2>عقد الخدمات المالية</h2>
      </div>
      
      <div class="contract-info">
        <p><strong>رقم العقد:</strong> ${contract.id}</p>
        <p><strong>التاريخ:</strong> ${new Date(contract.createdAt).toLocaleDateString('ar-EG')}</p>
        <p><strong>اسم العميل:</strong> ${contractData.userName || 'غير محدد'}</p>
        <p><strong>البريد الإلكتروني:</strong> ${contractData.userEmail || 'غير محدد'}</p>
      </div>
      
      ${serviceDetails}
      
      <div class="terms" style="margin-top: 30px;">
        <h3>الشروط والأحكام</h3>
        <ul>
          <li>يلتزم العميل بتقديم المعلومات الصحيحة والكاملة</li>
          <li>تخضع جميع المعاملات لقوانين جمهورية مصر العربية</li>
          <li>يحق للشركة مراجعة الطلب والموافقة عليه أو رفضه</li>
          <li>العميل مسؤول عن سداد جميع المبالغ المستحقة في المواعيد المحددة</li>
          <li>هذا العقد ملزم لجميع الأطراف بمجرد التوقيع عليه</li>
        </ul>
      </div>
      
      <div class="signature" style="margin-top: 30px; text-align: center;">
        <p><strong>توقيع العميل:</strong></p>
        <div style="border: 2px dashed #ccc; padding: 20px; margin: 10px 0;">
          ${contract.signatureData || 'لم يتم التوقيع بعد'}
        </div>
      </div>
    </div>
  `;
};

export const validateContractData = (contract: ContractData): boolean => {
  if (!contract.id || !contract.type || !contract.contractData) {
    return false;
  }

  const { contractData } = contract;

  switch (contract.type) {
    case 'funding':
      return !!(contractData.amount && contractData.purpose && contractData.monthlyIncome);
    case 'investment':
      return !!(contractData.planName && contractData.investmentAmount && contractData.expectedReturn);
    case 'savings':
      return true; // Add specific validation for savings if needed
    default:
      return false;
  }
};

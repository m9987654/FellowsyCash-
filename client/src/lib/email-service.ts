// Client-side email service utilities
// Note: The actual email sending happens on the server
// This file contains client-side helpers for email-related functionality

export interface EmailTemplate {
  subject: string;
  body: string;
  type: 'welcome' | 'contract' | 'notification' | 'reminder';
}

export const emailTemplates = {
  welcome: {
    subject: 'أهلاً بيك في Flous Cash! 🎉',
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #E3F2FD 0%, #F8F9FA 100%); padding: 40px 20px;">
        <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2196F3, #1976D2); border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 24px; font-weight: bold;">F</span>
            </div>
            <h1 style="color: #1976D2; margin: 0; font-size: 28px;">أهلاً بيك في Flous Cash!</h1>
          </div>
          
          <div style="color: #333; line-height: 1.6; font-size: 16px;">
            <p>مرحباً بيك في عائلة Flous Cash! احنا مبسوطين إنك انضممت لأكبر منصة مالية في مصر.</p>
            
            <div style="background: rgba(33, 150, 243, 0.1); border-radius: 15px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1976D2; margin: 0 0 15px 0;">إيه اللي تقدر تعمله دلوقتي:</h3>
              <ul style="margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 8px;">قدّم على تمويل يوصل لـ 100,000 جنيه</li>
                <li style="margin-bottom: 8px;">اعمل خطة ادخار ذكية لمستقبلك</li>
                <li style="margin-bottom: 8px;">استثمر أموالك في خطط مضمونة</li>
                <li style="margin-bottom: 8px;">اكسب من كل صديق تدعوه للمنصة</li>
              </ul>
            </div>
            
            <div style="background: rgba(255, 193, 7, 0.1); border-radius: 15px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #FF8F00; margin: 0 0 15px 0;">🎉 هدية ترحيب خاصة!</h3>
              <p style="margin: 0;">احصل على مكافأة 50 جنيه مع أول معاملة مالية ليك!</p>
            </div>
            
            <p>لو محتاج أي مساعدة، فريق الدعم الفني بتاعنا جاهز 24/7 لمساعدتك.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://flous-cash.com" style="background: linear-gradient(135deg, #2196F3, #1976D2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                ابدأ رحلتك المالية الآن
              </a>
            </div>
          </div>
        </div>
      </div>
    `,
    type: 'welcome' as const,
  },
  
  contractSigned: {
    subject: 'تم توقيع العقد بنجاح - Flous Cash',
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #E3F2FD 0%, #F8F9FA 100%); padding: 40px 20px;">
        <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4CAF50, #2E7D32); border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 24px;">✓</span>
            </div>
            <h1 style="color: #2E7D32; margin: 0; font-size: 28px;">تم توقيع العقد بنجاح!</h1>
          </div>
          
          <div style="color: #333; line-height: 1.6; font-size: 16px;">
            <p>تم توقيع عقدك مع Flous Cash بنجاح. العقد مرفق مع هذا الإيميل كملف PDF.</p>
            
            <div style="background: rgba(76, 175, 80, 0.1); border-radius: 15px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #2E7D32; margin: 0 0 15px 0;">الخطوات التالية:</h3>
              <ul style="margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 8px;">راجع العقد المرفق واحتفظ بنسخة</li>
                <li style="margin-bottom: 8px;">سيتم التواصل معك خلال 24 ساعة</li>
                <li style="margin-bottom: 8px;">تابع حالة طلبك في لوحة التحكم</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
              شكراً لثقتك في Flous Cash<br>
              فريق العمل
            </p>
          </div>
        </div>
      </div>
    `,
    type: 'contract' as const,
  },
  
  fundingApproved: {
    subject: 'تم الموافقة على طلب التمويل! 🎉',
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #E3F2FD 0%, #F8F9FA 100%); padding: 40px 20px;">
        <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4CAF50, #2E7D32); border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 24px;">💰</span>
            </div>
            <h1 style="color: #2E7D32; margin: 0; font-size: 28px;">مبروك! تم الموافقة على طلبك</h1>
          </div>
          
          <div style="color: #333; line-height: 1.6; font-size: 16px;">
            <p>تم الموافقة على طلب التمويل الخاص بك. سيتم تحويل المبلغ إلى حسابك خلال 24 ساعة.</p>
            
            <div style="background: rgba(33, 150, 243, 0.1); border-radius: 15px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1976D2; margin: 0 0 15px 0;">تفاصيل التمويل:</h3>
              <p style="margin: 5px 0;"><strong>المبلغ:</strong> [AMOUNT] جنيه</p>
              <p style="margin: 5px 0;"><strong>معدل الفائدة:</strong> [INTEREST_RATE]%</p>
              <p style="margin: 5px 0;"><strong>مدة السداد:</strong> [DURATION] شهر</p>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
              نشكرك على اختيار Flous Cash<br>
              فريق العمل
            </p>
          </div>
        </div>
      </div>
    `,
    type: 'notification' as const,
  },
};

export const formatEmailContent = (template: EmailTemplate, variables: Record<string, string> = {}): EmailTemplate => {
  let formattedBody = template.body;
  
  // Replace variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `[${key.toUpperCase()}]`;
    formattedBody = formattedBody.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return {
    ...template,
    body: formattedBody,
  };
};

export const validateEmailAddress = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const shareViaEmail = (subject: string, body: string, recipient?: string): void => {
  const mailtoLink = `mailto:${recipient || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};

export const generateReferralEmail = (referralLink: string, userName: string): EmailTemplate => {
  return {
    subject: `${userName} يدعوك للانضمام لـ Flous Cash`,
    body: `
      مرحباً!
      
      صديقك ${userName} يدعوك للانضمام لمنصة Flous Cash - أكبر منصة مالية في مصر.
      
      مع Flous Cash تقدر:
      • تحصل على تمويل يوصل لـ 100,000 جنيه
      • تعمل خطة ادخار ذكية
      • تستثمر أموالك بأمان
      • تكسب من دعوة الأصدقاء
      
      انضم دلوقتي واحصل على مكافأة ترحيب!
      
      ${referralLink}
      
      مع تحيات فريق Flous Cash
    `,
    type: 'notification',
  };
};

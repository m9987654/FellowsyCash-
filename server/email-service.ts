import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

let transporter: nodemailer.Transporter;

// Initialize email service
function initializeEmailService() {
  if (!transporter) {
    // Use environment variables for email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    };
    
    transporter = nodemailer.createTransporter(emailConfig);
  }
  
  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const emailTransporter = initializeEmailService();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@flous-cash.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    };
    
    await emailTransporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #E3F2FD 0%, #F8F9FA 100%); padding: 40px 20px;">
      <div style="background: rgba(255, 255, 255, 0.9); border-radius: 20px; padding: 30px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2196F3, #1976D2); border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: white; font-size: 24px; font-weight: bold;">F</span>
          </div>
          <h1 style="color: #1976D2; margin: 0; font-size: 28px;">أهلاً بيك في Flous Cash!</h1>
        </div>
        
        <div style="color: #333; line-height: 1.6; font-size: 16px;">
          <p>عزيزي ${name},</p>
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
          
          <p style="text-align: center; color: #666; font-size: 14px; margin-top: 20px;">
            شكراً لثقتك في Flous Cash<br>
            فريق العمل
          </p>
        </div>
      </div>
    </div>
  `;
  
  await sendEmail({
    to: email,
    subject: 'أهلاً بيك في Flous Cash - مستقبل المال بين إيديك! 🎉',
    html,
  });
}

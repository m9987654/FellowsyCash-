import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { icon: Twitter, href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { icon: Linkedin, href: "#", color: "hover:text-blue-700" },
  ];

  const serviceLinks = [
    { name: "طلب تمويل", href: "/funding-request" },
    { name: "خطة ادخار", href: "/savings-goals" },
    { name: "خطط استثمارية", href: "/investment-offers" },
    { name: "نظام الإحالة", href: "#referral" },
  ];

  const companyLinks = [
    { name: "من نحن", href: "#about" },
    { name: "اتصل بنا", href: "#contact" },
    { name: "المدونة", href: "#blog" },
    { name: "الوظائف", href: "#careers" },
  ];

  const supportLinks = [
    { name: "مركز المساعدة", href: "#help" },
    { name: "الشروط والأحكام", href: "#terms" },
    { name: "سياسة الخصوصية", href: "#privacy" },
    { name: "أسئلة شائعة", href: "#faq" },
  ];

  return (
    <footer className="footer-glass">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">Flous Cash</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              منصة مالية متقدمة للمصريين. نوفر حلول مالية شاملة تشمل التمويل والادخار والاستثمار 
              بأعلى معايير الأمان والشفافية.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>19040 - خدمة العملاء</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>support@flous-cash.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>القاهرة الجديدة، مصر</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`glass-card p-3 rounded-xl transition-all ${social.color}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6">الخدمات</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6">الشركة</h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold text-gray-800 mb-6">الدعم</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2024 Flous Cash. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">مرخص من البنك المركزي المصري</span>
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">CBE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

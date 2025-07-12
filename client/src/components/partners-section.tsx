import { Card, CardContent } from "@/components/ui/card";
import { 
  Building, 
  Smartphone, 
  CreditCard, 
  Mail, 
  Zap, 
  University 
} from "lucide-react";

export default function PartnersSection() {
  const partners = [
    {
      name: "البنك المركزي المصري",
      icon: University,
      color: "from-red-600 to-red-800",
      description: "الجهة المنظمة للخدمات المالية"
    },
    {
      name: "بنك مصر",
      icon: Building,
      color: "from-blue-900 to-blue-700",
      description: "شريك مصرفي رسمي"
    },
    {
      name: "فودافون كاش",
      icon: Smartphone,
      color: "from-red-500 to-red-700",
      description: "خدمات الدفع الإلكتروني"
    },
    {
      name: "انستاباي",
      icon: Zap,
      color: "from-purple-500 to-purple-700",
      description: "التحويلات الفورية"
    },
    {
      name: "البريد المصري",
      icon: Mail,
      color: "from-green-600 to-green-800",
      description: "خدمات التوصيل والدفع"
    },
    {
      name: "ميزة",
      icon: CreditCard,
      color: "from-yellow-500 to-yellow-700",
      description: "شبكة البطاقات الوطنية"
    }
  ];

  return (
    <section id="partners" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">شركاؤنا الموثوقين</h2>
          <p className="text-xl text-gray-600">نعمل مع أفضل المؤسسات المالية في مصر</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {partners.map((partner, index) => (
            <Card key={index} className="partner-logo group cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${partner.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <partner.icon className="text-white w-8 h-8" />
                </div>
                <h3 className="font-medium text-sm text-gray-800">{partner.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Benefits */}
        <Card className="glass-card">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
              ليه تختار Flous Cash؟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <h4 className="font-medium mb-2">مرخص رسمياً</h4>
                <p className="text-sm text-gray-600">مرخص من البنك المركزي المصري</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">🔒</span>
                </div>
                <h4 className="font-medium mb-2">أمان مطلق</h4>
                <p className="text-sm text-gray-600">أعلى معايير الأمان والحماية</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <h4 className="font-medium mb-2">سرعة الخدمة</h4>
                <p className="text-sm text-gray-600">موافقة سريعة وخدمة فورية</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">🎯</span>
                </div>
                <h4 className="font-medium mb-2">دعم 24/7</h4>
                <p className="text-sm text-gray-600">دعم فني متاح طوال الوقت</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "أحمد محمد",
      avatar: "أ",
      rating: 5,
      text: "فعلاً منصة رائعة، حصلت على التمويل بسرعة وسهولة. الدعم الفني متعاون جداً والعملية كلها واضحة.",
      service: "تمويل شخصي"
    },
    {
      name: "فاطمة أحمد",
      avatar: "ف",
      rating: 5,
      text: "بدأت أدخر معاهم من 6 شهور، وفعلاً شايفة نتيجة. خطة الادخار بتاعتهم عملية ومرنة.",
      service: "خطة ادخار"
    },
    {
      name: "محمد علي",
      avatar: "م",
      rating: 5,
      text: "استثمرت مع Flous Cash وحققت عائد ممتاز. الشفافية والأمان هما أهم حاجة بالنسبة لي.",
      service: "استثمار"
    },
    {
      name: "سارة حسن",
      avatar: "س",
      rating: 5,
      text: "التطبيق سهل جداً في الاستخدام، ولوحة التحكم بتخليني أتابع كل حاجة بسهولة.",
      service: "منصة رقمية"
    },
    {
      name: "خالد محمود",
      avatar: "خ",
      rating: 5,
      text: "نظام الإحالة رائع، كسبت مبلغ كويس من دعوة أصحابي للمنصة.",
      service: "نظام الإحالة"
    },
    {
      name: "مريم أحمد",
      avatar: "م",
      rating: 5,
      text: "الموافقة على طلب التمويل كانت سريعة جداً، وخلال يوم واحد بس.",
      service: "تمويل فوري"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">آراء عملائنا</h2>
          <p className="text-xl text-gray-600">شوف إيه اللي بيقولوه الناس عن Flous Cash</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card group hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center ml-4">
                    <span className="text-white font-bold">{testimonial.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary font-medium">
                    {testimonial.service}
                  </span>
                  <span className="text-xs text-gray-500">عميل محقق</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
                  <div className="text-gray-600">عميل راضي</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">4.9</div>
                  <div className="text-gray-600">تقييم العملاء</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-gray-600">معدل الرضا</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <div className="text-gray-600">دعم فني</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

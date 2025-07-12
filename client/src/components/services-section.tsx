import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PiggyBank, TrendingUp, Check } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Wallet,
      title: "قدّم على تمويل",
      description: "احصل على التمويل اللي محتاجه لتحقيق أهدافك المالية بسرعة وسهولة",
      features: [
        "موافقة سريعة خلال 24 ساعة",
        "معدلات فوائد منافسة",
        "مرونة في السداد"
      ],
      color: "blue"
    },
    {
      icon: PiggyBank,
      title: "خطة تحويش",
      description: "خطط ذكية للادخار تساعدك توصل لأهدافك المالية بسهولة",
      features: [
        "خطط مرنة تناسب دخلك",
        "عوائد تنافسية",
        "متابعة مستمرة لتقدمك"
      ],
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "خطط استثمارية",
      description: "استثمر أموالك بذكاء واحصل على عوائد مضمونة",
      features: [
        "خطط استثمارية متنوعة",
        "إدارة احترافية للمحفظة",
        "شفافية كاملة في التعاملات"
      ],
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-blue-700";
      case "green":
        return "from-green-500 to-green-700";
      case "purple":
        return "from-purple-500 to-purple-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">خدماتنا المالية</h2>
          <p className="text-xl text-gray-600">حلول مالية متكاملة تناسب احتياجاتك</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="service-card">
              <CardHeader>
                <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(service.color)} rounded-2xl flex items-center justify-center mb-6`}>
                  <service.icon className="text-white w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Check className="text-green-500 w-5 h-5 ml-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full floating-button" asChild>
                  <a href="/api/login">
                    {service.title === "قدّم على تمويل" ? "قدّم الآن" : 
                     service.title === "خطة تحويش" ? "ابدأ الآن" : "اختر خطتك"}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

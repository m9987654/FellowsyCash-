import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            مستقبل المال
            <span className="text-transparent bg-gradient-to-r from-primary to-blue-700 bg-clip-text">
              بين إيديك
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            منصة مالية متقدمة للمصريين. احصل على التمويل، خطط للمستقبل، واستثمر بذكاء مع Flous Cash
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="floating-button" asChild>
              <a href="/api/login">
                ابدأ رحلتك المالية
                <ArrowLeft className="w-5 h-5 mr-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="glass-card glow-effect">
              <Play className="w-5 h-5 mr-2" />
              اعرف أكتر
            </Button>
          </div>
        </div>
        
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="hero-stats text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">+50M</div>
              <div className="text-gray-600">جنيه تم تمويله</div>
            </CardContent>
          </Card>
          <Card className="hero-stats text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">15K+</div>
              <div className="text-gray-600">عميل راضي</div>
            </CardContent>
          </Card>
          <Card className="hero-stats text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">98%</div>
              <div className="text-gray-600">معدل الموافقة</div>
            </CardContent>
          </Card>
          <Card className="hero-stats text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">دعم فني</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

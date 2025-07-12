import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Star, ArrowLeft, DollarSign } from "lucide-react";

export default function HeroSectionArabic() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-lg">
            <Star className="w-5 h-5 ml-2" />
            منصة فلوس كاش الرسمية
          </Badge>
          
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              فلوس كاش
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300 font-medium">
              منصة التمويل والاستثمار المصرية
            </span>
          </h1>
          
          {/* Motivational phrases */}
          <div className="mb-8 space-y-4">
            <p className="text-xl md:text-2xl text-amber-600 dark:text-amber-400 font-semibold">
              💸 ابدأ بـ 100 جنيه وشوف بنفسك
            </p>
            <p className="text-lg md:text-xl text-green-600 dark:text-green-400 font-medium">
              🎯 مكسب مضمون بإسمك وعقدك معانا
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              الفلوس تشتغللك مش العكس
            </p>
          </div>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/api/login'}
            >
              ابدأ الاستثمار دلوقتي
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/api/login'}
            >
              طلب تمويل فوري
              <DollarSign className="w-5 h-5 mr-2" />
            </Button>
          </div>
          
          {/* Features grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  عوائد عالية مضمونة
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  أرباح تصل إلى 150% خلال 90 يوم
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  أمان وضمان
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  عقود رسمية موثقة وحماية كاملة
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  سرعة فائقة
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  موافقة وتحويل خلال 24 ساعة
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">+5000</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">عميل راضي</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">50M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">جنيه مُستثمر</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">99%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">معدل نجاح</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">دعم فني</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
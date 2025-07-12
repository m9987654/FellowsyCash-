import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, DollarSign, Target, Zap } from "lucide-react";

interface InvestmentPlan {
  id: string;
  title: string;
  duration: string;
  returnRate: string;
  minAmount: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  progressValue?: number;
}

const investmentPlans: InvestmentPlan[] = [
  {
    id: "basic",
    title: "الخطة الأساسية",
    duration: "10 أيام",
    returnRate: "40%",
    minAmount: "100",
    description: "استثمر 100 جنيه، تاخد 140 بعد 10 أيام 💰",
    features: [
      "عائد مضمون 40%",
      "مدة 10 أيام بالتمام",
      "دعم فني 24/7",
      "عقد رسمي"
    ],
    progressValue: 85
  },
  {
    id: "premium",
    title: "الخطة المميزة",
    duration: "10 أيام",
    returnRate: "40%",
    minAmount: "500",
    description: "استثمر 500 جنيه، تاخد 700 بعد 10 أيام 💰",
    features: [
      "عائد مضمون 40%",
      "مدة 10 أيام بالتمام",
      "أولوية في الدعم",
      "استشارة مالية مجانية"
    ],
    isPopular: true,
    progressValue: 92
  },
  {
    id: "vip",
    title: "الخطة الذهبية",
    duration: "10 أيام",
    returnRate: "40%",
    minAmount: "1000",
    description: "استثمر 1000 جنيه، تاخد 1400 بعد 10 أيام 💰",
    features: [
      "عائد مضمون 40%",
      "مدة 10 أيام بالتمام",
      "مدير حساب شخصي",
      "تقارير يومية"
    ],
    progressValue: 78
  }
];

interface InvestmentPlansProps {
  onSelectPlan: (plan: InvestmentPlan) => void;
}

export default function InvestmentPlans({ onSelectPlan }: InvestmentPlansProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {investmentPlans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative transition-all duration-300 hover:shadow-xl hover:scale-105 ${
            plan.isPopular 
              ? 'border-2 border-amber-400 dark:border-amber-500 shadow-amber-100 dark:shadow-amber-900/20' 
              : 'border border-gray-200 dark:border-gray-700'
          }`}
        >
          {plan.isPopular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1">
                <Zap className="w-3 h-3 ml-1" />
                الأكثر طلباً
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center pb-4">
            <div className="mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {plan.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {plan.description}
              </CardDescription>
            </div>
            
            <div className="flex justify-center items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {plan.returnRate}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">عائد</span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{plan.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>من {plan.minAmount} جنيه</span>
              </div>
            </div>
            
            {plan.progressValue && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">معدل النجاح</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {plan.progressValue}%
                  </span>
                </div>
                <Progress value={plan.progressValue} className="h-2" />
              </div>
            )}
            
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => onSelectPlan(plan)}
              className={`w-full ${
                plan.isPopular
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              } text-white font-medium py-3`}
            >
              ابدأ دلوقتي
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
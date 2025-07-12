import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Target, ArrowUp } from "lucide-react";

export default function DashboardPreview() {
  const chartData = [32, 40, 48, 56, 44, 60, 52];
  const maxValue = Math.max(...chartData);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">لوحة التحكم الذكية</h2>
          <p className="text-xl text-gray-600">تابع أموالك واستثماراتك بسهولة</p>
        </div>
        
        <Card className="glass-card">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Metrics */}
              <div className="space-y-6">
                <Card className="metric-tile">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">رصيدك دلوقتي</p>
                        <p className="text-3xl font-bold text-gray-800">25,750 جنيه</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                        <Wallet className="text-white w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+12% من الشهر اللي فات</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="metric-tile">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">إجمالي الاستثمارات</p>
                        <p className="text-3xl font-bold text-gray-800">45,200 جنيه</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                        <TrendingUp className="text-white w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex items-center text-purple-600">
                      <ArrowUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+8.5% عائد سنوي</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="metric-tile">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">هدف الادخار</p>
                        <p className="text-3xl font-bold text-gray-800">80% مكتمل</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                        <Target className="text-white w-6 h-6" />
                      </div>
                    </div>
                    <Progress value={80} className="h-2" />
                  </CardContent>
                </Card>
              </div>
              
              {/* Chart Area */}
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    الأداء الشهري
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {chartData.map((value, index) => (
                      <div
                        key={index}
                        className="w-full bg-gradient-to-t from-primary to-blue-300 rounded-t-xl transition-all duration-300 hover:from-primary-dark hover:to-blue-400"
                        style={{ height: `${(value / maxValue) * 100}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-gray-600">
                    <span>يناير</span>
                    <span>فبراير</span>
                    <span>مارس</span>
                    <span>أبريل</span>
                    <span>مايو</span>
                    <span>يونيو</span>
                    <span>يوليو</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

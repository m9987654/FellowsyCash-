import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  Users, 
  FileText, 
  Plus,
  ArrowUp,
  Target
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalFunded: number;
  totalSavings: number;
  totalInvestments: number;
  referralCount: number;
  referralEarnings: string;
  savingsProgress: Array<{
    id: number;
    name: string;
    progress: number;
  }>;
}

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "تم تسجيل الخروج. جاري تسجيل الدخول مرة أخرى...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: contracts } = useQuery({
    queryKey: ["/api/contracts"],
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoading || statsLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass-card animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            أهلاً بيك، {user?.firstName || 'صديقي'}!
          </h1>
          <p className="text-xl text-gray-600">
            إيه أخبار رحلتك المالية النهاردة؟
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="metric-tile">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">إجمالي التمويل</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.totalFunded?.toLocaleString() || 0} جنيه
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <Wallet className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-blue-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm">متاح للسحب</span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-tile">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">إجمالي الادخار</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.totalSavings?.toLocaleString() || 0} جنيه
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                  <PiggyBank className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm">في نمو مستمر</span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-tile">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">إجمالي الاستثمارات</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.totalInvestments?.toLocaleString() || 0} جنيه
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-purple-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm">عائد إيجابي</span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-tile">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">الأصدقاء المدعوين</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stats?.referralCount || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                  <Users className="text-white w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center text-orange-600">
                <span className="text-sm">
                  {stats?.referralEarnings || 0} جنيه مكافآت
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="service-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                قدّم على تمويل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                احصل على التمويل اللي محتاجه بسرعة وسهولة
              </p>
              <Link href="/funding-request">
                <Button className="w-full floating-button">
                  ابدأ الآن
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="service-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                خطة ادخار جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                اعمل خطة ادخار ذكية تساعدك توصل لأهدافك
              </p>
              <Link href="/savings-goals">
                <Button className="w-full floating-button">
                  ابدأ الآن
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="service-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                استثمر أموالك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                اختر خطة استثمارية تناسب أهدافك المالية
              </p>
              <Link href="/investment-offers">
                <Button className="w-full floating-button">
                  ابدأ الآن
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Savings Progress */}
        {stats?.savingsProgress && stats.savingsProgress.length > 0 && (
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                تقدم أهداف الادخار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.savingsProgress.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(goal.progress)}%
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Contracts */}
        {contracts && contracts.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                العقود الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.slice(0, 3).map((contract: any) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 glass-card rounded-xl">
                    <div>
                      <p className="font-medium">
                        {contract.type === 'funding' ? 'طلب تمويل' : 
                         contract.type === 'investment' ? 'خطة استثمارية' : 
                         'خطة ادخار'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(contract.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contract.status === 'signed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contract.status === 'signed' ? 'تم التوقيع' : 'في الانتظار'}
                      </span>
                      {contract.pdfUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={contract.pdfUrl} target="_blank" rel="noopener noreferrer">
                            تحميل
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

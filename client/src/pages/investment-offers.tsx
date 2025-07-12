import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertInvestmentOfferSchema } from "@shared/schema";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContractModal from "@/components/contract-modal";
import { TrendingUp, Plus, Clock, DollarSign, Calendar, Target } from "lucide-react";
import { Link } from "wouter";

const formSchema = insertInvestmentOfferSchema.extend({
  userId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function InvestmentOffers() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [contractData, setContractData] = useState<any>(null);
  const [showContract, setShowContract] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
      investmentAmount: "",
      expectedReturn: "",
      duration: 12,
    },
  });

  const { data: investmentOffers, isLoading: offersLoading } = useQuery({
    queryKey: ["/api/investment-offers"],
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/investment-offers", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء الخطة الاستثمارية بنجاح!",
        description: "سيتم مراجعة طلبك وإرسال العقد قريباً",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investment-offers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      // Show contract modal
      setContractData(data.contract);
      setShowContract(true);
      
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "خطأ في إنشاء الخطة",
        description: "حدث خطأ أثناء إنشاء الخطة الاستثمارية. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || offersLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="glass-card animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="glass-card">
              <CardContent className="p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h2 className="text-2xl font-bold mb-4">يلزم تسجيل الدخول</h2>
                <p className="text-gray-600 mb-6">
                  لإنشاء خطة استثمارية، يرجى تسجيل الدخول أولاً
                </p>
                <Button asChild className="floating-button">
                  <a href="/api/login">تسجيل الدخول</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const calculateTotalReturn = (amount: string, returnRate: string, duration: number) => {
    const principal = parseFloat(amount || "0");
    const rate = parseFloat(returnRate || "0") / 100;
    const years = duration / 12;
    return principal * Math.pow(1 + rate, years);
  };

  const investmentPlans = [
    {
      name: "خطة المحافظ الآمن",
      minAmount: 10000,
      expectedReturn: "8-12%",
      duration: "12-24 شهر",
      description: "خطة استثمارية آمنة مع عائد مضمون",
      features: ["عائد مضمون", "مخاطر منخفضة", "سحب مرن"]
    },
    {
      name: "خطة النمو المتوسط",
      minAmount: 25000,
      expectedReturn: "12-18%",
      duration: "24-36 شهر",
      description: "خطة متوازنة بين الأمان والعائد",
      features: ["عائد جيد", "مخاطر متوسطة", "إدارة احترافية"]
    },
    {
      name: "خطة الاستثمار المتقدم",
      minAmount: 50000,
      expectedReturn: "18-25%",
      duration: "36-60 شهر",
      description: "خطة للمستثمرين المتقدمين",
      features: ["عائد مرتفع", "إدارة متخصصة", "تنويع الاستثمارات"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              خطط الاستثمار
            </h1>
            <p className="text-xl text-gray-600">
              استثمر أموالك بذكاء واحصل على عوائد مضمونة
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="floating-button">
                <Plus className="w-5 h-5 mr-2" />
                خطة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card">
              <DialogHeader>
                <DialogTitle>إنشاء خطة استثمارية جديدة</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="planName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الخطة</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="input-glass">
                              <SelectValue placeholder="اختر الخطة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="خطة المحافظ الآمن">خطة المحافظ الآمن</SelectItem>
                              <SelectItem value="خطة النمو المتوسط">خطة النمو المتوسط</SelectItem>
                              <SelectItem value="خطة الاستثمار المتقدم">خطة الاستثمار المتقدم</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="investmentAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مبلغ الاستثمار (جنيه)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="مثلاً: 50000"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expectedReturn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العائد المتوقع (%)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="مثلاً: 15"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مدة الاستثمار (شهر)</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <SelectTrigger className="input-glass">
                              <SelectValue placeholder="اختر المدة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12 شهر</SelectItem>
                              <SelectItem value="18">18 شهر</SelectItem>
                              <SelectItem value="24">24 شهر</SelectItem>
                              <SelectItem value="36">36 شهر</SelectItem>
                              <SelectItem value="48">48 شهر</SelectItem>
                              <SelectItem value="60">60 شهر</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 floating-button" disabled={mutation.isPending}>
                      {mutation.isPending ? "جاري الإنشاء..." : "إنشاء الخطة"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Investment Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {investmentPlans.map((plan, index) => (
            <Card key={index} className="service-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {plan.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {plan.expectedReturn}
                    </div>
                    <div className="text-sm text-gray-600">عائد سنوي متوقع</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الحد الأدنى</span>
                      <span className="font-medium">{plan.minAmount.toLocaleString()} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">المدة</span>
                      <span className="font-medium">{plan.duration}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{plan.description}</p>
                  
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full floating-button">
                        اختر هذه الخطة
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User's Investment Offers */}
        {investmentOffers && investmentOffers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">خططك الاستثمارية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentOffers.map((offer: any) => {
                const totalReturn = calculateTotalReturn(
                  offer.investmentAmount,
                  offer.expectedReturn,
                  offer.duration
                );
                const profit = totalReturn - parseFloat(offer.investmentAmount);

                return (
                  <Card key={offer.id} className="service-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {offer.planName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">مبلغ الاستثمار</p>
                            <p className="font-bold text-lg">
                              {parseFloat(offer.investmentAmount).toLocaleString()} جنيه
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">العائد المتوقع</p>
                            <p className="font-bold text-lg text-green-600">
                              {offer.expectedReturn}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">المدة</p>
                            <p className="font-medium">{offer.duration} شهر</p>
                          </div>
                          <div>
                            <p className="text-gray-600">الربح المتوقع</p>
                            <p className="font-medium text-green-600">
                              {profit.toLocaleString()} جنيه
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            بدء من {new Date(offer.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          offer.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : offer.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : offer.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.status === 'active' ? 'نشط' : 
                           offer.status === 'completed' ? 'مكتمل' : 
                           offer.status === 'cancelled' ? 'ملغي' : 'قيد المراجعة'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Investment Tips */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              نصائح استثمارية مهمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">نوع استثماراتك</h4>
                <p className="text-sm text-gray-600">
                  لا تضع كل أموالك في خطة واحدة، وزعها على خطط مختلفة
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">اقرأ الشروط بعناية</h4>
                <p className="text-sm text-gray-600">
                  تأكد من فهم جميع الشروط والأحكام قبل الاستثمار
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">استثمر ما تستطيع تحمل خسارته</h4>
                <p className="text-sm text-gray-600">
                  لا تستثمر أموال محتاجها للضروريات
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">فكر على المدى الطويل</h4>
                <p className="text-sm text-gray-600">
                  الاستثمار الناجح يحتاج صبر والتفكير طويل المدى
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Modal */}
      {showContract && contractData && (
        <ContractModal
          contract={contractData}
          isOpen={showContract}
          onClose={() => setShowContract(false)}
        />
      )}
    </div>
  );
}

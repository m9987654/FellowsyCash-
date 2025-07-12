import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertInvestmentOfferSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { TrendingUp, Shield, Clock, Star, ArrowRight, CheckCircle } from "lucide-react";
import PaymentNotice from "@/components/payment-notice";
import InvestmentPlans from "@/components/investment-plans";
import ContractModal from "@/components/contract-modal";
import Navbar from "@/components/navbar";
import { Link } from "wouter";

const formSchema = insertInvestmentOfferSchema.extend({
  userId: z.string().optional(),
  paymentConfirmed: z.boolean().refine((val) => val === true, {
    message: "يجب تأكيد تحويل رسوم الخدمة لإتمام الطلب",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function InvestmentOffersNew() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [contractData, setContractData] = useState<any>(null);
  const [showContract, setShowContract] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      planName: "",
      investmentAmount: "",
      expectedReturn: "",
      duration: 0,
      paymentConfirmed: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/investment-offers", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء خطة الاستثمار بنجاح! 🎉",
        description: "ستبدأ خطتك خلال 24 ساعة بعد مراجعة البيانات",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/investment-offers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      // Show contract modal
      setContractData(data.contract);
      setShowContract(true);
      
      form.reset();
      setPaymentConfirmed(false);
      setSelectedPlan(null);
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
        title: "حدث خطأ",
        description: "فشل في إنشاء خطة الاستثمار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const onSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    form.setValue("planName", plan.title);
    form.setValue("expectedReturn", plan.returnRate.replace('%', ''));
    form.setValue("duration", parseInt(plan.duration.split(' ')[0]));
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">تسجيل الدخول مطلوب</CardTitle>
            <CardDescription>
              يجب تسجيل الدخول للوصول إلى خدمات الاستثمار
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/api/login">تسجيل الدخول</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              خطط الاستثمار المضمونة
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              ابدأ بـ 100 جنيه وشوف بنفسك 💸
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">مكسب مضمون</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">بإسمك وعقدك معانا</p>
            </Card>
            
            <Card className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">آمان تام</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">عقود رسمية موثقة</p>
            </Card>
            
            <Card className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">سرعة في العوائد</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">أرباح سريعة ومضمونة</p>
            </Card>
            
            <Card className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">الفلوس تشتغللك</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">مش العكس</p>
            </Card>
          </div>

          {/* Investment Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              اختر خطة الاستثمار المناسبة
            </h2>
            <InvestmentPlans onSelectPlan={onSelectPlan} />
          </div>

          {selectedPlan && (
            <>
              {/* Payment Notice */}
              <PaymentNotice
                isChecked={paymentConfirmed}
                onCheckedChange={setPaymentConfirmed}
                serviceType="investment"
                amount={form.watch("investmentAmount")}
              />

              {/* Investment Form */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">
                    تفاصيل الاستثمار - {selectedPlan.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {selectedPlan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="investmentAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900 dark:text-white">
                                مبلغ الاستثمار (بالجنيه المصري)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`الحد الأدنى: ${selectedPlan.minAmount} جنيه`}
                                  {...field}
                                  className="text-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-900 dark:text-white">
                            العائد المتوقع
                          </label>
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {selectedPlan.returnRate}
                            </span>
                            <span className="text-sm text-green-700 dark:text-green-300 mr-2">
                              خلال {selectedPlan.duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            الربح يصلك بعد 10 أيام بالتمام
                          </p>
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="paymentConfirmed"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={paymentConfirmed}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  setPaymentConfirmed(e.target.checked);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={!paymentConfirmed || mutation.isPending}
                        className="w-full h-12 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                      >
                        {mutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            جاري إنشاء الخطة...
                          </>
                        ) : (
                          <>
                            ابدأ الاستثمار دلوقتي
                            <ArrowRight className="w-5 h-5 mr-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </>
          )}

          {/* Success Message */}
          {mutation.isSuccess && (
            <Card className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      تم إنشاء خطة الاستثمار بنجاح!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      ستبدأ خطتك خلال 24 ساعة وسيتم إرسال العقد الرسمي
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
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
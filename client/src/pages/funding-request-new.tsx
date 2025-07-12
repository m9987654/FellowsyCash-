import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertFundingRequestSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { DollarSign, FileText, Users, Shield, Banknote, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import PaymentNotice from "@/components/payment-notice";
import ContractModal from "@/components/contract-modal";
import Navbar from "@/components/navbar";
import { Link } from "wouter";

const formSchema = insertFundingRequestSchema.extend({
  userId: z.string().optional(),
  paymentConfirmed: z.boolean().refine((val) => val === true, {
    message: "يجب تأكيد تحويل رسوم الخدمة لإتمام الطلب",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function FundingRequestNew() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [contractData, setContractData] = useState<any>(null);
  const [showContract, setShowContract] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      purpose: "",
      monthlyIncome: "",
      paymentConfirmed: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/funding-requests", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم إرسال طلب التمويل بنجاح! 🎉",
        description: "سيتم مراجعة طلبك خلال 24 ساعة وإرسال العقد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/funding-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      // Show contract modal
      setContractData(data.contract);
      setShowContract(true);
      
      form.reset();
      setPaymentConfirmed(false);
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
        description: "فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

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
              يجب تسجيل الدخول للوصول إلى خدمات التمويل
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Banknote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              طلب تمويل فوري
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              احصل على التمويل اللي محتاجه بأسرع وقت وأقل فوايد
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                أقل فوايد في السوق
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                فوايد منافسة وشروط مرنة
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                عقد رسمي مضمون
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                كل شيء موثق وقانوني
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                آمان وخصوصية
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                بياناتك محمية بأعلى معايير الأمان
              </p>
            </Card>
          </div>

          {/* Payment Notice */}
          <PaymentNotice
            isChecked={paymentConfirmed}
            onCheckedChange={setPaymentConfirmed}
            serviceType="funding"
          />

          {/* Main Form */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                بيانات طلب التمويل
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                املأ البيانات التالية بدقة لضمان سرعة الموافقة
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">
                            المبلغ المطلوب (بالجنيه المصري)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="مثال: 50000"
                              {...field}
                              className="text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-white">
                            الدخل الشهري
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="مثال: 8000"
                              {...field}
                              className="text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 dark:text-white">
                          الغرض من التمويل
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="text-lg">
                              <SelectValue placeholder="اختر الغرض من التمويل" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="business">تطوير الأعمال</SelectItem>
                              <SelectItem value="education">تعليم</SelectItem>
                              <SelectItem value="medical">علاج طبي</SelectItem>
                              <SelectItem value="renovation">تجديد المنزل</SelectItem>
                              <SelectItem value="wedding">زواج</SelectItem>
                              <SelectItem value="car">شراء سيارة</SelectItem>
                              <SelectItem value="emergency">طوارئ</SelectItem>
                              <SelectItem value="other">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        جاري إرسال الطلب...
                      </>
                    ) : (
                      <>
                        إرسال طلب التمويل
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

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
                      تم إرسال طلبك بنجاح!
                    </h3>
                    <p className="text-green-700 dark:text-green-300">
                      سيتم التواصل معك خلال 24 ساعة لإتمام الموافقة
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
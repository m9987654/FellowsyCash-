import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertFundingRequestSchema } from "@shared/schema";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ContractModal from "@/components/contract-modal";
import { Wallet, FileText, Clock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

const formSchema = insertFundingRequestSchema.extend({
  userId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function FundingRequest() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [contractData, setContractData] = useState<any>(null);
  const [showContract, setShowContract] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      purpose: "",
      monthlyIncome: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/funding-requests", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "تم إرسال طلب التمويل بنجاح!",
        description: "سيتم مراجعة طلبك خلال 24 ساعة",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/funding-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      // Show contract modal
      setContractData(data.contract);
      setShowContract(true);
      
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
        title: "خطأ في إرسال الطلب",
        description: "حدث خطأ أثناء إرسال طلب التمويل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card animate-pulse">
              <CardContent className="p-8">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                <Wallet className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h2 className="text-2xl font-bold mb-4">يلزم تسجيل الدخول</h2>
                <p className="text-gray-600 mb-6">
                  لتقديم طلب تمويل، يرجى تسجيل الدخول أولاً
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              قدّم على تمويل
            </h1>
            <p className="text-xl text-gray-600">
              احصل على التمويل اللي محتاجه بسرعة وسهولة
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 glass-card p-4 rounded-xl">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">املأ البيانات</h3>
                <p className="text-sm text-gray-600">ادخل بياناتك المالية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 glass-card p-4 rounded-xl opacity-60">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">مراجعة الطلب</h3>
                <p className="text-sm text-gray-600">خلال 24 ساعة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 glass-card p-4 rounded-xl opacity-60">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">استلام التمويل</h3>
                <p className="text-sm text-gray-600">فور الموافقة</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                بيانات طلب التمويل
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المبلغ المطلوب (جنيه)</FormLabel>
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
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الغرض من التمويل</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="input-glass">
                              <SelectValue placeholder="اختر الغرض" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="شراء سيارة">شراء سيارة</SelectItem>
                              <SelectItem value="شراء شقة">شراء شقة</SelectItem>
                              <SelectItem value="تجديد منزل">تجديد منزل</SelectItem>
                              <SelectItem value="تعليم">تعليم</SelectItem>
                              <SelectItem value="مشروع تجاري">مشروع تجاري</SelectItem>
                              <SelectItem value="طوارئ طبية">طوارئ طبية</SelectItem>
                              <SelectItem value="أخرى">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
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
                        <FormLabel>الراتب الشهري (جنيه)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="مثلاً: 8000"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="glass-card p-4 rounded-xl">
                    <h3 className="font-medium mb-2">معلومات هامة:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• معدل الفائدة يبدأ من 12% سنوياً</li>
                      <li>• مدة السداد تصل إلى 5 سنوات</li>
                      <li>• لا توجد رسوم إدارية مخفية</li>
                      <li>• موافقة سريعة خلال 24 ساعة</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 floating-button" disabled={mutation.isPending}>
                      {mutation.isPending ? "جاري الإرسال..." : "قدّم الطلب"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/">العودة للرئيسية</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
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

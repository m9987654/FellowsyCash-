import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertSavingsGoalSchema } from "@shared/schema";
import { z } from "zod";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const formSchema = insertSavingsGoalSchema.extend({
  userId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SavingsGoals() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalName: "",
      targetAmount: "",
      monthlyContribution: "",
      targetDate: "",
    },
  });

  const { data: savingsGoals, isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/savings-goals"],
    enabled: isAuthenticated,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/savings-goals", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء هدف الادخار بنجاح!",
        description: "ابدأ في تحقيق هدفك المالي الآن",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
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
        title: "خطأ في إنشاء الهدف",
        description: "حدث خطأ أثناء إنشاء هدف الادخار. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || goalsLoading) {
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
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
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
                <Target className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl font-bold mb-4">يلزم تسجيل الدخول</h2>
                <p className="text-gray-600 mb-6">
                  لإنشاء خطة ادخار، يرجى تسجيل الدخول أولاً
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

  const calculateProgress = (current: string, target: string) => {
    const currentAmount = parseFloat(current || "0");
    const targetAmount = parseFloat(target || "1");
    return (currentAmount / targetAmount) * 100;
  };

  const calculateMonthsRemaining = (current: string, target: string, monthly: string) => {
    const currentAmount = parseFloat(current || "0");
    const targetAmount = parseFloat(target || "0");
    const monthlyAmount = parseFloat(monthly || "0");
    
    if (monthlyAmount <= 0) return 0;
    
    const remaining = targetAmount - currentAmount;
    if (remaining <= 0) return 0;
    
    return Math.ceil(remaining / monthlyAmount);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              خطط الادخار
            </h1>
            <p className="text-xl text-gray-600">
              حقق أهدافك المالية بخطط ادخار ذكية
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="floating-button">
                <Plus className="w-5 h-5 mr-2" />
                هدف جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card">
              <DialogHeader>
                <DialogTitle>إنشاء هدف ادخار جديد</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="goalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الهدف</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="مثلاً: شراء سيارة"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المبلغ المستهدف (جنيه)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="مثلاً: 100000"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المبلغ الشهري (جنيه)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="مثلاً: 2000"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التاريخ المستهدف</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="input-glass"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 floating-button" disabled={mutation.isPending}>
                      {mutation.isPending ? "جاري الإنشاء..." : "إنشاء الهدف"}
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

        {/* Savings Goals Grid */}
        {savingsGoals && savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsGoals.map((goal: any) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const monthsRemaining = calculateMonthsRemaining(
                goal.currentAmount, 
                goal.targetAmount, 
                goal.monthlyContribution
              );

              return (
                <Card key={goal.id} className="service-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      {goal.goalName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">التقدم</span>
                        <span className="text-sm font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">الحالي</p>
                          <p className="font-bold">
                            {parseFloat(goal.currentAmount || "0").toLocaleString()} جنيه
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">المستهدف</p>
                          <p className="font-bold">
                            {parseFloat(goal.targetAmount).toLocaleString()} جنيه
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {parseFloat(goal.monthlyContribution).toLocaleString()} جنيه شهرياً
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {monthsRemaining > 0 ? `${monthsRemaining} شهر متبقي` : "تم الوصول للهدف!"}
                        </span>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        goal.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : goal.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {goal.status === 'completed' ? 'مكتمل' : 
                         goal.status === 'paused' ? 'متوقف' : 'نشط'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Card className="glass-card max-w-md mx-auto">
              <CardContent className="p-8">
                <Target className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold mb-4">لا توجد أهداف ادخار</h3>
                <p className="text-gray-600 mb-6">
                  ابدأ في إنشاء أول هدف ادخار لك وحقق أحلامك المالية
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="floating-button">
                      <Plus className="w-5 h-5 mr-2" />
                      إنشاء هدف جديد
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                نصائح لادخار ناجح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">حدد أهدافك بوضوح</h4>
                  <p className="text-sm text-gray-600">
                    كلما كان هدفك واضح ومحدد، كلما كان أسهل في التحقيق
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">ادخر بانتظام</h4>
                  <p className="text-sm text-gray-600">
                    حتى لو كان مبلغ صغير، الانتظام هو مفتاح النجاح
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">راجع خطتك دورياً</h4>
                  <p className="text-sm text-gray-600">
                    اعدل خطتك حسب ظروفك المالية الحالية
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">احتفل بالإنجازات</h4>
                  <p className="text-sm text-gray-600">
                    كافئ نفسك عند تحقيق مراحل مهمة في خطتك
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

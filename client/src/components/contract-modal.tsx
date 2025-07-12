import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Mail, Signature } from "lucide-react";

interface ContractModalProps {
  contract: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractModal({ contract, isOpen, onClose }: ContractModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [signature, setSignature] = useState("");
  const [step, setStep] = useState(1); // 1: review, 2: sign, 3: complete

  const signMutation = useMutation({
    mutationFn: async (signatureData: string) => {
      const response = await apiRequest("POST", `/api/contracts/${contract.id}/sign`, {
        signatureData,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التوقيع بنجاح!",
        description: "احنا بعتنالك العقد في الإيميل",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      setStep(3);
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
        title: "خطأ في التوقيع",
        description: "حدث خطأ أثناء توقيع العقد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  const handleSign = () => {
    if (!signature.trim()) {
      toast({
        title: "خطأ في التوقيع",
        description: "يرجى إدخال توقيعك",
        variant: "destructive",
      });
      return;
    }
    signMutation.mutate(signature);
  };

  const downloadContract = () => {
    window.open(`/api/contracts/${contract.id}/pdf`, '_blank');
  };

  const contractData = contract.contractData;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {step === 1 ? "مراجعة العقد" : step === 2 ? "توقيع العقد" : "تم التوقيع"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Contract Preview */}
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl font-bold">F</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">Flous Cash</CardTitle>
                <p className="text-gray-600">عقد الخدمات المالية</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم العقد:</span>
                    <span className="font-medium text-gray-800">{contract.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التاريخ:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(contract.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">نوع الخدمة:</span>
                    <span className="font-medium text-gray-800">
                      {contract.type === 'funding' ? 'طلب تمويل' : 
                       contract.type === 'investment' ? 'خطة استثمارية' : 
                       'خطة ادخار'}
                    </span>
                  </div>
                  
                  {contract.type === 'funding' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المبلغ:</span>
                        <span className="font-medium text-gray-800">
                          {contractData.amount} جنيه
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الغرض:</span>
                        <span className="font-medium text-gray-800">
                          {contractData.purpose}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {contract.type === 'investment' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">اسم الخطة:</span>
                        <span className="font-medium text-gray-800">
                          {contractData.planName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">مبلغ الاستثمار:</span>
                        <span className="font-medium text-gray-800">
                          {contractData.investmentAmount} جنيه
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">العائد المتوقع:</span>
                        <span className="font-medium text-gray-800">
                          {contractData.expectedReturn}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Terms */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">الشروط والأحكام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• يلتزم العميل بتقديم المعلومات الصحيحة والكاملة</p>
                  <p>• تخضع جميع المعاملات لقوانين جمهورية مصر العربية</p>
                  <p>• يحق للشركة مراجعة الطلب والموافقة عليه أو رفضه</p>
                  <p>• العميل مسؤول عن سداد جميع المبالغ المستحقة في المواعيد المحددة</p>
                  <p>• هذا العقد ملزم لجميع الأطراف بمجرد التوقيع عليه</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setStep(2)} className="flex-1 floating-button">
                الموافقة والمتابعة للتوقيع
              </Button>
              <Button variant="outline" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Signature className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-2xl font-bold mb-2">توقيع العقد</h3>
              <p className="text-gray-600">
                يرجى إدخال توقيعك الإلكتروني لاعتماد العقد
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="signature">التوقيع الإلكتروني</Label>
              <Input
                id="signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="اكتب اسمك الكامل كتوقيع"
                className="input-glass text-center text-lg font-semibold"
              />
              <p className="text-sm text-gray-500 text-center">
                سيتم استخدام هذا التوقيع في العقد الرسمي
              </p>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleSign} 
                className="flex-1 floating-button"
                disabled={signMutation.isPending}
              >
                {signMutation.isPending ? "جاري التوقيع..." : "توقيع العقد"}
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                رجوع
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-2xl">✓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">تم التوقيع بنجاح!</h3>
            <p className="text-gray-600">
              تم توقيع العقد بنجاح وإرساله إلى بريدك الإلكتروني
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <Download className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium">تحميل العقد</p>
                  <p className="text-xs text-gray-500">احفظ نسخة على جهازك</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">تم الإرسال</p>
                  <p className="text-xs text-gray-500">العقد في بريدك الإلكتروني</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button onClick={downloadContract} className="flex-1 floating-button">
                <Download className="w-5 h-5 mr-2" />
                تحميل العقد
              </Button>
              <Button variant="outline" onClick={onClose}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

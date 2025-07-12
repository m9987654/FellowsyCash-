import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Download, Mail, FileText } from "lucide-react";

export default function DigitalContracts() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">عقود رقمية آمنة</h2>
          <p className="text-xl text-gray-600">احنا بنوقع عقودنا رقمياً علشان نضمن حقوقك</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Card className="glass-card border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                    <Shield className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">أمان قانوني</h3>
                    <p className="text-gray-600">كل عقد معتمد قانونياً ومختوم بختم المنصة الرسمي</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <Download className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">تحميل فوري</h3>
                    <p className="text-gray-600">احصل على عقدك فوراً بصيغة PDF للتحميل والطباعة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                    <Mail className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">إرسال تلقائي</h3>
                    <p className="text-gray-600">احنا بنبعتلك العقد في الإيميل تلقائياً</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contract Preview */}
          <Card className="glass-card border-2 border-gray-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Flous Cash</CardTitle>
              <p className="text-gray-600">عقد الخدمات المالية</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">اسم العميل:</span>
                  <span className="font-medium text-gray-800">أحمد محمد علي</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم الهوية:</span>
                  <span className="font-medium text-gray-800">29012345678912</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">نوع الخدمة:</span>
                  <span className="font-medium text-gray-800">طلب تمويل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المبلغ:</span>
                  <span className="font-medium text-gray-800">50,000 جنيه</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ العقد:</span>
                  <span className="font-medium text-gray-800">15 يوليو 2024</span>
                </div>
              </div>
              
              {/* Signature Area */}
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-2xl mb-6 bg-gray-50">
                <p className="text-center text-gray-600 mb-4">اضغط هنا للتوقيع</p>
                <div className="h-24 flex items-center justify-center">
                  <div className="text-4xl font-script text-gray-400">أحمد محمد علي</div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button className="floating-button">
                  <Download className="w-5 h-5 mr-2" />
                  تحميل العقد
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

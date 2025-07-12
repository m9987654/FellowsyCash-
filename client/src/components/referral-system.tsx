import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, DollarSign, Medal, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ReferralSystem() {
  const { toast } = useToast();
  const [referralLink] = useState("https://flous-cash.com/signup?ref=ahmed123");

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "تم نسخ الرابط!",
      description: "تم نسخ رابط الإحالة إلى الحافظة",
    });
  };

  const socialButtons = [
    { icon: "fab fa-whatsapp", color: "text-green-600", name: "واتساب" },
    { icon: "fab fa-facebook", color: "text-blue-600", name: "فيسبوك" },
    { icon: "fab fa-twitter", color: "text-blue-400", name: "تويتر" },
    { icon: "fab fa-telegram", color: "text-blue-500", name: "تليجرام" },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">اكسب من كل صديق</h2>
          <p className="text-xl text-gray-600">ادعو أصحابك واكسب مكافآت مع كل عضو جديد</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Referral Stats */}
          <Card className="stats-counter text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-white w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">24</div>
              <div className="text-gray-600">صديق انضم</div>
            </CardContent>
          </Card>
          
          <Card className="stats-counter text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-white w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">2,400 جنيه</div>
              <div className="text-gray-600">إجمالي المكافآت</div>
            </CardContent>
          </Card>
          
          <Card className="stats-counter text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Medal className="text-white w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">الذهبي</div>
              <div className="text-gray-600">مستوى العضوية</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Referral Link */}
        <Card className="referral-link max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              لينك الدعوة بتاعك
            </CardTitle>
            <p className="text-gray-600">
              شارك اللينك ده مع أصحابك واكسب 100 جنيه مع كل عضو جديد
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
              <Input
                value={referralLink}
                readOnly
                className="input-glass text-center font-mono flex-1 max-w-md"
              />
              <Button onClick={copyReferralLink} className="floating-button">
                <Copy className="w-5 h-5 mr-2" />
                نسخ اللينك
              </Button>
            </div>
            
            <div className="flex justify-center gap-4">
              {socialButtons.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="glass-card hover:bg-white/20"
                  onClick={() => {
                    const message = `انضم معايا لـ Flous Cash واحصل على خدمات مالية متقدمة! ${referralLink}`;
                    let shareUrl = "";
                    
                    switch (social.name) {
                      case "واتساب":
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                        break;
                      case "فيسبوك":
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
                        break;
                      case "تويتر":
                        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                        break;
                      case "تليجرام":
                        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
                        break;
                    }
                    
                    if (shareUrl) {
                      window.open(shareUrl, '_blank');
                    }
                  }}
                >
                  <i className={`${social.icon} ${social.color} text-xl`}></i>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Referral Benefits */}
        <Card className="glass-card mt-12">
          <CardHeader>
            <CardTitle className="text-center">مميزات نظام الإحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">100</span>
                </div>
                <h4 className="font-medium mb-2">100 جنيه لكل إحالة</h4>
                <p className="text-sm text-gray-600">احصل على 100 جنيه مع كل صديق ينضم</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">∞</span>
                </div>
                <h4 className="font-medium mb-2">إحالات غير محدودة</h4>
                <p className="text-sm text-gray-600">لا يوجد حد أقصى لعدد الإحالات</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Medal className="text-white w-6 h-6" />
                </div>
                <h4 className="font-medium mb-2">مستويات عضوية</h4>
                <p className="text-sm text-gray-600">ارتقي لمستويات أعلى واحصل على مميزات إضافية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

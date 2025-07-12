import { AlertTriangle, Phone, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PaymentNoticeProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export default function PaymentNotice({ isChecked, onCheckedChange, className = "" }: PaymentNoticeProps) {
  return (
    <div className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-r-4 border-amber-400 dark:border-amber-500 rounded-lg p-6 mb-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-3">
            💸 رسوم الخدمة: 50 جنيه فقط
          </h3>
          
          <div className="space-y-2 mb-4">
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              يُرجى تحويل المبلغ على فودافون كاش
            </p>
            
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                01026751430
              </span>
              <span className="text-green-600 font-medium text-sm">
                ✅ الرقم الوحيد المعتمد
              </span>
            </div>
            
            <p className="text-amber-700 dark:text-amber-300 text-sm">
              بعد التحويل، كمّل التقديم واحنا هنتابع معاك فورًا
            </p>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="payment-confirmation"
              checked={isChecked}
              onCheckedChange={onCheckedChange}
              className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <Label
              htmlFor="payment-confirmation"
              className="text-amber-800 dark:text-amber-200 font-medium cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 inline ml-2" />
              أنا حوّلت على الرقم ومستعد أكمّل التقديم
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
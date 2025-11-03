import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const requirements = [
    {
      label: "Ít nhất 8 ký tự",
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      label: "Chứa chữ hoa",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
    {
      label: "Chứa chữ thường",
      test: (pwd: string) => /[a-z]/.test(pwd),
    },
    {
      label: "Chứa số",
      test: (pwd: string) => /\d/.test(pwd),
    },
    {
      label: "Chứa ký tự đặc biệt",
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    },
  ];

  const passedCount = requirements.filter((req) => req.test(password)).length;
  const strengthPercentage = (passedCount / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return "bg-red-500";
    if (strengthPercentage <= 40) return "bg-orange-500";
    if (strengthPercentage <= 60) return "bg-yellow-500";
    if (strengthPercentage <= 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strengthPercentage <= 20) return "Rất yếu";
    if (strengthPercentage <= 40) return "Yếu";
    if (strengthPercentage <= 60) return "Trung bình";
    if (strengthPercentage <= 80) return "Khá mạnh";
    return "Rất mạnh";
  };

  const getStrengthTextColor = () => {
    if (strengthPercentage <= 20) return "text-red-600";
    if (strengthPercentage <= 40) return "text-orange-600";
    if (strengthPercentage <= 60) return "text-yellow-600";
    if (strengthPercentage <= 80) return "text-lime-600";
    return "text-green-600";
  };

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-600">
            Độ mạnh mật khẩu:
          </span>
          <span className={`text-xs font-semibold ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strengthPercentage}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full ${getStrengthColor()} transition-colors duration-300`}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1.5">
        {requirements.map((req, idx) => {
          const passed = req.test(password);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center space-x-2 text-xs"
            >
              <div
                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  passed
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {passed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <span
                className={`transition-colors duration-200 ${
                  passed ? "text-green-600 font-medium" : "text-slate-500"
                }`}
              >
                {req.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


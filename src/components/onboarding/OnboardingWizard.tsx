import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Briefcase,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (data: OnboardingData) => void;
}

export interface OnboardingData {
  fullName: string;
  role: string;
  teamSize: string;
  useCase: string;
  goals: string[];
}

const createInitialData = (): OnboardingData => ({
  fullName: "",
  role: "",
  teamSize: "",
  useCase: "",
  goals: [],
});

const roles = [
  { value: "developer", label: "Developer / Engineer", icon: "💻" },
  { value: "designer", label: "Designer", icon: "🎨" },
  { value: "pm", label: "Product Manager", icon: "📊" },
  { value: "marketing", label: "Marketing", icon: "📱" },
  { value: "sales", label: "Sales", icon: "💼" },
  { value: "other", label: "Khác", icon: "✨" },
];

const teamSizes = [
  { value: "solo", label: "Chỉ mình tôi" },
  { value: "2-10", label: "2-10 người" },
  { value: "11-50", label: "11-50 người" },
  { value: "51+", label: "51+ người" },
];

const useCases = [
  { value: "personal", label: "Quản lý công việc cá nhân", icon: "👤" },
  { value: "team", label: "Cộng tác team", icon: "👥" },
  { value: "projects", label: "Quản lý dự án", icon: "📋" },
  { value: "client", label: "Quản lý khách hàng", icon: "🤝" },
];

const goals = [
  { value: "productivity", label: "Tăng năng suất", icon: "⚡" },
  { value: "organization", label: "Tổ chức công việc tốt hơn", icon: "📁" },
  { value: "collaboration", label: "Cải thiện cộng tác", icon: "🤝" },
  { value: "deadlines", label: "Theo dõi deadline", icon: "📅" },
  { value: "reporting", label: "Báo cáo & phân tích", icon: "📊" },
];

export default function OnboardingWizard({
  open,
  onClose,
  onComplete,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(createInitialData);

  const totalSteps = 4;

  useEffect(() => {
    if (open) {
      setStep(1);
      setData(createInitialData());
    }
  }, [open]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    onComplete?.(data);
    onClose();
  };

  const toggleGoal = (goalValue: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalValue)
        ? prev.goals.filter((g) => g !== goalValue)
        : [...prev.goals, goalValue],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.fullName.trim().length > 0;
      case 2:
        return data.role.length > 0 && data.teamSize.length > 0;
      case 3:
        return data.useCase.length > 0;
      case 4:
        return data.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-blue-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Chào Mừng Đến TaskFlow!
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Bước {step} / {totalSteps}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* Step 1: Name */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full mb-4">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Hãy Giới Thiệu Về Bạn
                  </h3>
                  <p className="text-slate-600">
                    Giúp chúng tôi cá nhân hóa trải nghiệm của bạn
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-semibold">
                      Tên của bạn <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      value={data.fullName}
                      onChange={(e) =>
                        setData({ ...data, fullName: e.target.value })
                      }
                      className="mt-2"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Role & Team Size */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                    <Briefcase className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Vai Trò & Đội Nhóm
                  </h3>
                  <p className="text-slate-600">
                    Giúp chúng tôi hiểu cách bạn làm việc
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Vai trò của bạn <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          onClick={() => setData({ ...data, role: role.value })}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            data.role === role.value
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="text-2xl mb-1">{role.icon}</div>
                          <div className="text-sm font-medium text-slate-900">
                            {role.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Quy mô team <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {teamSizes.map((size) => (
                        <button
                          key={size.value}
                          onClick={() =>
                            setData({ ...data, teamSize: size.value })
                          }
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            data.teamSize === size.value
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-900">
                            {size.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Use Case */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Bạn Sẽ Dùng TaskFlow Để Làm Gì?
                  </h3>
                  <p className="text-slate-600">
                    Chọn use case chính của bạn
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {useCases.map((useCase) => (
                    <button
                      key={useCase.value}
                      onClick={() =>
                        setData({ ...data, useCase: useCase.value })
                      }
                      className={`p-6 rounded-lg border-2 transition-all ${
                        data.useCase === useCase.value
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="text-4xl mb-3">{useCase.icon}</div>
                      <div className="text-sm font-medium text-slate-900">
                        {useCase.label}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Goals */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Mục Tiêu Của Bạn
                  </h3>
                  <p className="text-slate-600">
                    Chọn những gì bạn muốn đạt được (có thể chọn nhiều)
                  </p>
                </div>

                <div className="space-y-3">
                  {goals.map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => toggleGoal(goal.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        data.goals.includes(goal.value)
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="text-2xl">{goal.icon}</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-slate-900">
                          {goal.label}
                        </div>
                      </div>
                      {data.goals.includes(goal.value) && (
                        <CheckCircle className="h-5 w-5 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              {step === totalSteps ? "Hoàn thành" : "Tiếp theo"}
              {step === totalSteps ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


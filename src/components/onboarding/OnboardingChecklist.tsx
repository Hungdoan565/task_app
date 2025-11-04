import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface OnboardingChecklistProps {
  className?: string;
  actions?: Record<string, () => void>;
}

const CHECKLIST_STORAGE_KEY = "taskflow_onboarding_checklist";

const defaultChecklist: ChecklistItem[] = [
  {
    id: "complete-profile",
    title: "Hoàn thành hồ sơ",
    description: "Thêm ảnh đại diện và thông tin cá nhân",
    completed: false,
    actionLabel: "Cập nhật",
  },
  {
    id: "create-workspace",
    title: "Tạo workspace đầu tiên",
    description: "Tạo không gian làm việc cho dự án của bạn",
    completed: false,
    actionLabel: "Tạo workspace",
  },
  {
    id: "create-task",
    title: "Tạo task đầu tiên",
    description: "Thêm công việc để bắt đầu quản lý",
    completed: false,
    actionLabel: "Tạo task",
  },
  {
    id: "invite-member",
    title: "Mời thành viên",
    description: "Mời đồng đội tham gia workspace",
    completed: false,
    actionLabel: "Mời ngay",
  },
  {
    id: "explore-views",
    title: "Khám phá các view",
    description: "Dùng thử Kanban, Calendar và Timeline",
    completed: false,
    actionLabel: "Khám phá",
  },
  {
    id: "setup-notifications",
    title: "Cài đặt thông báo",
    description: "Cấu hình thông báo để không bỏ lỡ cập nhật",
    completed: false,
    actionLabel: "Cài đặt",
  },
];

export default function OnboardingChecklist({
  className = "",
  actions,
}: OnboardingChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    defaultChecklist.map((item) => ({ ...item }))
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Load checklist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setChecklist(
          Array.isArray(data.items) && data.items.length
            ? data.items.map((item: ChecklistItem) => ({ ...item }))
            : defaultChecklist.map((item) => ({ ...item }))
        );
        setIsDismissed(data.dismissed || false);
      } catch (e) {
        console.error("Failed to load checklist:", e);
      }
    }
  }, []);

  // Save checklist to localStorage
  useEffect(() => {
    localStorage.setItem(
      CHECKLIST_STORAGE_KEY,
      JSON.stringify({
        items: checklist.map(({ action, ...item }) => item),
        dismissed: isDismissed,
      })
    );
  }, [checklist, isDismissed]);

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progress = (completedCount / totalCount) * 100;
  const isComplete = completedCount === totalCount;

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handleRestore = () => {
    setIsDismissed(false);
    setIsExpanded(true);
  };

  if (isDismissed && !isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={className}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestore}
          className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          <Sparkles className="h-4 w-4" />
          Hiện lại hướng dẫn ({completedCount}/{totalCount})
        </Button>
      </motion.div>
    );
  }

  if (isDismissed && isComplete) {
    return null;
  }

  const resolvedChecklist = checklist.map((item) => ({
    ...item,
    action: actions?.[item.id],
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={className}
      >
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="text-lg">
                    Bắt Đầu Với TaskFlow
                  </CardTitle>
                </div>
                <p className="text-sm text-slate-600">
                  Hoàn thành {completedCount}/{totalCount} bước
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium"
                >
                  <CheckCircle className="h-4 w-4" />
                  Hoàn thành! Bạn đã sẵn sàng với TaskFlow 🎉
                </motion.div>
              )}
            </div>
          </CardHeader>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0 space-y-2">
                  {resolvedChecklist.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        item.completed
                          ? "bg-green-50 border border-green-200"
                          : "bg-white border border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {item.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300 hover:text-indigo-400 transition-colors" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm font-semibold ${
                            item.completed
                              ? "text-green-900 line-through"
                              : "text-slate-900"
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p
                          className={`text-xs mt-0.5 ${
                            item.completed ? "text-green-700" : "text-slate-600"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      {!item.completed && item.actionLabel && item.action && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={item.action}
                          className="text-xs text-indigo-600 hover:bg-indigo-50 flex-shrink-0"
                        >
                          {item.actionLabel}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}


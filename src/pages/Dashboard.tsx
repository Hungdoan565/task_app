import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useTasks } from "@/hooks/useTasks";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  LayoutDashboard,
  Calendar,
  ListTodo,
  Clock,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Plus,
  ArrowRight,
  Target,
  Zap,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import EmptyState from "@/components/ui/empty-state";
import ProductTour from "@/components/onboarding/ProductTour";
import OnboardingChecklist from "@/components/onboarding/OnboardingChecklist";
import OnboardingWizard, {
  OnboardingData,
} from "@/components/onboarding/OnboardingWizard";
import CreateWorkspaceDialog from "@/components/workspace/CreateWorkspaceDialog";

const WIZARD_STORAGE_KEY = "taskflow_onboarding_wizard_seen";

export default function Dashboard() {
  const { currentWorkspace, setCurrentWorkspace } = useStore();
  const { workspaces } = useWorkspaces();
  const { tasks } = useTasks(currentWorkspace?.id);
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

  // Auto-select first workspace if none selected
  useEffect(() => {
    if (!currentWorkspace && workspaces && workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  const hasWorkspaces = Boolean(workspaces && workspaces.length > 0);

  useEffect(() => {
    if (hasWorkspaces) return;
    const seenWizard = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!seenWizard) {
      const timer = setTimeout(() => setWizardOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [hasWorkspaces]);

  const handleWizardDismiss = useCallback(() => {
    setWizardOpen(false);
    localStorage.setItem(WIZARD_STORAGE_KEY, "true");
  }, []);

  const handleCreateWorkspace = useCallback(() => {
    setCreateWorkspaceOpen(true);
  }, []);

  const handleCreateTask = useCallback(() => {
    navigate("/tasks");
  }, [navigate]);

  const handleInviteMember = useCallback(() => {
    navigate("/settings?tab=team");
  }, [navigate]);

  const handleExploreViews = useCallback(() => {
    navigate("/kanban");
  }, [navigate]);

  const handleSetupNotifications = useCallback(() => {
    navigate("/settings?tab=notifications");
  }, [navigate]);

  const handleCompleteProfile = useCallback(() => {
    navigate("/settings?tab=profile");
  }, [navigate]);

  const handleGoToFeatures = useCallback(() => {
    navigate("/features");
  }, [navigate]);

  const handleWizardComplete = useCallback(
    (data: OnboardingData) => {
      localStorage.setItem(WIZARD_STORAGE_KEY, "true");
      setWizardOpen(false);

      if (!currentWorkspace) {
        setCreateWorkspaceOpen(true);
      }

      switch (data.useCase) {
        case "projects":
          navigate("/kanban");
          break;
        case "team":
          navigate("/dashboard");
          break;
        case "client":
          navigate("/tasks");
          break;
        default:
          break;
      }
    },
    [currentWorkspace, navigate]
  );

  const handleOpenWizard = useCallback(() => {
    setWizardOpen(true);
  }, []);

  const checklistActions = useMemo(
    () => ({
      "complete-profile": handleCompleteProfile,
      "create-workspace": handleCreateWorkspace,
      "create-task": handleCreateTask,
      "invite-member": handleInviteMember,
      "explore-views": handleExploreViews,
      "setup-notifications": handleSetupNotifications,
    }),
    [
      handleCompleteProfile,
      handleCreateWorkspace,
      handleCreateTask,
      handleInviteMember,
      handleExploreViews,
      handleSetupNotifications,
    ]
  );

  const todoTasks = tasks?.filter((t) => t.status === "todo") || [];
  const inProgressTasks =
    tasks?.filter((t) => t.status === "in_progress") || [];
  const doneTasks = tasks?.filter((t) => t.status === "done") || [];

  const dueSoonTasks =
    tasks?.filter((t) => {
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= today && dueDate <= weekFromNow;
    }) || [];

  const overdueTasks =
    tasks?.filter((t) => {
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      const today = new Date();
      return dueDate < today && t.status !== "done";
    }) || [];

  const highPriorityTasks =
    tasks?.filter((t) => t.priority === "high" && t.status !== "done") || [];

  const completionRate =
    tasks && tasks.length > 0
      ? Math.round((doneTasks.length / tasks.length) * 100)
      : 0;

  const statsCards = [
    {
      title: "Tổng Công Việc",
      value: tasks?.length || 0,
      description: "Tất cả trạng thái",
      icon: ListTodo,
      accent: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    },
    {
      title: "Cần Làm",
      value: todoTasks.length,
      description: "Chờ bắt đầu",
      icon: Target,
      accent: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      title: "Đang Làm",
      value: inProgressTasks.length,
      description: "Đang thực hiện",
      icon: Zap,
      accent: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      title: "Hoàn Thành",
      value: doneTasks.length,
      description: `${completionRate}% tổng số`,
      icon: CheckCircle,
      accent: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    },
  ];

  const activeTasks = tasks?.filter((t) => t.status !== "done") || [];
  const focusTasks = Array.from(
    new Map(
      [...dueSoonTasks, ...highPriorityTasks].map((task) => [task.id, task]),
    ).values(),
  )
    .sort((a, b) => {
      const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return aDue - bDue;
    })
    .slice(0, 4);

  const overdueRate =
    tasks && tasks.length > 0
      ? Math.round((overdueTasks.length / tasks.length) * 100)
      : 0;

  const activeRate =
    tasks && tasks.length > 0
      ? Math.round((activeTasks.length / tasks.length) * 100)
      : 0;

  const insightItems = [
    {
      title: "Mức độ hoàn thành",
      value: `${completionRate}%`,
      hint: completionRate >= 70 ? "Tiến độ tốt" : "Cần ưu tiên hoàn thiện",
    },
    {
      title: "Đang xử lý",
      value: `${activeTasks.length}`,
      hint: `${activeRate}% tổng số công việc đang mở`,
    },
    {
      title: "Sắp đến hạn",
      value: `${dueSoonTasks.length}`,
      hint: "Trong 7 ngày tiếp theo",
    },
    {
      title: "Quá hạn",
      value: `${overdueTasks.length}`,
      hint:
        overdueRate > 0
          ? `${overdueRate}% công việc cần xử lý`
          : "Không có công việc quá hạn",
    },
  ];

  const hasTasks = Boolean(tasks && tasks.length);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "text-purple-600 bg-purple-100";
      case "in_progress":
        return "text-blue-600 bg-blue-100";
      case "done":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "Cần Làm";
      case "in_progress":
        return "Đang Làm";
      case "done":
        return "Hoàn Thành";
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung Bình";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  const formatDueDate = (date?: string) => {
    if (!date) return "Không có hạn";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50">
      <ProductTour />
      <OnboardingWizard
        open={wizardOpen}
        onClose={handleWizardDismiss}
        onComplete={handleWizardComplete}
      />
      <CreateWorkspaceDialog
        open={createWorkspaceOpen}
        onOpenChange={setCreateWorkspaceOpen}
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 px-8 py-12 shadow-xl backdrop-blur"
          >
            <div className="absolute -right-24 -top-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">
                  <LayoutDashboard className="h-4 w-4" />
                  Tổng quan
                </div>
                <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl">
                  {currentWorkspace
                    ? `Bảng điều khiển của ${currentWorkspace.name}`
                    : "Quản lý công việc của bạn"}
                </h1>
                <p className="mt-3 text-base text-slate-600 md:text-lg">
                  {currentWorkspace
                    ? "Theo dõi tiến độ, ưu tiên công việc và nắm rõ các hạn quan trọng trong một nơi."
                    : "Tạo workspace đầu tiên để bắt đầu cộng tác và tổ chức công việc của bạn."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    className="cta-base cta-animated cta-primary px-6 py-2 text-sm"
                    data-tour="create-task"
                    onClick={handleCreateTask}
                  >
                    <Plus className="h-4 w-4" />
                    Tạo công việc
                  </Button>
                  <Button
                    variant="outline"
                    className="cta-base cta-animated cta-outline-indigo px-6 py-2 text-sm"
                    onClick={handleInviteMember}
                  >
                    <Users className="h-4 w-4" />
                    Mời thành viên
                  </Button>
                  <Button
                    variant="ghost"
                    className="cta-base px-6 py-2 text-sm"
                    onClick={handleOpenWizard}
                  >
                    <Sparkles className="h-4 w-4" />
                    Hướng dẫn nhanh
                  </Button>
                </div>
              </div>

              <div className="grid w-full max-w-sm gap-3 text-left">
                {hasTasks ? (
                  insightItems.slice(0, 3).map((insight) => (
                    <div
                      key={insight.title}
                      className="flex items-center justify-between rounded-2xl border border-indigo-50 bg-white/80 px-4 py-3 shadow-sm"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                        {insight.title}
                      </div>
                      <div className="text-lg font-semibold text-indigo-600">
                        {insight.value}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-5 py-6 text-sm text-slate-500 shadow-sm">
                    Hãy tạo công việc đầu tiên để xem các chỉ số hoạt động tại đây.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <OnboardingChecklist className="mb-8" actions={checklistActions} />
        {currentWorkspace ? (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="border border-slate-200/80 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div>
                        <CardTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {stat.title}
                        </CardTitle>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`rounded-xl px-2.5 py-2 text-sm font-medium ${stat.accent}`}
                      >
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-slate-500">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {hasTasks && (
              <div className="grid gap-6 mb-8 lg:grid-cols-[1.2fr,0.8fr]">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="h-full border border-slate-200 bg-white shadow-md">
                    <CardHeader className="flex items-center justify-between pb-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                          <Sparkles className="h-5 w-5 text-indigo-500" />
                          Tập trung hôm nay
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-slate-500">
                          Những công việc ưu tiên cao hoặc sắp đến hạn
                        </CardDescription>
                      </div>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {focusTasks.length ? `${focusTasks.length} việc` : "Đang rảnh"}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {focusTasks.length > 0 ? (
                        focusTasks.map((task) => (
                          <div
                            key={task.id}
                            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white/90 px-4 py-3 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/70"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-700">
                                {task.title}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span
                                  className={`rounded-full px-2.5 py-1 font-medium ${getStatusColor(
                                    task.status,
                                  )}`}
                                >
                                  {getStatusLabel(task.status)}
                                </span>
                                <span
                                  className={`rounded-full px-2.5 py-1 font-medium ${getPriorityColor(
                                    task.priority,
                                  )}`}
                                >
                                  {getPriorityLabel(task.priority)}
                                </span>
                                {task.due_date && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDueDate(task.due_date)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="ml-4 h-4 w-4 text-slate-300 group-hover:text-indigo-500" />
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-5 py-8 text-center text-sm text-slate-600">
                          <Sparkles className="mx-auto mb-3 h-6 w-6 text-indigo-400" />
                          Không có công việc ưu tiên lúc này. Hãy xem lại các task để đặt deadline hoặc gán mức ưu tiên.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="h-full border border-slate-200 bg-white shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        Snapshot hoạt động
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm text-slate-500">
                        Cập nhật realtime theo workspace
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {insightItems.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                          </div>
                          <span className="text-lg font-semibold text-indigo-600">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* Alert Cards Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Due Soon */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border border-orange-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg mr-3">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Sắp Đến Hạn</CardTitle>
                        <CardDescription>Trong 7 ngày tới</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {dueSoonTasks.length}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      công việc cần hoàn thành sớm
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Overdue */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card
                  className={`border ${
                    overdueTasks.length > 0
                      ? "border-red-200/80 bg-red-50"
                      : "border-slate-200 bg-white"
                  } shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div
                        className={`bg-gradient-to-r ${
                          overdueTasks.length > 0
                            ? "from-red-500 to-pink-500"
                            : "from-gray-400 to-gray-500"
                        } p-2 rounded-lg mr-3`}
                      >
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Quá Hạn</CardTitle>
                        <CardDescription>Cần xử lý ngay</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-3xl font-bold ${
                        overdueTasks.length > 0
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {overdueTasks.length}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {overdueTasks.length > 0
                        ? "công việc đã quá hạn"
                        : "Không có công việc quá hạn"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* High Priority */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border border-purple-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Ưu Tiên Cao</CardTitle>
                        <CardDescription>Cần chú ý đặc biệt</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {highPriorityTasks.length}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      công việc quan trọng
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-white border-2 border-gray-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-2xl text-slate-900">
                        <Sparkles className="mr-2 h-6 w-6 text-yellow-500" />
                        Công Việc Gần Đây
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">
                        Các công việc được tạo gần đây nhất
                      </CardDescription>
                    </div>
                    <Button className="cta-base cta-animated cta-primary px-4 py-2 text-sm">
                      <Plus className="h-4 w-4" />
                      Tạo mới
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {tasks && tasks.length > 0 ? (
                    <div className="space-y-3">
                      {tasks.slice(0, 6).map((task, idx) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + idx * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            {task.status === "done" ? (
                              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-semibold text-gray-900 mb-1 ${
                                  task.status === "done"
                                    ? "line-through text-gray-500"
                                    : ""
                                }`}
                              >
                                {task.title}
                              </h4>
                              <div className="flex items-center space-x-3 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full font-medium ${getStatusColor(
                                    task.status,
                                  )}`}
                                >
                                  {getStatusLabel(task.status)}
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full font-medium ${getPriorityColor(
                                    task.priority,
                                  )}`}
                                >
                                  {getPriorityLabel(task.priority)}
                                </span>
                                {task.due_date && (
                                  <span className="text-gray-500 flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(task.due_date).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-4 hover:bg-blue-50"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={ListTodo}
                      title="Chưa Có Công Việc Nào"
                      description="Bắt đầu bằng cách tạo task đầu tiên để theo dõi công việc và tăng năng suất của bạn."
                      action={{
                        label: "Tạo Công Việc Đầu Tiên",
                        onClick: () => {
                          // TODO: Open create task modal
                          console.log("Open create task modal");
                        },
                      }}
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Overview */}
            {tasks && tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8"
              >
                <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          Tỷ Lệ Hoàn Thành
                        </h3>
                        <p className="text-blue-100 text-lg">
                          {doneTasks.length} / {tasks.length} công việc đã hoàn
                          thành
                        </p>
                      </div>
                      <div className="text-6xl font-bold">
                        {completionRate}%
                      </div>
                    </div>
                    <div className="mt-6 bg-white/20 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="bg-white h-full rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Users}
            title="Chào Mừng Đến Với TaskFlow!"
            description="Tạo workspace đầu tiên để bắt đầu quản lý công việc và cộng tác với nhóm của bạn một cách hiệu quả."
            action={{
              label: "Tạo Workspace",
              onClick: handleCreateWorkspace,
            }}
            secondaryAction={{
              label: "Tìm Hiểu Thêm",
              onClick: handleGoToFeatures,
            }}
            illustration={
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl inline-block">
                <Users className="h-24 w-24 text-indigo-400" />
              </div>
            }
          />
        )}
      </div>
    </main>
  );
}

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
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
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
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import EmptyState from "@/components/ui/empty-state";
import ProductTour from "@/components/onboarding/ProductTour";
import OnboardingChecklist from "@/components/onboarding/OnboardingChecklist";
import OnboardingWizard, {
  OnboardingData,
} from "@/components/onboarding/OnboardingWizard";
import InviteMemberDialog from "@/components/workspace/InviteMemberDialog";
import TaskDialog from "@/components/tasks/TaskDialog";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { TaskListSkeleton } from "@/components/tasks/TaskListSkeleton";
import { ActivityFeedSkeleton } from "@/components/dashboard/ActivityFeedSkeleton";
import { useActivityLogs } from "@/hooks/useActivityLogs";

const WIZARD_STORAGE_KEY = "taskflow_onboarding_wizard_seen";

export default function Dashboard() {
  const {
    currentWorkspace,
    setCurrentWorkspace,
    setCreateWorkspaceOpen,
    inviteDialogOpen,
    setInviteDialogOpen,
    taskDialogOpen,
    setTaskDialogOpen,
  } = useStore();
  const { workspaces } = useWorkspaces();
  const {
    tasks,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
  } = useTasks({ workspaceId: currentWorkspace?.id });
  const { activities, isLoading: activityLoading } = useActivityLogs({
    workspaceId: currentWorkspace?.id,
    limit: 20,
  });
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);
  const containerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
  const isTasksInitialLoading = tasksLoading && typeof tasks === "undefined";
  const showSectionSkeleton = tasksFetching && !isTasksInitialLoading;
  const activityInitialLoading = activityLoading && activities.length === 0;

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
  }, [setCreateWorkspaceOpen]);

  const handleCreateTask = useCallback(() => {
    if (!currentWorkspace) {
      setCreateWorkspaceOpen(true);
      return;
    }
    setTaskDialogOpen(true);
  }, [currentWorkspace, setCreateWorkspaceOpen, setTaskDialogOpen]);

  const handleInviteMember = useCallback(() => {
    if (!currentWorkspace) {
      setCreateWorkspaceOpen(true);
      return;
    }
    setInviteDialogOpen(true);
  }, [currentWorkspace, setCreateWorkspaceOpen, setInviteDialogOpen]);

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

  const completionRate =
    tasks && tasks.length > 0
      ? Math.round((doneTasks.length / tasks.length) * 100)
      : 0;

  const activeTasks = tasks?.filter((t) => t.status !== "done") || [];

  const overdueRate =
    tasks && tasks.length > 0
      ? Math.round((overdueTasks.length / tasks.length) * 100)
      : 0;

  const activeRate =
    tasks && tasks.length > 0
      ? Math.round((activeTasks.length / tasks.length) * 100)
      : 0;

  const tasksCreatedStats = useMemo(() => {
    const list = tasks ?? [];
    if (list.length === 0) {
      return {
        createdCurrent: 0,
        createdPrevious: 0,
        trendValue: 0,
        trendDirection: "up" as "up" | "down",
      };
    }

    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const currentWindowStart = now - weekMs;
    const previousWindowStart = currentWindowStart - weekMs;

    let createdCurrent = 0;
    let createdPrevious = 0;

    list.forEach((task) => {
      if (!task.created_at) return;
      const createdTs = new Date(task.created_at).getTime();
      if (Number.isNaN(createdTs)) return;
      if (createdTs >= currentWindowStart) {
        createdCurrent += 1;
        return;
      }
      if (createdTs >= previousWindowStart && createdTs < currentWindowStart) {
        createdPrevious += 1;
      }
    });

    const delta = createdPrevious === 0
      ? createdCurrent > 0
        ? 100
        : 0
      : Math.round(((createdCurrent - createdPrevious) / createdPrevious) * 100);

    return {
      createdCurrent,
      createdPrevious,
      trendValue: Math.abs(delta),
      trendDirection: delta >= 0 ? ("up" as const) : ("down" as const),
    };
  }, [tasks]);

  const dueSoonList = useMemo(() => {
    return [...dueSoonTasks]
      .sort((a, b) => {
        const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return aDue - bDue;
      })
      .slice(0, 5);
  }, [dueSoonTasks]);

  const overdueList = useMemo(() => {
    return [...overdueTasks]
      .sort((a, b) => {
        const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return aDue - bDue;
      })
      .slice(0, 5);
  }, [overdueTasks]);

  const recentTasks = useMemo(() => {
    const list = tasks ?? [];
    return [...list].sort((a, b) => {
      const aCreated = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bCreated = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bCreated - aCreated;
    });
  }, [tasks]);

const statsCards = useMemo(
    () => {
      const totalCount = tasks?.length ?? 0;
      return [
        {
          title: "Tổng công việc",
          value: totalCount,
          description:
            tasksCreatedStats.createdCurrent > 0
              ? `${tasksCreatedStats.createdCurrent} việc mới trong 7 ngày`
              : "Không có việc mới trong 7 ngày",
          icon: ListTodo,
          iconClassName: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200",
          trend:
            tasksCreatedStats.trendValue > 0
              ? {
                  value: tasksCreatedStats.trendValue,
                  direction: tasksCreatedStats.trendDirection,
                  label: "So với 7 ngày trước",
                }
              : undefined,
        },
        {
          title: "Đang mở",
          value: activeTasks.length,
          description: `${activeRate}% tổng số đang xử lý`,
          icon: Target,
          iconClassName: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-200",
        },
        {
          title: "Hoàn thành",
          value: doneTasks.length,
          description: `${completionRate}% đã hoàn tất`,
          icon: CheckCircle,
          iconClassName: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200",
        },
        {
          title: "Quá hạn",
          value: overdueTasks.length,
          description:
            overdueTasks.length > 0
              ? `${overdueRate}% cần xử lý`
              : "Không có việc quá hạn",
          icon: AlertCircle,
          iconClassName: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-200",
        },
      ];
    },
    [
      tasks,
      activeTasks.length,
      activeRate,
      doneTasks.length,
      completionRate,
      overdueTasks.length,
      overdueRate,
      tasksCreatedStats,
    ],
  );

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

  const getStatusLabel = useCallback((status: string) => {
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
  }, []);

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

  const statusBreakdown = useMemo(() => {
    const list = tasks ?? [];
    if (list.length === 0) {
      return [] as Array<{
        key: string;
        label: string;
        count: number;
        percent: number;
        color?: string | null;
      }>;
    }

    const map = new Map<string, { key: string; label: string; count: number; color?: string | null }>();

    list.forEach((task) => {
      const key = task.status_info?.key ?? task.status ?? "unknown";
      const label = task.status_info?.name ?? getStatusLabel(task.status);
      const color = task.status_info?.color ?? null;
      const entry = map.get(key);
      if (entry) {
        entry.count += 1;
      } else {
        map.set(key, { key, label, color, count: 1 });
      }
    });

    return Array.from(map.values())
      .map((item) => ({
        ...item,
        percent: list.length > 0 ? Math.round((item.count / list.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [tasks, getStatusLabel]);

  const formatDueDate = (date?: string) => {
    if (!date) return "Không có hạn";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ProductTour />
      <OnboardingWizard
        open={wizardOpen}
        onClose={handleWizardDismiss}
        onComplete={handleWizardComplete}
      />
      {currentWorkspace && (
        <InviteMemberDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
          workspaceId={currentWorkspace.id}
          workspaceName={currentWorkspace.name}
        />
      )}

      {currentWorkspace && (
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          workspaceId={currentWorkspace.id}
          workspaceMembersOverride={currentWorkspace.members}
          onSuccess={() => setTaskDialogOpen(false)}
        />
      )}

      <section className="relative overflow-hidden border-b border-slate-100 dark:border-slate-900">
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-blue-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
          aria-hidden="true"
        />
        <div className={`${containerClass} relative z-10 pt-16 pb-12`}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/90 px-8 py-12 shadow-xl backdrop-blur dark:border-indigo-500/20 dark:bg-slate-900/80"
          >
            <div className="pointer-events-none absolute -right-24 -top-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/20" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                  <LayoutDashboard className="h-4 w-4" />
                  Tổng quan
                </div>
                <h1 className="mt-5 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                  {currentWorkspace
                    ? `Bảng điều khiển của ${currentWorkspace.name}`
                    : "Quản lý công việc của bạn"}
                </h1>
                <p className="mt-3 text-base text-slate-600 md:text-lg dark:text-slate-300">
                  {currentWorkspace
                    ? "Theo dõi tiến độ, ưu tiên công việc và nắm rõ các hạn quan trọng trong một nơi."
                    : "Tạo workspace đầu tiên để bắt đầu cộng tác và tổ chức công việc của bạn."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    className="rounded-full px-6 shadow-sm"
                    data-tour="create-task"
                    onClick={handleCreateTask}
                  >
                    <Plus className="h-4 w-4" />
                    Tạo công việc
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={handleInviteMember}
                  >
                    <Users className="h-4 w-4" />
                    Mời thành viên
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full px-6 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-200"
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
                      className="flex items-center justify-between rounded-2xl border border-indigo-50 bg-white/80 px-4 py-3 shadow-sm dark:border-indigo-500/20 dark:bg-slate-900/60"
                    >
                      <div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                        {insight.title}
                      </div>
                      <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                        {insight.value}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-5 py-6 text-sm text-slate-500 shadow-sm dark:border-indigo-500/20 dark:bg-slate-900/60 dark:text-slate-300">
                    Hãy tạo công việc đầu tiên để xem các chỉ số hoạt động tại đây.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className={`${containerClass}`}>
          <OnboardingChecklist
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
            actions={checklistActions}
          />
        </div>
      </section>

      <section className="pb-16">
        <div className={`${containerClass} space-y-8`}>
          {currentWorkspace ? (
            <>
              {isTasksInitialLoading ? (
                <DashboardSkeleton />
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, idx) => {
                      const displayValue =
                        typeof stat.value === "number"
                          ? stat.value.toLocaleString("vi-VN")
                          : stat.value;
                      return (
                        <motion.div
                          key={stat.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <MetricCard
                            title={stat.title}
                            value={displayValue}
                            description={stat.description}
                            icon={stat.icon}
                            trend={stat.trend}
                            iconClassName={stat.iconClassName}
                            className="border border-slate-200/80 bg-white/90 dark:border-slate-700/50 dark:bg-slate-900/80"
                          />
                        </motion.div>
                      );
                    })}
                  </div>

                  {showSectionSkeleton && !hasTasks && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <TaskListSkeleton rows={4} />
                      <ActivityFeedSkeleton items={4} />
                    </div>
                  )}

                  {hasTasks && (
                    <>
                      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="h-full border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                          <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                          Phân bố trạng thái
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Tỷ lệ công việc theo workflow hiện tại
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {statusBreakdown.length > 0 ? (
                          statusBreakdown.map((status) => (
                            <div key={status.key} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                  {status.label}
                                </span>
                                <span className="text-muted-foreground">
                                  {status.count} • {status.percent}%
                                </span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${status.percent}%`,
                                    backgroundColor: status.color || "#6366f1",
                                  }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Chưa có công việc nào trong workflow này.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="h-full border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                          <TrendingUp className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                          Chỉ số nhanh
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Tình hình tổng quan của workspace
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {insightItems.map((item) => (
                          <div
                            key={item.title}
                            className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.hint}</p>
                            </div>
                            <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                      <div className="grid gap-6 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Card className="h-full border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                              <Clock className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                              Sắp đến hạn (7 ngày)
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Ưu tiên xử lý sớm các công việc dưới đây
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {dueSoonTasks.length} việc
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dueSoonList.length > 0 ? (
                          dueSoonList.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/60 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900 dark:text-white">
                                  {task.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDueDate(task.due_date ?? undefined)}
                                  </span>
                                  <span className={`rounded-full px-2.5 py-1 font-medium ${getStatusColor(task.status)}`}>
                                    {getStatusLabel(task.status)}
                                  </span>
                                  <span className={`rounded-full px-2.5 py-1 font-medium ${getPriorityColor(task.priority)}`}>
                                    {getPriorityLabel(task.priority)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-5 py-6 text-sm text-slate-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-slate-300">
                            Không có công việc nào sắp đến hạn.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="h-full border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-xl text-slate-900 dark:text-white">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                              Công việc quá hạn
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                              Theo dõi và xử lý ngay các công việc trễ hạn
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {overdueTasks.length} việc
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {overdueList.length > 0 ? (
                          overdueList.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 dark:border-red-500/40 dark:bg-red-500/10"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-red-600 dark:text-red-300">
                                  {task.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-red-500 dark:text-red-300">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDueDate(task.due_date ?? undefined)}
                                  </span>
                                  <span className={`rounded-full px-2.5 py-1 font-medium bg-white/70 text-red-600 dark:bg-red-500/20 dark:text-red-200`}>
                                    {getStatusLabel(task.status)}
                                  </span>
                                  <span className={`rounded-full px-2.5 py-1 font-medium bg-white/70 text-red-600 dark:bg-red-500/20 dark:text-red-200`}>
                                    {getPriorityLabel(task.priority)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="rounded-2xl border border-dashed border-red-200 bg-red-50/80 px-5 py-6 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                            Không có công việc nào quá hạn.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                      </div>
                    </>
                  )}
                </>
              )}

            {/* Recent Tasks */}
            {showSectionSkeleton ? (
              <TaskListSkeleton rows={5} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="bg-white border-2 border-gray-200 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-2xl text-slate-900 dark:text-white">
                          <Sparkles className="mr-2 h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                          Công Việc Gần Đây
                        </CardTitle>
                        <CardDescription className="mt-1 text-base dark:text-slate-400">
                          Các công việc được tạo gần đây nhất
                        </CardDescription>
                      </div>
                      <Button size="default" className="rounded-full px-6" onClick={handleCreateTask}>
                        <Plus className="h-4 w-4" />
                        Tạo mới
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recentTasks.length > 0 ? (
                      <div className="space-y-3">
                        {recentTasks.slice(0, 6).map((task, idx) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + idx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-850 dark:hover:border-indigo-500"
                          >
                            <div className="flex items-center space-x-4 flex-1">
                              {task.status === "done" ? (
                                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 dark:text-green-400" />
                              ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex-shrink-0 dark:border-slate-600" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-semibold text-gray-900 mb-1 dark:text-white ${
                                    task.status === "done"
                                      ? "line-through text-gray-500 dark:text-slate-500"
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
                                    <span className="text-gray-500 flex items-center dark:text-slate-400">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {new Date(task.due_date).toLocaleDateString("vi-VN")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-4 hover:bg-blue-50 dark:hover:bg-indigo-500/20"
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
                          onClick: handleCreateTask,
                        }}
                        className="py-12"
                      />
                    )}

                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              {activityInitialLoading ? (
                <ActivityFeedSkeleton items={6} />
              ) : (
                <ActivityFeed
                  activities={activities}
                  isLoading={activityLoading && activities.length === 0}
                />
              )}
            </motion.div>

            {/* Progress Overview */}
            {tasks && tasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 shadow-2xl dark:from-indigo-600 dark:to-purple-700">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-white">
                          Tỷ Lệ Hoàn Thành
                        </h3>
                        <p className="text-blue-100 text-lg dark:text-indigo-100">
                          {doneTasks.length} / {tasks.length} công việc đã hoàn
                          thành
                        </p>
                      </div>
                      <div className="text-6xl font-bold text-white">
                        {completionRate}%
                      </div>
                    </div>
                    <div className="mt-6 bg-white/20 rounded-full h-4 overflow-hidden dark:bg-white/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="bg-white h-full rounded-full shadow-lg"
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
              <div className="inline-block rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 dark:from-slate-900 dark:to-slate-800">
                <Users className="h-24 w-24 text-indigo-400" />
              </div>
            }
            className="py-16"
            />
          )}
        </div>
      </section>
    </main>
  );
}

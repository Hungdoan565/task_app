import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useTasks } from "@/hooks/useTasks";
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

export default function Dashboard() {
  const { currentWorkspace, setCurrentWorkspace } = useStore();
  const { workspaces } = useWorkspaces();
  const { tasks } = useTasks(currentWorkspace?.id);

  // Auto-select first workspace if none selected
  useEffect(() => {
    if (!currentWorkspace && workspaces && workspaces.length > 0) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Cần Làm",
      value: todoTasks.length,
      description: "Chờ bắt đầu",
      icon: Target,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      title: "Đang Làm",
      value: inProgressTasks.length,
      description: "Đang thực hiện",
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
    },
    {
      title: "Hoàn Thành",
      value: doneTasks.length,
      description: `${completionRate}% tổng số`,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-2">
              <LayoutDashboard className="h-8 w-8 mr-3" />
              <h1 className="text-4xl font-bold">Bảng Điều Khiển</h1>
            </div>
            <p className="text-lg text-blue-100">
              {currentWorkspace
                ? `Chào mừng đến với ${currentWorkspace.name}`
                : "Chọn hoặc tạo workspace để bắt đầu"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
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
                  whileHover={{ y: -8 }}
                >
                  <Card
                    className={`bg-gradient-to-br ${stat.bgGradient} border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-semibold text-gray-700">
                        {stat.title}
                      </CardTitle>
                      <div
                        className={`bg-gradient-to-r ${stat.gradient} p-2 rounded-lg`}
                      >
                        <stat.icon className="h-5 w-5 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Alert Cards Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Due Soon */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white border-2 border-orange-200 hover:shadow-xl transition-shadow duration-300">
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card
                  className={`bg-white border-2 ${
                    overdueTasks.length > 0
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  } hover:shadow-xl transition-shadow duration-300`}
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-white border-2 border-purple-200 hover:shadow-xl transition-shadow duration-300">
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
                      <CardTitle className="text-2xl flex items-center">
                        <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                        Công Việc Gần Đây
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        Các công việc được tạo gần đây nhất
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo Mới
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
                    <div className="text-center py-16">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl max-w-md mx-auto">
                        <ListTodo className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 mb-6 text-lg font-medium">
                          Chưa có công việc nào
                        </p>
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Tạo Công Việc Đầu Tiên
                        </Button>
                      </div>
                    </div>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-2xl">
              <CardHeader>
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mr-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl">Bắt Đầu Ngay</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Tạo workspace đầu tiên để bắt đầu quản lý công việc
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  Workspace giúp bạn tổ chức các dự án khác nhau và cộng tác với
                  các thành viên trong nhóm một cách hiệu quả.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 h-12"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Tạo Workspace
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { useCallback } from "react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Target,
  Users,
  Zap,
  Star,
  ArrowRight,
  Check,
  TrendingUp,
  BarChart3,
  Layers,
  Bell,
  Lock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";

// Animated Stat Counter Component
interface StatCounterProps {
  end: number;
  suffix?: string;
  decimals?: number;
  label: string;
}

const StatCounter = ({
  end,
  suffix = "",
  decimals = 0,
  label,
}: StatCounterProps) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold text-white mb-2">
        {inView && (
          <CountUp
            end={end}
            duration={2.5}
            suffix={suffix}
            decimals={decimals}
            separator=","
          />
        )}
        {!inView && <span className="opacity-0">0</span>}
      </p>
      <p className="text-indigo-200 text-sm md:text-base font-medium">{label}</p>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleFooterLink = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, path: string) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();

      const html = document.documentElement;
      const previousBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previousBehavior;

      navigate(path);
    },
    [navigate]
  );

  const features = [
    {
      icon: Target,
      title: "Quản Lý Công Việc Thông Minh",
      description:
        "Tổ chức và ưu tiên công việc một cách hiệu quả với bảng Kanban trực quan. Luôn nắm rõ việc nào cần làm trước.",
      iconColor: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Bell,
      title: "Nhắc Nhở Tự Động",
      description:
        "Không bao giờ bỏ lỡ deadline với hệ thống thông báo thông minh. Nhận nhắc nhở đúng lúc cho mọi công việc quan trọng.",
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Cộng Tác Nhóm",
      description:
        "Làm việc nhóm hiệu quả với tính năng chia sẻ và phân công công việc. Mọi người luôn đồng bộ với nhau.",
      iconColor: "bg-purple-100 text-purple-600",
    },
    {
      icon: Zap,
      title: "Tăng Năng Suất",
      description:
        "Tiết kiệm thời gian với giao diện tối giản và quy trình làm việc được tối ưu hóa. Tập trung vào việc quan trọng.",
      iconColor: "bg-amber-100 text-amber-600",
    },
    {
      icon: BarChart3,
      title: "Báo Cáo Chi Tiết",
      description:
        "Theo dõi tiến độ công việc với biểu đồ và thống kê trực quan. Đánh giá hiệu suất và cải thiện liên tục.",
      iconColor: "bg-green-100 text-green-600",
    },
    {
      icon: Lock,
      title: "Bảo Mật Cao",
      description:
        "Dữ liệu của bạn được bảo vệ với mã hóa end-to-end. Sao lưu tự động đảm bảo không mất mát thông tin.",
      iconColor: "bg-red-100 text-red-600",
    },
  ];

  const testimonials = [
    {
      quote:
        "TaskFlow đã thay đổi cách làm việc của team chúng tôi. Giờ đây mọi thứ đều rõ ràng và có tổ chức hơn nhiều.",
      name: "Nguyễn Minh Tuấn",
      role: "Quản Lý Dự Án",
      rating: 5,
      company: "Tech Corp",
    },
    {
      quote:
        "Giao diện đơn giản nhưng đầy đủ tính năng cần thiết. Đặc biệt thích tính năng nhắc nhở tự động.",
      name: "Trần Thu Hà",
      role: "Product Manager",
      rating: 5,
      company: "StartUp Inc",
    },
    {
      quote:
        "Tốt nhất cho freelancer như tôi. Quản lý nhiều dự án cùng lúc chưa bao giờ dễ dàng đến thế.",
      name: "Lê Đức Anh",
      role: "Freelance Developer",
      rating: 5,
      company: "Independent",
    },
  ];

  const stats = [
    { end: 10000, suffix: "+", label: "Người Dùng" },
    { end: 50000, suffix: "+", label: "Công Việc Đã Hoàn Thành" },
    { end: 99.9, suffix: "%", decimals: 1, label: "Uptime" },
    { end: 24, suffix: "/7", label: "Hỗ Trợ" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <SEO
        title="Trang Chủ - Quản Lý Công Việc Hiệu Quả"
        description="TaskFlow - Ứng dụng quản lý công việc chuyên nghiệp. Tăng năng suất, tổ chức công việc thông minh, và không bao giờ bỏ lỡ deadline."
        path="/"
      />

      <div className="min-h-screen bg-white">
        <NavigationBar />

        <main id="main-content">

        {/* Hero Section */}
        <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)`,
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          {/* Floating Shapes - Subtle */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-6 border border-indigo-100"
                >
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-indigo-900">
                    Được tin dùng bởi 10,000+ người dùng
                  </span>
                </motion.div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="text-slate-900">Quản Lý Công Việc</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Thông Minh & Hiệu Quả
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                  TaskFlow giúp bạn tổ chức công việc, tăng năng suất và đạt được mục tiêu một cách dễ dàng hơn bao giờ hết.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to="/signup">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto text-base px-8 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Bắt Đầu Miễn Phí
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to="/features">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto text-base px-8 h-12 border-2 border-slate-300 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                      >
                        Tìm Hiểu Thêm
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Miễn phí mãi mãi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Không cần thẻ tín dụng</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Thiết lập trong 2 phút</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative mt-16"
              >
                <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 p-2 md:p-4">
                  {/* Browser Chrome */}
                  <div className="flex items-center space-x-2 bg-slate-100 rounded-t-lg px-4 py-2 mb-2">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-white rounded px-4 py-1 text-xs text-slate-500">
                        app.taskflow.vn
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Mockup */}
                  <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid grid-cols-12 gap-4 h-full p-4">
                        {[...Array(36)].map((_, i) => (
                          <div key={i} className="bg-slate-400 rounded" />
                        ))}
                      </div>
                    </div>

                    <div className="text-center relative z-10">
                      <Layers className="h-16 md:h-20 w-16 md:w-20 mx-auto mb-4 text-indigo-600" />
                      <p className="text-slate-700 text-base md:text-lg font-semibold mb-2">
                        Dashboard Trực Quan
                      </p>
                      <p className="text-slate-500 text-sm">
                        Theo dõi công việc một cách dễ dàng
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl p-3 shadow-xl hidden md:block">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 shadow-xl hidden md:block">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trusted By Logos Section */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wider">
                Được tin dùng bởi các đội nhóm hàng đầu
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 max-w-5xl mx-auto opacity-60">
                {/* Logo placeholders - replace with actual logos later */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg" />
                  <span className="font-bold text-xl text-slate-700">TechCorp</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                  <span className="font-bold text-xl text-slate-700">StartupInc</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg" />
                  <span className="font-bold text-xl text-slate-700">DevTeam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg" />
                  <span className="font-bold text-xl text-slate-700">Agency+</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg" />
                  <span className="font-bold text-xl text-slate-700">DesignHub</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <StatCounter {...stat} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Tính Năng Nổi Bật
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Mọi thứ bạn cần để quản lý công việc hiệu quả
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 md:p-8 h-full hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-indigo-200 bg-white group">
                    <div
                      className={`${feature.iconColor} p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Bắt Đầu Dễ Dàng
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Chỉ 3 bước đơn giản để bắt đầu với TaskFlow
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Đăng Ký Tài Khoản",
                  description:
                    "Tạo tài khoản miễn phí chỉ trong vài giây. Không cần thẻ tín dụng.",
                  icon: Users,
                },
                {
                  step: "02",
                  title: "Tạo Dự Án Đầu Tiên",
                  description:
                    "Thêm công việc, đặt deadline và tổ chức theo cách của bạn.",
                  icon: Target,
                },
                {
                  step: "03",
                  title: "Theo Dõi Tiến Độ",
                  description:
                    "Nhận thông báo, cập nhật trạng thái và hoàn thành mục tiêu.",
                  icon: TrendingUp,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.5 }}
                  className="relative"
                >
                  <Card className="p-8 text-center h-full bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {item.step}
                    </div>

                    <div className="mt-4 mb-6">
                      <div className="bg-indigo-100 text-indigo-600 p-4 rounded-lg w-fit mx-auto">
                        <item.icon className="h-8 w-8" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </Card>

                  {/* Connecting Arrow */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-indigo-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Khách Hàng Nói Gì
              </h2>
              <p className="text-lg md:text-xl text-slate-600">
                Những đánh giá chân thực từ người dùng
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 md:p-8 h-full bg-white hover:shadow-lg transition-all duration-300 border border-slate-200">
                    {/* Stars */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-700 mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center pt-4 border-t border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm mr-4">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-slate-500">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-600 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Sẵn Sàng Tăng Năng Suất?
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
                Tham gia cùng hàng nghìn người dùng đang quản lý công việc hiệu quả hơn với TaskFlow
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="text-base md:text-lg px-8 md:px-10 h-12 md:h-14 bg-white text-indigo-600 hover:bg-slate-50 shadow-2xl font-semibold"
                  >
                    Bắt Đầu Miễn Phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              <p className="text-sm text-indigo-200 mt-6">
                Miễn phí mãi mãi • Không cần thẻ tín dụng • Hỗ trợ 24/7
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-8 w-8 text-indigo-500" />
                  <span className="text-xl md:text-2xl font-bold text-white">
                    TaskFlow
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Quản lý công việc thông minh cho mọi người
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
                  Sản Phẩm
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/features"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/features")}
                    >
                      Tính Năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/downloads"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/downloads")}
                    >
                      Downloads
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pricing"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/pricing")}
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
                  Giải Pháp
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/ai-development"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/ai-development")}
                    >
                      AI Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/enterprise"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/enterprise")}
                    >
                      Enterprise
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/about")}
                    >
                      Về Chúng Tôi
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
                  Hỗ Trợ
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/contact")}
                    >
                      Liên Hệ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/dashboard")}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/help"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      Trung Tâm Trợ Giúp
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pt-8 text-center">
              <p className="text-sm text-slate-400">
                © 2024 TaskFlow. Được phát triển tại Việt Nam
              </p>
            </div>
          </div>
        </footer>
        </main>
      </div>
    </>
  );
}
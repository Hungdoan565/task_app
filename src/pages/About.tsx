import { useCallback } from "react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  Shield,
  Zap,
  Heart,
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";

/**
 * About Page Component
 *
 * Displays company story, mission, values, timeline, team, and statistics.
 * Designed with consistent indigo-blue color scheme, unified typography scale,
 * and standardized spacing to match the overall design system.
 */
export default function AboutPage() {
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

  // Core values data - principles that guide the company
  const values = [
    {
      icon: Zap,
      title: "Đơn Giản Là Trên Hết",
      description:
        "Mọi tính năng phải trực quan. Nếu cần hướng dẫn phức tạp, chúng tôi sẽ thiết kế lại. Quản lý công việc nên đơn giản và dễ hiểu.",
    },
    {
      icon: Shield,
      title: "Bảo Mật Quan Trọng",
      description:
        "Dữ liệu của bạn là của bạn. Chúng tôi không bán, không chia sẻ. Mã hóa cấp ngân hàng và tuân thủ GDPR.",
    },
    {
      icon: Heart,
      title: "Luôn Cải Tiến",
      description:
        "Cập nhật mỗi tuần. Lắng nghe phản hồi người dùng nghiêm túc. Cải thiện liên tục là DNA của chúng tôi.",
    },
  ];

  // Company timeline - key milestones in the journey
  const timeline = [
    {
      period: "Q1 2024",
      event: "Khởi Nguồn Ý Tưởng",
      description: "Bắt đầu từ sự thất vọng với các ứng dụng phức tạp",
    },
    {
      period: "Q2 2024",
      event: "Phiên Bản Đầu Tiên",
      description: "MVP với các tính năng cốt lõi",
    },
    {
      period: "Q3 2024",
      event: "Beta Riêng Tư",
      description: "100 người dùng, phản hồi quý giá",
    },
    {
      period: "Q4 2024",
      event: "Ra Mắt Công Khai",
      description: "10,000+ người dùng hài lòng",
    },
  ];

  // Key statistics showcasing product success
  const stats = [
    { icon: Users, value: "10,000+", label: "Người Dùng" },
    { icon: TrendingUp, value: "50,000+", label: "Task Hoàn Thành" },
    { icon: Award, value: "99.9%", label: "Thời Gian Hoạt Động" },
    { icon: Target, value: "10h", label: "Tiết Kiệm/Tuần" },
  ];

  return (
    <>
      <SEO
        title="Về Chúng Tôi"
        description="Tìm hiểu về sứ mệnh của TaskFlow là làm cho quản lý công việc trở nên đơn giản và thú vị. Được xây dựng cho những người yêu thích năng suất ở khắp nơi."
        path="/about"
      />

      <div className="min-h-screen bg-white">
        <NavigationBar />

        <main id="main-content">
          {/* Hero Section - Storytelling-focused hero for About page - establishes emotional connection through founder story */}
          <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)`,
                  backgroundSize: "48px 48px",
                }}
              />
            </div>

            {/* Floating Shapes - 3 blobs with staggered animation */}
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
                  {/* Story Badge - provides context */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-6 border border-indigo-100"
                  >
                    <Heart className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-900">
                      Câu chuyện của chúng tôi
                    </span>
                  </motion.div>

                  {/* Problem-based Heading - establishes relatable hook */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-snug max-w-4xl mx-auto">
                    <span className="text-slate-900">Bắt Đầu Từ Sự Thất Vọng</span>
                    <br />
                    <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Với Công Cụ Quá Phức Tạp
                    </span>
                  </h1>

                  {/* Opening Paragraphs - the 'why' story */}
                  <div className="max-w-3xl mx-auto space-y-4 mb-12">
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                      Chúng tôi nhận ra rằng nhiều ứng dụng quản lý công việc ngày nay đã trở nên quá phức tạp, với vô số tính năng mà hầu hết mọi người không bao giờ sử dụng. Thay vì giúp công việc trở nên dễ dàng hơn, chúng lại tạo thêm gánh nặng.
                    </p>
                    <p className="text-lg md:text-xl text-slate-900 font-semibold leading-relaxed">
                      Chúng tôi tin rằng quản lý công việc không nên khó khăn hơn chính công việc đó.
                    </p>
                  </div>
                </motion.div>

                {/* Hero Visual - Team presence with authentic voice */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative mt-16"
                >
                  <Card className="border-slate-200 shadow-xl p-8 md:p-12">
                    <div className="aspect-video bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex flex-col items-center justify-center p-8">
                      <Avatar className="h-24 w-24 mb-6 border-4 border-white shadow-lg">
                        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-2xl font-bold">
                          TF
                        </AvatarFallback>
                      </Avatar>
                      <blockquote className="text-xl md:text-2xl font-medium text-slate-900 italic text-center max-w-2xl mb-4">
                        "Mỗi dòng code được viết với mục đích làm cho năng suất trở nên dễ tiếp cận và thú vị cho tất cả mọi người."
                      </blockquote>
                      <p className="text-slate-600 font-semibold">
                        — Đội ngũ TaskFlow
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section - Key metrics showcasing product success */}
          <section className="py-section-sm bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-container-md mx-auto">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="text-center"
                  >
                    {/* Icon with unified indigo-blue gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                      {stat.value}
                    </p>
                    <p className="text-slate-600 font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Story Section - Company narrative and mission */}
          <section className="py-section-md px-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="container mx-auto max-w-container-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="text-center mb-16"
              >
                <h2 className="text-heading-lg md:text-display-sm text-slate-900 mb-8">
                  Câu Chuyện Của Chúng Tôi
                </h2>
                <div className="text-body-lg text-slate-700 space-y-6 text-left md:text-center">
                  <p>
                    TaskFlow ra đời từ sự thất vọng với các ứng dụng quản lý công
                    việc quá phức tạp. Chúng tôi nhận ra rằng nhiều công cụ hiện
                    đại thường có quá nhiều tính năng không cần thiết, khiến người
                    dùng cảm thấy choáng ngợp.
                  </p>
                  <p>
                    Chúng tôi tin rằng quản lý công việc không nên mất nhiều thời
                    gian hơn so với việc thực sự làm những công việc đó. Công cụ
                    nên giúp bạn làm việc hiệu quả hơn, không phải làm bạn bị
                    choáng ngợp với quá nhiều tính năng không cần thiết.
                  </p>
                  <p className="font-semibold text-slate-900 text-xl">
                    Vì vậy chúng tôi xây dựng TaskFlow - đơn giản nhưng mạnh mẽ,
                    nhanh nhưng đầy đủ tính năng, miễn phí nhưng không hạ thấp
                    chất lượng.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Values Section - Core principles that guide the company */}
          <section className="py-section-md px-4 bg-white">
            <div className="container mx-auto max-w-container-lg">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="text-center mb-16"
              >
                <h2 className="text-heading-lg md:text-display-sm text-slate-900 mb-4">
                  Giá Trị Cốt Lõi
                </h2>
                <p className="text-body-lg text-slate-600">
                  Những nguyên tắc định hướng mọi hành động của chúng tôi
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {values.map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    whileHover={{ y: -8 }}
                    className="transition-hover"
                  >
                    {/* Value Card - Default card variant with indigo hover states */}
                    <Card className="p-8 h-full hover:shadow-lg transition-hover border border-slate-200 hover:border-indigo-200 bg-white">
                      {/* Icon background with unified gradient */}
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 rounded-2xl w-fit mb-6">
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-heading-sm text-slate-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-body-lg text-slate-600">
                        {value.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline Section - Company journey and milestones */}
          <section className="py-section-md px-4 bg-gradient-to-br from-slate-50 to-indigo-50">
            <div className="container mx-auto max-w-container-md">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="text-center mb-16"
              >
                <h2 className="text-heading-lg md:text-display-sm text-slate-900 mb-4">
                  Hành Trình Của Chúng Tôi
                </h2>
                <p className="text-body-lg text-slate-600">
                  Từ ý tưởng đến 10,000+ người dùng
                </p>
              </motion.div>

              <div className="space-y-6 md:space-y-8">
                {timeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.1,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="flex items-start gap-6"
                  >
                    {/* Timeline period badge with indigo-blue gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm min-w-[120px] text-center shadow-md">
                      {item.period}
                    </div>
                    {/* Timeline content card - Default card variant */}
                    <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-hover">
                      <h3 className="text-heading-sm text-slate-900 mb-2">
                        {item.event}
                      </h3>
                      <p className="text-body-lg text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section - Meet the people behind the product */}
          <section className="py-section-md px-4 bg-white">
            <div className="container mx-auto max-w-container-sm">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="text-center mb-16"
              >
                <h2 className="text-heading-lg md:text-display-sm text-slate-900 mb-4">
                  Gặp Gỡ Đội Ngũ
                </h2>
                <p className="text-body-lg text-slate-600">
                  Đam mê xây dựng công cụ giúp mọi người làm việc hiệu quả hơn
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Team Card - Elevated card variant */}
                <Card className="p-8 max-w-2xl mx-auto shadow-md hover:shadow-xl transition-hover border border-slate-100">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                    <Avatar className="h-32 w-32 border-4 border-indigo-600">
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-3xl font-bold">
                        TF
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-heading-sm text-slate-900 mb-1">
                        Đội Ngũ TaskFlow
                      </h3>
                      <p className="text-indigo-600 font-semibold mb-4">
                        Người Sáng Lập & Nhà Phát Triển
                      </p>
                      <p className="text-body-lg text-slate-600 italic">
                        "Đam mê xây dựng công cụ giúp mọi người làm việc hiệu quả
                        hơn. Mỗi dòng code được viết với mục đích làm cho năng
                        suất trở nên dễ tiếp cận và thú vị cho tất cả mọi người."
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* CTA Section - Call to action with consistent indigo-blue gradient */}
          <section className="py-section-md px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto text-center max-w-3xl relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <h2 className="text-heading-lg md:text-display-sm mb-6">
                  Tham Gia Cùng Chúng Tôi
                </h2>
                <p className="text-body-lg mb-10 text-indigo-100">
                  Trở thành một phần của 10,000+ người dùng đang nâng cao năng
                  suất với TaskFlow
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="text-lg px-10 h-14 bg-white text-indigo-600 hover:bg-slate-50 shadow-2xl font-semibold transition-hover"
                    >
                      Bắt Đầu Sử Dụng TaskFlow
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
                <p className="text-sm mt-6 text-indigo-100">
                  Miễn phí mãi mãi • Không cần thẻ tín dụng
                </p>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Footer - Consistent with other pages */}
        <footer className="bg-slate-900 text-slate-300 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl font-bold text-white">
                    TaskFlow
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Quản lý công việc hiện đại cho mọi người
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Sản Phẩm</h3>
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
                      to="/about"
                      className="hover:text-indigo-400 transition-colors"
                      onClick={(event) => handleFooterLink(event, "/about")}
                    >
                      Về Chúng Tôi
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Hỗ Trợ</h3>
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
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Pháp Lý</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="/terms"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      Điều Khoản
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      Bảo Mật
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 text-center text-sm">
              <p>© 2024 TaskFlow. Được tạo với ❤️ tại Việt Nam</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

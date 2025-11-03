import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Layout,
  Calendar,
  Users,
  Type,
  Paperclip,
  Search,
  Check,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Bell,
  Smartphone,
  BarChart3,
  Star,
  Clock,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Layout,
      title: "Bảng Kanban Trực Quan",
      description:
        "Tổ chức công việc với kéo-thả trực quan. Di chuyển tasks giữa các cột chỉ bằng một thao tác đơn giản.",
      features: [
        "Kéo và thả tasks dễ dàng",
        "Tùy chỉnh các cột theo nhu cầu",
        "Mã màu theo độ ưu tiên",
        "Lọc và sắp xếp nhanh chóng",
      ],
      useCase: "Hoàn hảo cho quản lý dự án Agile",
      iconColor: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Calendar,
      title: "Lịch & Timeline Thông Minh",
      description:
        "Xem toàn bộ công việc theo dòng thời gian. Chế độ xem tháng, tuần, ngày cho góc nhìn toàn diện.",
      features: [
        "Xem theo tháng/tuần/ngày",
        "Kéo để thay đổi lịch trình",
        "Mã màu theo danh mục",
        "Nhắc nhở deadline tự động",
      ],
      useCase: "Lý tưởng cho công việc có deadline",
      iconColor: "bg-blue-100 text-blue-600",
    },
    {
      icon: Users,
      title: "Cộng Tác Nhóm Hiệu Quả",
      description:
        "Làm việc nhóm với đồng bộ thời gian thực. Mọi thành viên đều cập nhật ngay lập tức.",
      features: [
        "Đồng bộ thời gian thực",
        "Dòng hoạt động chi tiết",
        "Nhắc đến @người dùng",
        "Hiển thị trạng thái online",
      ],
      useCase: "Được xây dựng cho nhóm từ xa",
      iconColor: "bg-purple-100 text-purple-600",
    },
    {
      icon: Type,
      title: "Rich Text Editor",
      description:
        "Soạn thảo mô tả công việc với định dạng phong phú. Thêm links, code blocks, và nhiều hơn nữa.",
      features: [
        "Hỗ trợ Markdown đầy đủ",
        "Khối code với syntax highlighting",
        "Nhúng links và hình ảnh",
        "Thanh công cụ trực quan",
      ],
      useCase: "Ghi chú kỹ thuật chi tiết",
      iconColor: "bg-amber-100 text-amber-600",
    },
    {
      icon: Paperclip,
      title: "Quản Lý File & Attachments",
      description:
        "Đính kèm files, hình ảnh, tài liệu trực tiếp vào tasks. Mọi thứ ở một nơi duy nhất.",
      features: [
        "Kéo & thả để tải lên",
        "Hỗ trợ nhiều loại file",
        "Xem trước hình ảnh",
        "Lưu trữ cloud an toàn",
      ],
      useCase: "Tập trung tài liệu dự án",
      iconColor: "bg-green-100 text-green-600",
    },
    {
      icon: Search,
      title: "Tìm Kiếm & Lọc Mạnh Mẽ",
      description:
        "Tìm kiếm bất kỳ công việc nào trong vài giây. Bộ lọc nâng cao cho kết quả chính xác.",
      features: [
        "Tìm kiếm toàn văn nhanh",
        "Bộ lọc đa tiêu chí",
        "Lưu bộ lọc thường dùng",
        "Phím tắt tiện lợi",
      ],
      useCase: "Truy cập thông tin nhanh chóng",
      iconColor: "bg-red-100 text-red-600",
    },
  ];

  const additionalFeatures = [
    {
      icon: Bell,
      title: "Thông Báo Thông Minh",
      description: "Nhận nhắc nhở đúng lúc cho deadline và cập nhật quan trọng.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Làm việc mượt mà trên mọi thiết bị - desktop, tablet, mobile.",
    },
    {
      icon: Shield,
      title: "Bảo Mật Cao",
      description: "Mã hóa end-to-end và sao lưu tự động bảo vệ dữ liệu.",
    },
    {
      icon: BarChart3,
      title: "Báo Cáo & Analytics",
      description: "Theo dõi tiến độ với biểu đồ và thống kê trực quan.",
    },
    {
      icon: Zap,
      title: "Hiệu Suất Cao",
      description: "Tải trang nhanh và thao tác mượt mà với hiệu suất tối ưu.",
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Theo dõi thời gian làm việc cho từng công việc và dự án.",
    },
    {
      icon: Star,
      title: "Priority Management",
      description: "Đánh dấu và sắp xếp công việc theo mức độ ưu tiên.",
    },
    {
      icon: Globe,
      title: "Multi-language",
      description: "Hỗ trợ tiếng Việt và nhiều ngôn ngữ khác.",
    },
    {
      icon: CheckCircle,
      title: "Easy to Use",
      description: "Giao diện đơn giản, không cần training phức tạp.",
    },
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
        title="Tính Năng - Quản Lý Công Việc Toàn Diện"
        description="Khám phá các tính năng mạnh mẽ của TaskFlow: Bảng Kanban, Timeline, Cộng tác nhóm, Rich text editor và nhiều hơn nữa."
        path="/features"
      />

      <div className="min-h-screen bg-white">
        <NavigationBar />

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

          {/* Floating Shapes */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

          <div className="container mx-auto max-w-4xl text-center relative z-10">
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
                <Zap className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">
                  Tất cả tính năng trong một nền tảng
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-slate-900">Tính Năng</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mạnh Mẽ & Toàn Diện
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                Mọi công cụ bạn cần để quản lý công việc hiệu quả, được tích hợp trong một giao diện đẹp và dễ sử dụng.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-base px-8 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Dùng Thử Miễn Phí
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto text-base px-8 h-12 border-2 border-slate-300 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                    >
                      Liên Hệ Sales
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Tính Năng Chính
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Các công cụ mạnh mẽ giúp bạn làm việc hiệu quả hơn
              </p>
            </motion.div>

            {/* Feature Grid with Alternating Layout */}
            <div className="space-y-24 md:space-y-32">
              {mainFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                    idx % 2 === 1 ? "md:grid-flow-dense" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={idx % 2 === 1 ? "md:col-start-2" : ""}>
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`${feature.iconColor} p-4 rounded-xl w-fit mb-6 shadow-sm`}
                    >
                      <feature.icon className="h-8 w-8" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature List */}
                    <div className="space-y-3 mb-6">
                      {feature.features.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Use Case Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                      <span className="text-xl mr-2">💡</span>
                      <span className="font-semibold text-indigo-900 text-sm">
                        {feature.useCase}
                      </span>
                    </div>
                  </div>

                  {/* Visual Mockup */}
                  <div
                    className={
                      idx % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
                    }
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          <div className="text-center p-6">
                            <feature.icon className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600 font-semibold mb-2">
                              {feature.title}
                            </p>
                            <p className="text-slate-400 text-sm">
                              Demo coming soon
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-16 md:py-24 px-4 bg-slate-50">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Và Còn Nhiều Hơn Thế
              </h2>
              <p className="text-lg md:text-xl text-slate-600">
                Những tính năng bổ sung giúp trải nghiệm hoàn hảo hơn
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {additionalFeatures.map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 md:p-8 h-full bg-white hover:shadow-lg transition-all duration-300 border border-slate-200 hover:border-indigo-200">
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg w-fit mb-4">
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
                Sẵn Sàng Trải Nghiệm?
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
                Tham gia cùng hàng nghìn người dùng đang làm việc hiệu quả hơn với TaskFlow
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 h-12 md:h-14 bg-white text-indigo-600 hover:bg-slate-50 shadow-2xl font-semibold"
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
                  <Link to="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 h-12 md:h-14 border-2 border-white !bg-transparent !text-white hover:!bg-white hover:!text-indigo-600 transition-all font-semibold"
                    >
                      Tìm Hiểu Thêm
                    </Button>
                  </Link>
                </motion.div>
              </div>

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
                    >
                      Tính Năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      Về Chúng Tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      Dashboard
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
                    >
                      Liên Hệ
                    </Link>
                  </li>
                  <li>
                    <a
                      href="/help"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      Trợ Giúp
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
                  Pháp Lý
                </h3>
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

            {/* Bottom Bar */}
            <div className="border-t border-slate-800 pt-8 text-center">
              <p className="text-sm text-slate-400">
                © 2024 TaskFlow. Được phát triển tại Việt Nam
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  Clock,
  MapPin,
  Send,
  MessageCircle,
  HelpCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Câu Hỏi Chung",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Tin Nhắn Đã Được Gửi! 🎉",
        description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "Câu Hỏi Chung",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "TaskFlow có thực sự miễn phí không?",
      answer:
        "Có! Miễn phí mãi mãi với số lượng task không giới hạn và các tính năng cơ bản.",
    },
    {
      question: "Tôi có thể sử dụng offline không?",
      answer:
        "Hiện tại cần kết nối internet. Chế độ offline đang được phát triển.",
    },
    {
      question: "Dữ liệu của tôi có an toàn không?",
      answer: "Mã hóa cấp ngân hàng, sao lưu định kỳ, và tuân thủ GDPR đầy đủ.",
    },
    {
      question: "Tôi có thể xuất dữ liệu không?",
      answer:
        "Có, bạn có thể xuất dữ liệu sang định dạng JSON/CSV bất kỳ lúc nào.",
    },
    {
      question: "Có hỗ trợ khách hàng không?",
      answer:
        "Hỗ trợ qua email cho tất cả người dùng, với hỗ trợ ưu tiên cho người dùng Pro.",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: ["hello@taskflow.vn", "support@taskflow.vn"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Thời Gian Phản Hồi",
      details: ["Chúng tôi thường phản hồi trong vòng 24 giờ làm việc"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: MapPin,
      title: "Địa Chỉ",
      details: ["Việt Nam", "Hà Nội & TP. Hồ Chí Minh"],
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <>
      <SEO
        title="Liên Hệ"
        description="Liên hệ với đội ngũ TaskFlow. Chúng tôi ở đây để giúp đỡ với bất kỳ câu hỏi, phản hồi, hoặc hỗ trợ nào bạn cần."
        path="/contact"
      />

      <div className="min-h-screen bg-white">
        <NavigationBar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <motion.div
              className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="container mx-auto text-center max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">Liên Hệ</span>{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Với Chúng Tôi
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                Có câu hỏi? Chúng tôi rất vui được lắng nghe từ bạn. Gửi tin
                nhắn và chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                    <div
                      className={`bg-gradient-to-r ${info.gradient} p-4 rounded-2xl w-fit mb-4`}
                    >
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 text-sm mb-1">
                        {detail}
                      </p>
                    ))}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Form - 2 columns */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="md:col-span-2"
              >
                <Card className="p-8 bg-white shadow-xl border-2 border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl mr-4">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Gửi Tin Nhắn
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold">
                        Họ và Tên *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-base font-semibold"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-2 h-12"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="subject"
                        className="text-base font-semibold"
                      >
                        Chủ Đề *
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subject: value })
                        }
                      >
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Câu Hỏi Chung">
                            Câu Hỏi Chung
                          </SelectItem>
                          <SelectItem value="Hỗ Trợ Kỹ Thuật">
                            Hỗ Trợ Kỹ Thuật
                          </SelectItem>
                          <SelectItem value="Đề Xuất Tính Năng">
                            Đề Xuất Tính Năng
                          </SelectItem>
                          <SelectItem value="Báo Lỗi">Báo Lỗi</SelectItem>
                          <SelectItem value="Hợp Tác">Hợp Tác</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="message"
                        className="text-base font-semibold"
                      >
                        Tin Nhắn *
                      </Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Cho chúng tôi biết chúng tôi có thể giúp gì cho bạn..."
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="mr-2"
                            >
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            </motion.div>
                            Đang Gửi...
                          </div>
                        ) : (
                          <>
                            Gửi Tin Nhắn
                            <Send className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </motion.div>

              {/* Quick Links - 1 column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6 bg-white shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl w-fit mb-4">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">
                    Cần Hỗ Trợ Nhanh?
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    Xem các câu hỏi thường gặp bên dưới hoặc truy cập trang tính
                    năng để tìm hiểu thêm về TaskFlow.
                  </p>
                  <div className="space-y-3">
                    <Link to="/features">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        → Xem Tính Năng
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        → Về Chúng Tôi
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        → Trang Chủ
                      </Button>
                    </Link>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    💡 Mẹo Hữu Ích
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Để được phản hồi nhanh hơn, hãy cung cấp càng nhiều chi tiết
                    càng tốt về vấn đề hoặc câu hỏi của bạn.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-xl text-gray-600">
                Câu trả lời nhanh cho các câu hỏi phổ biến
              </p>
            </motion.div>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-start">
                      <span className="text-blue-600 mr-2">Q:</span>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-6">
                      <span className="text-green-600 font-bold mr-2">A:</span>
                      {faq.answer}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-8 w-8 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">
                    TaskFlow
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Quản lý công việc hiện đại cho mọi người
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Sản Phẩm</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      to="/features"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Tính Năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-cyan-400 transition-colors"
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
                      className="hover:text-cyan-400 transition-colors"
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
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Điều Khoản
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Bảo Mật
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© 2024 TaskFlow. Được tạo với ❤️ tại Việt Nam</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

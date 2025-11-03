import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const heroHighlights = [
  {
    value: "98%",
    label: "Khách hàng hài lòng với đội ngũ hỗ trợ TaskFlow",
  },
  {
    value: "<12h",
    label: "Thời gian phản hồi trung bình cho các yêu cầu ưu tiên",
  },
  {
    value: "500+",
    label: "Nhóm đang vận hành công việc mỗi ngày với TaskFlow",
  },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: ["hello@taskflow.vn", "support@taskflow.vn"],
    gradient: "from-indigo-500 via-blue-500 to-sky-500",
  },
  {
    icon: Clock,
    title: "Thời Gian Phản Hồi",
    details: ["Thứ 2 - Thứ 6: 08:00 - 22:00", "Thứ 7: 09:00 - 17:00"],
    gradient: "from-sky-500 via-cyan-500 to-teal-500",
  },
  {
    icon: MapPin,
    title: "Văn Phòng",
    details: ["Hà Nội", "TP. Hồ Chí Minh"],
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
  },
];

const supportChannels = [
  {
    icon: Phone,
    title: "Đường dây ưu tiên",
    description:
      "Đặt lịch gọi 1-1 với chuyên gia CSKH cho những yêu cầu chiến lược hoặc khẩn cấp.",
  },
  {
    icon: LifeBuoy,
    title: "Trung tâm hỗ trợ",
    description:
      "Kho hướng dẫn, video và checklist giúp bạn tự xử lý hầu hết vấn đề chỉ trong vài phút.",
  },
  {
    icon: MessageCircle,
    title: "Cộng đồng TaskFlow",
    description:
      "Trao đổi với các nhóm khác, chia sẻ kinh nghiệm triển khai quy trình hiệu quả.",
    badge: "Sắp ra mắt",
  },
];

type QuickLink =
  | { label: string; to: string }
  | { label: string; href: string };

const quickLinks: QuickLink[] = [
  { label: "Xem Tính Năng", to: "/features" },
  { label: "Về Chúng Tôi", to: "/about" },
  { label: "Báo Cáo Sự Cố", href: "mailto:support@taskflow.vn" },
];

const faqs = [
  {
    question: "TaskFlow có thực sự miễn phí không?",
    answer:
      "Có. Gói Starter miễn phí trọn đời với số lượng task không giới hạn và các tính năng nền tảng cho nhóm nhỏ.",
  },
  {
    question: "Tôi có thể sử dụng TaskFlow khi không có internet?",
    answer:
      "Hiện tại ứng dụng cần kết nối internet để đồng bộ dữ liệu theo thời gian thực. Chế độ offline đang trong quá trình thử nghiệm nội bộ.",
  },
  {
    question: "Dữ liệu của tôi có được bảo mật?",
    answer:
      "Mọi dữ liệu đều được mã hóa, sao lưu định kỳ và lưu trữ trên hạ tầng đạt chuẩn bảo mật quốc tế. Chúng tôi tuân thủ nghiêm ngặt các chính sách bảo vệ quyền riêng tư.",
  },
  {
    question: "Tôi có thể xuất dữ liệu không?",
    answer:
      "Bạn có thể xuất dữ liệu bất kỳ lúc nào dưới định dạng CSV hoặc JSON, phù hợp với các công cụ BI và lưu trữ nội bộ.",
  },
  {
    question: "TaskFlow hỗ trợ khách hàng như thế nào?",
    answer:
      "Mọi người dùng đều nhận được hỗ trợ qua email. Người dùng gói Pro và Enterprise có thêm kênh chat ưu tiên và cố vấn triển khai định kỳ.",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "Câu Hỏi Chung",
    message: "",
    consent: true,
  });
  const [formMessage, setFormMessage] = useState<
    { type: "success" | "error"; text: string }
  | null>(null);

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === "object" && "message" in error) {
      const { message } = error as { message?: string };
      if (message) return message;
    }
    return "Không thể gửi tin nhắn. Vui lòng thử lại.";
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormMessage(null);
    setLoading(true);

    try {
      const baseMessage = formData.message.trim();
      const supplementalDetails = [
        formData.company && `Công ty: ${formData.company}`,
        formData.phone && `Điện thoại: ${formData.phone}`,
        `Cho phép liên hệ qua điện thoại/Zalo: ${formData.consent ? "Có" : "Không"}`,
      ].filter(Boolean) as string[];

      const messagePayload = supplementalDetails.length
        ? `${baseMessage}

---
Thông tin bổ sung:
${supplementalDetails.join("\n")}`
        : baseMessage;

      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: messagePayload,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Tin nhắn đã được gửi! 🎉",
        description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.",
      });

      setFormMessage({
        type: "success",
        text: "Chúng tôi đã nhận được tin nhắn. Đội ngũ TaskFlow sẽ phản hồi trong vòng 24 giờ làm việc.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "Câu Hỏi Chung",
        message: "",
        consent: true,
      });
    } catch (error) {
      toast({
        title: "Đã có lỗi xảy ra",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại sau ít phút.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
      setFormMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Liên Hệ"
        description="Liên hệ với đội ngũ TaskFlow để nhận được phản hồi nhanh chóng và chuyên nghiệp."
        path="/contact"
      />

      <div className="min-h-screen bg-background text-foreground">
        <NavigationBar />

        <main className="relative">
          <section className="relative overflow-hidden pt-32 pb-section-md">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-sky-100" />
            <motion.div
              className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl"
              animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative mx-auto max-w-container-lg px-4 text-center">
              <motion.span
                className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 shadow-sm backdrop-blur"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="h-4 w-4" />
                Trung tâm hỗ trợ TaskFlow
              </motion.span>

              <motion.h1
                className="mt-6 text-display-sm md:text-display-lg font-semibold text-gray-900"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Liên Hệ <span className="gradient-text">TaskFlow</span>
              </motion.h1>

              <motion.p
                className="mx-auto mt-4 max-w-2xl text-body-lg text-muted-foreground"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Chúng tôi luôn sẵn sàng đồng hành. Hãy cho chúng tôi biết điều
                bạn đang cần và đội ngũ chuyên gia sẽ phản hồi một cách tận tâm
                nhất.
              </motion.p>

              <motion.div
                className="mt-12 grid gap-4 sm:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.12 },
                  },
                }}
              >
                {heroHighlights.map((item) => (
                  <motion.div
                    key={item.label}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <p className="text-3xl font-semibold text-gray-900">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="px-4 py-section-md">
            <div className="mx-auto grid max-w-container-lg gap-10 lg:grid-cols-[1.55fr,1fr]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="relative overflow-hidden rounded-3xl border border-border/60 bg-white/90 p-10 shadow-xl backdrop-blur">
                  <motion.div
                    className="absolute -top-24 right-10 h-48 w-48 rounded-full bg-indigo-400/15 blur-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  />

                  <div className="relative flex items-center gap-3">
                    <span className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                      <MessageCircle className="h-6 w-6" />
                    </span>
                    <div>
                      <h2 className="text-heading-lg font-semibold text-gray-900">
                        Gửi tin nhắn cho TaskFlow
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Mô tả chi tiết để chúng tôi hỗ trợ bạn nhanh nhất.
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`mt-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                          formMessage.type === "success"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-rose-100 bg-rose-50 text-rose-600"
                        }`}
                      >
                        {formMessage.type === "success" ? (
                          <CheckCircle className="mt-0.5 h-5 w-5" />
                        ) : (
                          <AlertCircle className="mt-0.5 h-5 w-5" />
                        )}
                        <span className="leading-relaxed">{formMessage.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="mt-8 grid gap-6" noValidate>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                          Họ và tên *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Nguyễn Văn A"
                          required
                          value={formData.name}
                          onChange={(event) =>
                            setFormData({ ...formData, name: event.target.value })
                          }
                          className="mt-2 h-12 rounded-xl border border-border/60 bg-white/80 px-4 text-base transition-all duration-200 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200/80 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          required
                          value={formData.email}
                          onChange={(event) =>
                            setFormData({ ...formData, email: event.target.value })
                          }
                          className="mt-2 h-12 rounded-xl border border-border/60 bg-white/80 px-4 text-base transition-all duration-200 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200/80 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="company" className="text-sm font-semibold text-gray-900">
                          Công ty (tuỳ chọn)
                        </Label>
                        <Input
                          id="company"
                          type="text"
                          placeholder="Tên công ty hoặc đội nhóm"
                          value={formData.company}
                          onChange={(event) =>
                            setFormData({ ...formData, company: event.target.value })
                          }
                          className="mt-2 h-12 rounded-xl border border-border/60 bg-white/80 px-4 text-base transition-all duration-200 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200/80 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
                          Số điện thoại (tuỳ chọn)
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          placeholder="Ví dụ: 0981 234 567"
                          value={formData.phone}
                          onChange={(event) =>
                            setFormData({ ...formData, phone: event.target.value })
                          }
                          className="mt-2 h-12 rounded-xl border border-border/60 bg-white/80 px-4 text-base transition-all duration-200 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200/80 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-semibold text-gray-900">
                        Chủ đề *
                      </Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      >
                        <SelectTrigger className="mt-2 h-12 rounded-xl border border-border/60 bg-white/80 text-base transition-all duration-200 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200/80 focus-visible:ring-offset-1 focus-visible:ring-offset-white">
                          <SelectValue placeholder="Chủ đề bạn quan tâm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Câu Hỏi Chung">Câu Hỏi Chung</SelectItem>
                          <SelectItem value="Hỗ Trợ Kỹ Thuật">Hỗ Trợ Kỹ Thuật</SelectItem>
                          <SelectItem value="Đề Xuất Tính Năng">Đề Xuất Tính Năng</SelectItem>
                          <SelectItem value="Báo Lỗi">Báo Lỗi</SelectItem>
                          <SelectItem value="Hợp Tác">Hợp Tác</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-semibold text-gray-900">
                        Tin nhắn *
                      </Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Cho chúng tôi biết chúng tôi có thể giúp gì cho bạn..."
                        required
                        value={formData.message}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            message: event.target.value,
                          })
                        }
                        className="mt-2 min-h-[160px] rounded-xl border border-border/60 bg-white/80 text-base transition-all duration-200 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200/80 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                      />
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-white/70 p-4">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, consent: checked === true })
                        }
                      />
                      <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                        Cho phép TaskFlow liên hệ với tôi qua điện thoại hoặc Zalo nếu cần thêm thông tin.
                      </label>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="cta-base cta-animated cta-primary w-full h-12 justify-center text-base"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              className="h-5 w-5"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <span className="block h-full w-full rounded-full border-2 border-white border-t-transparent" />
                            </motion.span>
                            Đang gửi...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Gửi tin nhắn
                            <Send className="h-5 w-5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </motion.div>

              <motion.aside
                className="space-y-6 lg:sticky lg:top-28"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="rounded-3xl border border-border/60 bg-white/80 p-8 shadow-md backdrop-blur">
                  <h3 className="text-heading-sm font-semibold text-gray-900">
                    Liên hệ trực tiếp
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Chọn kênh mềm dẻo nhất cho nhu cầu của bạn.
                  </p>
                  <div className="mt-6 space-y-4">
                    {contactInfo.map((info) => (
                      <div
                        key={info.title}
                        className="flex items-start gap-4 rounded-2xl border border-border/40 bg-white/80 p-5 shadow-sm transition-colors duration-200 hover:border-indigo-200"
                      >
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${info.gradient} text-white shadow-md`}
                        >
                          <info.icon className="h-6 w-6" />
                        </span>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="text-base font-semibold text-gray-900">
                            {info.title}
                          </p>
                          {info.details.map((detail) => (
                            <p key={detail} className="leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="rounded-3xl border border-border/60 bg-white/80 p-8 shadow-md backdrop-blur">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-heading-sm font-semibold text-gray-900">
                        Các kênh ưu tiên
                      </h3>
                      <div className="mt-5 space-y-4">
                        {supportChannels.map((channel) => (
                          <div
                            key={channel.title}
                            className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                              <channel.icon className="h-5 w-5" />
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                  {channel.title}
                                </p>
                                {channel.badge && (
                                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-indigo-600">
                                    {channel.badge}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                {channel.description}
                              </p>
                            </div>
                            <ArrowUpRight className="mt-1 h-4 w-4 text-indigo-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/40 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                        Tài nguyên nhanh
                      </p>
                      <div className="mt-4 space-y-3">
                        {quickLinks.map((link) => {
                          const content = (
                            <span className="flex w-full items-center justify-between">
                              <span>{link.label}</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </span>
                          );

                          return "to" in link ? (
                            <Link
                              key={link.label}
                              to={link.to}
                              className="flex items-center justify-between rounded-2xl border border-border/50 bg-white/70 px-4 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50"
                            >
                              {content}
                            </Link>
                          ) : (
                            <a
                              key={link.label}
                              href={link.href}
                              className="flex items-center justify-between rounded-2xl border border-border/50 bg-white/70 px-4 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50"
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-6 text-white shadow-xl">
                  <h3 className="text-2xl font-semibold">Cần trao đổi trực tiếp?</h3>
                  <p className="mt-2 text-sm text-white/80">
                    Đặt lịch tư vấn miễn phí với chuyên gia của TaskFlow để nhận lộ trình triển khai phù hợp nhất.
                  </p>
                  <Button className="cta-base cta-outline-light mt-6 w-full justify-center gap-2 text-sm" asChild>
                    <a href="mailto:hello@taskflow.vn">
                      Đặt lịch cuộc gọi
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </motion.aside>
            </div>

            <div className="mx-auto mt-16 max-w-container-md text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  Câu hỏi thường gặp
                </span>
                <h2 className="mt-4 text-heading-lg md:text-display-sm font-semibold text-gray-900">
                  Thông tin bạn cần chỉ cách một cú nhấp
                </h2>
                <p className="mt-3 text-sm md:text-base text-muted-foreground">
                  Chọn chủ đề để tìm câu trả lời nhanh hoặc liên hệ trực tiếp nếu bạn cần hỗ trợ chuyên sâu hơn.
                </p>
              </motion.div>
            </div>

            <div className="mx-auto mt-10 max-w-container-md space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <Card className="rounded-3xl border border-border/60 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl backdrop-blur">
                    <div className="flex items-start gap-4">
                      <span className="mt-1 text-sm font-semibold text-indigo-500">
                        Hỏi
                      </span>
                      <div className="space-y-3 text-left">
                        <h3 className="text-base font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

          </section>
        </main>

        <footer className="bg-gray-900 py-16 text-gray-300">
          <div className="mx-auto max-w-container-lg px-4">
            <div className="grid gap-12 md:grid-cols-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-cyan-400" />
                  <span className="text-2xl font-bold text-white">TaskFlow</span>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Nền tảng quản lý công việc hiện đại cho mọi đội nhóm.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white">Sản phẩm</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link
                      to="/features"
                      className="transition-colors hover:text-cyan-400"
                    >
                      Tính năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="transition-colors hover:text-cyan-400"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white">Hỗ trợ</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link
                      to="/contact"
                      className="transition-colors hover:text-cyan-400"
                    >
                      Liên hệ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white">Pháp lý</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a
                      href="/terms"
                      className="transition-colors hover:text-cyan-400"
                    >
                      Điều khoản
                    </a>
                  </li>
                  <li>
                    <a
                      href="/privacy"
                      className="transition-colors hover:text-cyan-400"
                    >
                      Bảo mật
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
              © 2024 TaskFlow. Được tạo với ❤️ tại Việt Nam.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

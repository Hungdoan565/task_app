import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Cpu,
  MessageSquare,
  Puzzle,
  Sparkles,
} from "lucide-react";

import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const services = [
  {
    title: "AI Workflow Builder",
    description:
      "Thiết kế quy trình tự động hoá nhiệm vụ, phê duyệt và thông báo theo từng workspace.",
    icon: BrainCircuit,
    highlights: [
      "Automation đa bước",
      "Trigger theo điều kiện",
      "Kết nối với Slack, Teams",
    ],
  },
  {
    title: "Task Assistant & Copilot",
    description:
      "Tạo, phân loại và tóm tắt công việc bằng tiếng Việt chuẩn xác nhờ mô hình ngôn ngữ tối ưu hoá.",
    icon: Bot,
    highlights: ["Prompt chuyên sâu", "Đề xuất checklist", "Gợi ý deadline"],
  },
  {
    title: "Data & Analytics AI",
    description:
      "Xây dựng dashboard phân tích tiến độ, dự báo rủi ro và đề xuất kế hoạch bằng machine learning.",
    icon: Cpu,
    highlights: ["Dự báo burndown", "Cảnh báo bottleneck", "Insight theo vai trò"],
  },
  {
    title: "Integration Engineering",
    description:
      "Tích hợp TaskFlow với hệ thống nội bộ: ERP, CRM, helpdesk và data warehouse của doanh nghiệp.",
    icon: Puzzle,
    highlights: ["API & Webhook", "SSO/SAML", "Data pipeline"],
  },
];

const caseStudies = [
  {
    company: "NextWave Studio",
    result: "Giảm 42% thời gian cập nhật tiến độ sprint",
    quote:
      '"TaskFlow AI" biến daily standup thành báo cáo tự động mỗi sáng. Đội ngũ có thể tập trung giải quyết vấn đề thay vì viết status dài dòng.',
    author: "Linh Phan – Product Lead",
  },
  {
    company: "Nova Logistics",
    result: "Tự động hoá 1.200 yêu cầu vận hành mỗi tháng",
    quote:
      "Workflow AI giúp chúng tôi gom thông tin từ email, tạo ticket và phân bổ cho đúng nhóm trong vài giây.",
    author: "Anh Vũ – COO",
  },
];

const capabilities = [
  {
    title: "Automation Library",
    description:
      "Thư viện hơn 50 công thức AI cho các team marketing, sản phẩm, vận hành và HR.",
  },
  {
    title: "Prompt Studio",
    description:
      "Tùy chỉnh prompt theo giọng thương hiệu, ngôn ngữ nội bộ và chính sách dữ liệu.",
  },
  {
    title: "Secure Sandbox",
    description:
      "Huấn luyện và kiểm thử mô hình trong môi trường tách biệt, tuân thủ ISO 27001.",
  },
  {
    title: "Human-in-the-loop",
    description:
      "Quy trình review + approve đảm bảo AI luôn có kiểm soát của con người.",
  },
];

const techStack = [
  "OpenAI",
  "Azure AI",
  "Vertex AI",
  "Supabase",
  "LangChain",
  "Pinecone",
  "Kafka",
  "Power BI",
];

export default function AIDevelopmentPage() {
  return (
    <>
      <SEO
        title="AI Development"
        description="Dịch vụ AI + Code as a Service: xây dựng workflow tự động, trợ lý công việc và tích hợp doanh nghiệp."
        path="/ai-development"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <NavigationBar />

        <main id="main-content" className="pt-32">
          <section className="relative overflow-hidden pb-24">
            <div className="absolute inset-0">
              <motion.div
                className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-[160px]"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.55, 0.4] }}
                transition={{ duration: 14, repeat: Infinity }}
              />
              <motion.div
                className="absolute right-16 top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-[140px]"
                animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 18, repeat: Infinity }}
              />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 text-center">
              <motion.span
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-slate-900/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300 backdrop-blur"
              >
                <Sparkles className="h-4 w-4" />
                AI + Code as a Service
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl font-semibold leading-tight text-white md:text-6xl"
              >
                Xây dựng trợ lý AI cho quy trình công việc của bạn
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-4 max-w-3xl text-base text-slate-300 md:text-xl"
              >
                Đội ngũ TaskFlow AI kết hợp chuyên gia workflow và kỹ sư machine learning để thiết kế
                giải pháp tự động hoá trọn vẹn, bảo mật và đo lường được giá trị.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                <Button className="cta-base cta-animated cta-primary px-7 py-3">
                  Đặt lịch tư vấn
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="cta-base cta-animated cta-outline-indigo px-7 py-3"
                >
                  Xem case study
                </Button>
              </motion.div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
              {services.map((service) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full rounded-3xl border border-slate-800/40 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
                    <div className="flex items-center gap-4">
                      <span className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">
                        <service.icon className="h-6 w-6" />
                      </span>
                      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    </div>
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-2 text-sm text-indigo-200/90">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-200">
                            <Sparkles className="h-3.5 w-3.5" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/40 via-blue-700/30 to-slate-900/80 p-8 shadow-2xl"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                  Capabilities
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Nền tảng AI toàn diện, kiểm soát chặt chẽ
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {capabilities.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-5">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {caseStudies.map((study) => (
                  <Card
                    key={study.company}
                    className="rounded-3xl border border-slate-800/40 bg-slate-900/70 p-6 shadow-xl backdrop-blur"
                  >
                    <div className="flex items-center gap-3 text-indigo-200">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-xs font-semibold uppercase tracking-[0.3em]">
                        Case Study
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{study.company}</h3>
                    <p className="mt-2 text-sm text-indigo-200/80">{study.result}</p>
                    <p className="mt-4 text-sm italic text-slate-300 leading-relaxed">“{study.quote}”</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                      {study.author}
                    </p>
                  </Card>
                ))}
              </motion.div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800/50 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
              <div className="flex flex-col gap-6 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
                  Tech Stack
                </span>
                <h2 className="text-3xl font-semibold text-white">Hạ tầng linh hoạt theo nhu cầu của bạn</h2>
                <p className="mx-auto max-w-3xl text-sm text-slate-300 leading-relaxed">
                  Chúng tôi hỗ trợ đa dạng công nghệ AI hàng đầu, triển khai trên hạ tầng tuỳ chọn (Vercel, Azure, GCP, AWS)
                  và tối ưu chi phí dựa trên khối lượng công việc thực tế.
                </p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {techStack.map((stack) => (
                    <div
                      key={stack}
                      className="rounded-2xl border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-indigo-100 shadow-inner"
                    >
                      {stack}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-32">
            <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-600/70 via-blue-600/60 to-purple-600/70 p-10 text-center text-white shadow-2xl backdrop-blur">
              <h2 className="text-3xl font-semibold">Khởi động dự án AI của bạn cùng TaskFlow</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 leading-relaxed">
                Chia sẻ bài toán, chúng tôi sẽ đề xuất lộ trình triển khai trong 7 ngày, bao gồm prototype, kế hoạch tích hợp và mô hình ROI.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button className="cta-base cta-animated cta-primary px-6 py-3 text-sm">
                  Nhận tư vấn miễn phí
                </Button>
                <Button
                  variant="outline"
                  className="cta-base cta-animated cta-outline-light px-6 py-3 text-sm"
                >
                  Gửi brief dự án
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}



import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Crown,
  Rocket,
  Sparkles,
  Users,
} from "lucide-react";

import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const pricingTiers = [
  {
    name: "Free",
    price: "0₫",
    cadence: "vĩnh viễn",
    badge: "Phổ biến",
    icon: Sparkles,
    description: "Phù hợp cho cá nhân hoặc nhóm nhỏ đang làm quen với TaskFlow.",
    highlights: ["5 projects", "Tính năng cơ bản", "Tích hợp Google Calendar"],
    cta: "Bắt đầu miễn phí",
    featured: false,
  },
  {
    name: "Pro",
    price: "99.000₫",
    cadence: "mỗi tháng",
    badge: "Đội nhóm",
    icon: Users,
    description: "Tăng tốc đội nhóm với workflow nâng cao và tự động hoá mạnh mẽ.",
    highlights: [
      "Projects không giới hạn",
      "Automation & Templates",
      "Phân quyền nâng cao",
    ],
    cta: "Trải nghiệm Pro 14 ngày",
    featured: true,
  },
  {
    name: "AI Premium",
    price: "299.000₫",
    cadence: "mỗi tháng",
    badge: "AI Automation",
    icon: Crown,
    description:
      "Bộ công cụ AI toàn diện với hỗ trợ ưu tiên và bảng phân tích chuyên sâu.",
    highlights: [
      "AI automation workflow",
      "Phân tích hiệu suất",
      "Hỗ trợ ưu tiên 24/7",
    ],
    cta: "Nhận tư vấn triển khai",
    featured: false,
  },
];

const comparisonFeatures = [
  { label: "Số lượng projects", free: "5", pro: "Không giới hạn", ai: "Không giới hạn" },
  {
    label: "Tự động hoá",
    free: false,
    pro: true,
    ai: "AI recipes + Workflow builder",
  },
  { label: "Quyền truy cập nâng cao", free: false, pro: true, ai: true },
  { label: "AI Task Assistant", free: "Giới hạn 20 yêu cầu/tháng", pro: true, ai: "Không giới hạn" },
  { label: "Bảng phân tích & báo cáo", free: false, pro: "Cơ bản", ai: "Nâng cao + tuỳ chỉnh" },
  { label: "Hỗ trợ ưu tiên", free: false, pro: "Trong giờ hành chính", ai: "24/7 + CSM riêng" },
];

const faqs = [
  {
    question: "Tôi có thể hạ cấp hoặc nâng cấp gói bất kỳ lúc nào không?",
    answer:
      "Có. Bạn có thể thay đổi gói TaskFlow trong phần cài đặt thanh toán. Mọi thay đổi sẽ được áp dụng ngay lập tức và chi phí sẽ được tính theo tỷ lệ thời gian sử dụng.",
  },
  {
    question: "Gói Pro có bao gồm TaskFlow AI không?",
    answer:
      "Gói Pro bao gồm AI Assistant với giới hạn hàng tháng. Nếu bạn cần tự động hoá nâng cao, phân tích chuyên sâu và AI workflow builder, hãy chọn gói AI Premium.",
  },
  {
    question: "TaskFlow có ưu đãi cho doanh nghiệp lớn không?",
    answer:
      "Có. Gói Enterprise cung cấp chính sách giá linh hoạt, quyền truy cập SSO, SLA cam kết và đội ngũ triển khai riêng. Liên hệ với chúng tôi để được tư vấn chi tiết.",
  },
  {
    question: "Tôi có thể thử TaskFlow trước khi thanh toán?",
    answer:
      "Bạn có thể sử dụng gói Free không giới hạn thời gian. Ngoài ra, gói Pro hỗ trợ dùng thử miễn phí 14 ngày để trải nghiệm đầy đủ tính năng.",
  },
];

export default function PricingPage() {
  return (
    <>
      <SEO
        title="Pricing"
        description="Chọn gói TaskFlow phù hợp với đội nhóm của bạn. So sánh tính năng và bảng giá chi tiết."
        path="/pricing"
      />

      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/60 to-white text-foreground">
        <NavigationBar />

        <main className="pt-32">
          <section className="relative overflow-hidden pb-24">
            <div className="absolute inset-0">
              <motion.div
                className="absolute left-8 top-8 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 12, repeat: Infinity }}
              />
              <motion.div
                className="absolute right-0 top-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl"
                animate={{ opacity: [0.25, 0.45, 0.25], scale: [1.1, 0.9, 1.1] }}
                transition={{ duration: 16, repeat: Infinity }}
              />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 text-center">
              <motion.span
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600 shadow-sm backdrop-blur"
              >
                <Rocket className="h-4 w-4" />
                Grow Faster
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl font-semibold text-slate-900 md:text-6xl"
              >
                Chọn gói phù hợp với bạn
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl"
              >
                Từ cá nhân đến doanh nghiệp, TaskFlow mang đến công cụ quản lý công việc
                mạnh mẽ, dễ dùng và luôn sẵn sàng mở rộng khi đội nhóm của bạn phát
                triển.
              </motion.p>
            </div>
          </section>

          <section className="px-4 pb-24">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
              {pricingTiers.map((tier) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className={`h-full rounded-3xl border ${
                      tier.featured
                        ? "border-indigo-200 bg-white shadow-2xl"
                        : "border-slate-200 bg-white/85 shadow-md"
                    } p-8 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                        {tier.badge}
                      </span>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {tier.name}
                      </span>
                    </div>
                    <div className="mt-6 flex items-end gap-2">
                      <p className="text-4xl font-semibold text-slate-900">{tier.price}</p>
                      <p className="text-sm text-slate-500">/{tier.cadence}</p>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {tier.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm">
                      {tier.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-3 text-slate-700">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`mt-8 w-full justify-center gap-2 rounded-xl ${
                        tier.featured
                          ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white shadow-lg hover:shadow-xl"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="px-4 pb-24">
            <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    So sánh nhanh
                  </span>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                    Tính năng nổi bật theo từng gói
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-semibold text-indigo-600 hover:border-indigo-300"
                >
                  Tải bảng PDF
                </Button>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full min-w-[720px] divide-y divide-slate-200 text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-sm text-slate-500">
                      <th className="px-6 py-4 font-medium">Tính năng</th>
                      <th className="px-6 py-4 font-medium">Free</th>
                      <th className="px-6 py-4 font-medium">Pro</th>
                      <th className="px-6 py-4 font-medium">AI Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {comparisonFeatures.map((feature) => (
                      <tr key={feature.label} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {feature.label}
                        </td>
                        <td className="px-6 py-4">
                          {typeof feature.free === "boolean" ? (
                            feature.free ? (
                              <span className="flex items-center gap-2 text-indigo-600">
                                <Check className="h-4 w-4" /> Có
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )
                          ) : (
                            feature.free
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {typeof feature.pro === "boolean" ? (
                            feature.pro ? (
                              <span className="flex items-center gap-2 text-indigo-600">
                                <Check className="h-4 w-4" /> Có
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )
                          ) : (
                            feature.pro
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {typeof feature.ai === "boolean" ? (
                            feature.ai ? (
                              <span className="flex items-center gap-2 text-indigo-600">
                                <Check className="h-4 w-4" /> Có
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )
                          ) : (
                            feature.ai
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="px-4 pb-24">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  Câu hỏi thường gặp
                </span>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                  Mọi thắc mắc đều có câu trả lời
                </h2>
              </div>

              <div className="space-y-4 text-left">
                {faqs.map((faq) => (
                  <Card
                    key={faq.question}
                    className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                ))}
              </div>

              <div className="rounded-3xl border border-indigo-200 bg-indigo-600/90 p-8 text-white shadow-lg backdrop-blur">
                <h3 className="text-2xl font-semibold">Sẵn sàng trải nghiệm?</h3>
                <p className="mt-2 text-sm text-white/80">
                  Bắt đầu với gói Free hoặc đặt lịch demo với chuyên gia TaskFlow để
                  được tư vấn giải pháp phù hợp nhất.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button className="cta-base cta-animated cta-primary px-6 py-3 text-sm">
                    Bắt đầu miễn phí
                  </Button>
                  <Button
                    variant="outline"
                    className="cta-base cta-animated cta-outline-light px-6 py-3 text-sm"
                  >
                    Đặt lịch demo
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}


import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Lock,
  Rocket,
  ShieldCheck,
  Target,
  Timer,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const enterpriseFeatures = [
  {
    title: "Triển khai chuyên biệt",
    description:
      "Đội ngũ Customer Success đồng hành 1-1, đào tạo tailored cho từng phòng ban và hỗ trợ onboard trong 30 ngày.",
    icon: Users,
  },
  {
    title: "Quản trị & bảo mật",
    description:
      "SSO/SAML, SCIM, quyền truy cập theo vai trò, nhật ký hoạt động chi tiết và chính sách giữ dữ liệu tuỳ chỉnh.",
    icon: ShieldCheck,
  },
  {
    title: "Workflow tuỳ chỉnh",
    description:
      "Xây dựng automation đa bước, tích hợp với ERP/CRM và hệ thống nội bộ thông qua API TaskFlow Enterprise.",
    icon: Workflow,
  },
  {
    title: "Hỗ trợ SLA cam kết",
    description:
      "Đường dây hỗ trợ riêng 24/7, phản hồi trong 1 giờ, quản lý kỹ thuật chuyên trách và roadmap tính năng ưu tiên.",
    icon: CalendarCheck,
  },
];

const securityHighlights = [
  "ISO 27001 & SOC 2 type I",
  "Tuỳ chọn triển khai khu vực: APAC, EU, US",
  "Mã hoá end-to-end 256-bit",
  "Tuân thủ Nghị định 13/2023 về bảo vệ dữ liệu cá nhân",
];

const trustedBrands = [
  "VietFin",
  "Galaxy Studio",
  "Nova Logistics",
  "AI Labs",
  "Flow Media",
  "NextWave",
];

type RoiMetric = {
  label: string;
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  meter: number;
  icon: LucideIcon;
};

const roiMetrics: RoiMetric[] = [
  {
    label: "Tiết kiệm thời gian họp",
    end: 38,
    prefix: "-",
    suffix: "%",
    meter: 78,
    icon: Timer,
  },
  {
    label: "Tốc độ release",
    end: 2,
    prefix: "x",
    meter: 64,
    icon: Rocket,
  },
  {
    label: "Độ chính xác quy trình",
    end: 45,
    prefix: "+",
    suffix: "%",
    meter: 92,
    icon: Target,
  },
];

export default function EnterprisePage() {
  const { ref: roiRef, inView: roiInView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const formatMetricValue = (metric: RoiMetric) =>
    `${metric.prefix ?? ""}${metric.end.toFixed(metric.decimals ?? 0)}${
      metric.suffix ?? ""
    }`;

  return (
    <>
      <SEO
        title="Enterprise Solutions"
        description="Giải pháp TaskFlow dành cho doanh nghiệp: bảo mật nâng cao, tích hợp tuỳ chỉnh và SLA cam kết."
        path="/enterprise"
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100">
        <NavigationBar />

        <main className="pt-32">
          <section className="relative overflow-hidden pb-24">
            <div className="absolute inset-0">
              <motion.div
                className="absolute left-10 top-0 h-96 w-96 rounded-full bg-indigo-500/25 blur-[140px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 16, repeat: Infinity }}
              />
              <motion.div
                className="absolute right-10 top-32 h-80 w-80 rounded-full bg-purple-500/20 blur-[160px]"
                animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.3, 0.45, 0.3] }}
                transition={{ duration: 20, repeat: Infinity }}
              />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 text-center">
              <motion.span
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-slate-900/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200 backdrop-blur"
              >
                <Building2 className="h-4 w-4" />
                Enterprise-grade
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl font-semibold text-white md:text-6xl"
              >
                TaskFlow cho doanh nghiệp quy mô lớn
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-4 max-w-3xl text-base text-slate-300 md:text-xl"
              >
                Nâng cấp cách vận hành của toàn tổ chức với nền tảng quản lý công việc, AI, bảo mật và hỗ trợ được xây dựng riêng cho nhu cầu doanh nghiệp.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                <Button className="cta-base cta-animated cta-primary px-7 py-3 text-base">
                  Yêu cầu demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="cta-base cta-animated cta-outline-indigo px-7 py-3 text-base"
                >
                  Xem tài liệu kỹ thuật
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-200"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-inner backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                  <ShieldCheck className="h-4 w-4 text-indigo-200" />
                  <span>SOC 2 Type I Certified</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-inner backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                  <Lock className="h-4 w-4 text-indigo-200" />
                  <span>ISO 27001 Controls</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 shadow-inner backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10">
                  <CalendarCheck className="h-4 w-4 text-indigo-200" />
                  <span>SLA 99.9% + On-call 24/7</span>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
              {enterpriseFeatures.map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full rounded-3xl border border-slate-800/40 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
                    <div className="flex items-center gap-4">
                      <span className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-200">
                        <feature.icon className="h-6 w-6" />
                      </span>
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/40 via-blue-700/30 to-slate-900/80 p-8 shadow-2xl"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                  Bảo mật & tuân thủ
                </span>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Hạ tầng đạt chuẩn cho doanh nghiệp regulated
                </h2>
                <ul className="mt-8 space-y-4 text-sm text-slate-100/90">
                  {securityHighlights.map((item) => (
                    <li
                      key={item}
                      className="group flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-slate-900/60 px-4 py-3 text-sm leading-relaxed text-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/60 hover:bg-indigo-500/15"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/60 via-blue-500/60 to-purple-500/60 text-white shadow-lg">
                        <Lock className="h-4 w-4" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full rounded-3xl border border-slate-800/40 bg-slate-900/70 p-8 shadow-xl backdrop-blur">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                    Được tin dùng bởi
                  </span>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-center text-sm font-semibold text-slate-200 md:grid-cols-3">
                    {trustedBrands.map((brand) => (
                      <div
                        key={brand}
                        className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 px-4 py-3 text-indigo-100 shadow-inner transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-500/15"
                      >
                        <span className="block text-sm font-semibold tracking-[0.2em] text-indigo-100">
                          {brand}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div
              ref={roiRef}
              className="mx-auto max-w-5xl rounded-3xl border border-slate-800/40 bg-slate-900/75 p-10 shadow-2xl backdrop-blur"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                    ROI thực tế
                  </span>
                  <h2 className="text-3xl font-semibold text-white">
                    Dữ liệu từ khách hàng Enterprise 2024
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Chúng tôi đồng hành đo lường hiệu quả trước và sau triển khai để đảm bảo sản phẩm mang lại giá trị cụ thể cho tổ chức.
                  </p>
                </div>

                <div className="grid flex-1 gap-4 sm:grid-cols-3">
                  {roiMetrics.map((metric, idx) => (
                    <motion.div
                      key={metric.label}
                      className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/40 to-purple-600/40 px-5 py-5 text-center text-white shadow-inner"
                      initial={{ opacity: 0, y: 18 }}
                      animate={roiInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                      transition={{ duration: 0.5, delay: idx * 0.12 }}
                    >
                      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-indigo-100">
                        <metric.icon className="h-5 w-5" />
                      </div>
                      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: roiInView ? `${metric.meter}%` : "0%" }}
                          transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                        />
                      </div>
                      <p className="text-2xl font-semibold">
                        {roiInView ? (
                          <CountUp
                            end={metric.end}
                            duration={1.6}
                            prefix={metric.prefix}
                            suffix={metric.suffix}
                            decimals={metric.decimals ?? 0}
                          />
                        ) : (
                          <span className="opacity-0">{formatMetricValue(metric)}</span>
                        )}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/85">
                        {metric.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-32">
            <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-600/70 via-blue-600/60 to-purple-600/70 p-10 text-center text-white shadow-2xl backdrop-blur">
              <h2 className="text-3xl font-semibold">Bắt đầu hành trình chuyển đổi cùng TaskFlow</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 leading-relaxed">
                Chúng tôi sẽ chuẩn bị bản demo theo quy trình của doanh nghiệp và đề xuất lộ trình triển khai chi tiết chỉ trong 10 ngày làm việc.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button className="cta-base cta-animated cta-primary px-6 py-3 text-sm">
                  Đặt lịch demo
                </Button>
                <Button
                  variant="outline"
                  className="cta-base cta-animated cta-outline-light px-6 py-3 text-sm"
                >
                  Liên hệ đội ngũ Enterprise
                </Button>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-indigo-100/80">
                Phản hồi trong 24h • NDA sẵn sàng trước khi chia sẻ dữ liệu
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}



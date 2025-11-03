import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  ArrowRight,
  Globe,
  Monitor,
  Smartphone,
  Apple,
  Chrome,
  Navigation,
} from "lucide-react";

import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const desktopPlatforms = [
  {
    name: "Windows",
    description:
      "Trải nghiệm TaskFlow native với hiệu năng tối ưu và thông báo tức thì.",
    size: "162 MB • Windows 10 trở lên",
    action: "Tải cho Windows",
    icon: Monitor,
  },
  {
    name: "macOS",
    description:
      "Thiết kế tối ưu cho macOS Sonoma với hỗ trợ Apple Silicon đầy đủ.",
    size: "148 MB • macOS 12 trở lên",
    action: "Tải cho macOS",
    icon: AppWindow,
  },
  {
    name: "Linux",
    description:
      "Gói AppImage và .deb giúp triển khai nhanh cho mọi distro phổ biến.",
    size: "136 MB • Ubuntu / Fedora / Arch",
    action: "Tải cho Linux",
    icon: Globe,
  },
];

const mobilePlatforms = [
  {
    name: "iOS & iPadOS",
    description:
      "Đồng bộ tức thì cùng widget lịch thông minh và hỗ trợ live activity.",
    badge: "TestFlight mới",
    icon: Apple,
  },
  {
    name: "Android",
    description:
      "Dark mode, tiện ích màn hình chính và đồng bộ nền tiết kiệm pin.",
    badge: "Beta ổn định",
    icon: Smartphone,
  },
];

const browserExtensions = [
  {
    name: "Chrome",
    description: "Lưu nhanh task từ mọi tab chỉ với một cú click.",
  },
  {
    name: "Edge",
    description: "Tích hợp sâu với Microsoft 365 và Outlook.",
  },
  {
    name: "Firefox",
    description: "Bảo vệ quyền riêng tư, hỗ trợ shortcut tuỳ chỉnh.",
  },
];

export default function DownloadsPage() {
  const sections = [
    { id: "desktop", label: "Desktop" },
    { id: "mobile", label: "Mobile" },
    { id: "extensions", label: "Extensions" },
  ];

  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0.3, 0.6],
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <SEO
        title="Downloads"
        description="Tải TaskFlow cho mọi nền tảng: Windows, macOS, Linux, iOS, Android và trình duyệt."
        path="/downloads"
      />

      <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/40 to-white text-foreground">
        <NavigationBar />

        <main className="pt-32">
          <nav className="sticky top-20 z-40 hidden w-full justify-center px-4 md:flex">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
              <Navigation className="h-4 w-4 text-indigo-500" />
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`rounded-full px-4 py-1 text-sm font-semibold transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-slate-500 hover:text-indigo-600"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </nav>

          <section className="relative overflow-hidden pb-24">
            <div className="absolute inset-0">
              <motion.div
                className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 14, repeat: Infinity }}
              />
              <motion.div
                className="absolute right-12 top-40 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"
                animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 16, repeat: Infinity }}
              />
            </div>

            <div className="relative mx-auto max-w-5xl px-4 text-center">
              <motion.span
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 px-4 py-2 text-xs mt-5 font-semibold uppercase tracking-[0.25em] text-indigo-600 shadow-sm backdrop-blur"
              >
                <Chrome className="h-4 w-4" />
                Everywhere Access
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-4xl font-semibold text-slate-900 md:text-6xl"
              >
                Truy cập TaskFlow{" "}
                <span className="gradient-text">mọi lúc, mọi nơi</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl"
              >
                Ứng dụng native, web và mobile giúp đội nhóm của bạn luôn cập nhật
                công việc tức thì dù ở bất kỳ nền tảng nào.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
              >
                <Button className="cta-base cta-animated cta-primary px-6 py-2.5 text-base">
                  Tải cho Desktop
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-2 border-indigo-300 bg-white px-6 py-2.5 text-base font-semibold text-indigo-600 shadow-md hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-lg transition-all duration-300"
                >
                  Mở trên Web
                </Button>
              </motion.div>
            </div>
          </section>

          <section id="desktop" className="scroll-mt-32 px-4 pb-24">
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              {desktopPlatforms.map((platform) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="h-full rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-md backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                        <platform.icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {platform.name}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {platform.description}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      {platform.size}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                      <span>Checksum: SHA256</span>
                      <button
                        type="button"
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        Release notes
                      </button>
                    </div>
                    <Button className="mt-6 w-full justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-slate-800 transition-all duration-200">
                      {platform.action}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="mobile" className="scroll-mt-32 px-4 pb-24">
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  Mobile first
                </span>
                <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                  Ứng dụng di động được thiết kế cho nhịp làm việc linh hoạt
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Nhận thông báo push theo ngữ cảnh, ghi chú nhanh bằng giọng nói và
                  đồng bộ thời gian thực với desktop. TaskFlow mobile luôn sẵn sàng
                  khi cuộc họp kết thúc hay khi ý tưởng vừa xuất hiện.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {mobilePlatforms.map((platform) => (
                    <Card
                      key={platform.name}
                      className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-md backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                          <platform.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {platform.name}
                          </p>
                          <p className="text-xs text-indigo-500">{platform.badge}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {platform.description}
                      </p>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="flex items-center justify-between rounded-3xl border border-indigo-100 bg-indigo-50/80 p-5 shadow-inner backdrop-blur">
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">
                        Mở Camera
                      </p>
                      <p className="text-xs text-indigo-600/80">
                        Quét QR để tải ứng dụng ngay lập tức
                      </p>
                    </div>
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://taskflow.vn/downloads"
                      alt="QR tải TaskFlow"
                      className="h-24 w-24 rounded-xl border border-indigo-200 bg-white p-2 shadow-sm"
                    />
                  </Card>
                  <Card className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-inner backdrop-blur">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Gửi link tới email
                      </p>
                      <p className="text-xs text-slate-600">
                        Nhận link tải ứng dụng trong hộp thư của bạn.
                      </p>
                    </div>
                    <Button className="rounded-xl border-2 border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                      Gửi Link
                    </Button>
                  </Card>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-indigo-300/30 blur-xl" />
                  <div className="absolute -right-6 bottom-6 h-24 w-24 rounded-full bg-sky-300/30 blur-xl" />
                  <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-2xl backdrop-blur">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl bg-slate-900 p-3 text-white">
                        <Smartphone className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          TaskFlow Mobile
                        </p>
                        <p className="text-xs text-slate-500">Trạng thái: Đồng bộ</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 p-6 text-white shadow-lg">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                          Today
                        </p>
                        <p className="mt-3 text-lg font-semibold">
                          Review sprint tuần này
                        </p>
                        <p className="mt-2 text-sm text-white/80">
                          16:00 • Phòng họp 3A
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Widget
                        </p>
                        <p className="mt-2 text-sm text-slate-700">
                          Theo dõi KPI, tiến độ OKR và nhiệm vụ quan trọng ngay từ
                          màn hình khóa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="extensions" className="scroll-mt-32 px-4 pb-24">
            <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                    Extensions
                  </span>
                  <h2 className="text-3xl font-semibold text-slate-900">
                    Trình duyệt nào bạn đang sử dụng?
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Lưu task từ bài viết, email hay bất kỳ tab đang mở. Tích hợp
                    TaskFlow Extension giúp bạn đưa mọi công việc về cùng một nơi chỉ
                    trong vài giây.
                  </p>
                </div>

                <div className="grid w-full gap-4 sm:grid-cols-3">
                  {browserExtensions.map((extension) => (
                    <Card
                      key={extension.name}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <h3 className="font-semibold text-slate-900">
                        {extension.name}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        {extension.description}
                      </p>
                      <Button className="mt-4 w-full justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:bg-slate-800 transition-all duration-200">
                        Cài đặt
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}


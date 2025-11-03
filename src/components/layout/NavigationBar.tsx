import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BrainCircuit,
  Building2,
  CheckCircle,
  ChevronDown,
  CreditCard,
  Download,
  Menu,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

type DropdownItem = {
  to: string;
  label: string;
  description: string;
  icon?: LucideIcon;
};

type NavItem = {
  label: string;
  to?: string;
  dropdown?: DropdownItem[];
};

export default function NavigationBar() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks: NavItem[] = [
    { to: "/", label: "Trang Chủ" },
    {
      label: "Sản Phẩm",
      dropdown: [
        {
          to: "/features",
          label: "Tính Năng",
          description: "Khám phá hệ thống quản lý công việc hiện đại của TaskFlow.",
          icon: Sparkles,
        },
        {
          to: "/downloads",
          label: "Downloads",
          description: "Tải TaskFlow cho Windows, macOS, Linux và thiết bị di động.",
          icon: Download,
        },
        {
          to: "/pricing",
          label: "Pricing",
          description: "Chọn gói phù hợp với đội nhóm và quy mô doanh nghiệp của bạn.",
          icon: CreditCard,
        },
      ],
    },
    {
      label: "Dịch Vụ",
      dropdown: [
        {
          to: "/ai-development",
          label: "AI Development",
          description: "Thiết kế giải pháp tự động hóa công việc với AI tùy chỉnh.",
          icon: BrainCircuit,
        },
        {
          to: "/enterprise",
          label: "Enterprise Solutions",
          description: "Nền tảng TaskFlow nâng cao với bảo mật, SLA và hỗ trợ chuyên sâu.",
          icon: Building2,
        },
      ],
    },
    { to: "/about", label: "Về Chúng Tôi" },
    { to: "/contact", label: "Liên Hệ" },
  ];

  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  const isItemActive = (item: NavItem) => {
    if (item.to) {
      if (item.to === "/") {
        return location.pathname === "/";
      }
      return location.pathname.startsWith(item.to);
    }

    if (item.dropdown) {
      return item.dropdown.some((entry) =>
        location.pathname.startsWith(entry.to)
      );
    }

    return false;
  };

  const closeDropdown = () => setActiveDropdown(null);

  const SimpleNavLink = ({
    item,
  }: {
    item: NavItem & { to: string };
  }) => (
    <Link
      to={item.to}
      className={`transition-all duration-300 font-medium ${
        isItemActive(item)
          ? "font-semibold text-indigo-600"
          : "text-slate-700 hover:text-indigo-600"
      }`}
    >
      {item.label}
    </Link>
  );

  const DropdownNavItem = ({ item }: { item: NavItem }) => {
    if (!item.dropdown) return null;

    const isOpen = activeDropdown === item.label;

    return (
      <div
        className="relative"
        onMouseEnter={() => setActiveDropdown(item.label)}
        onMouseLeave={closeDropdown}
      >
        <button
          type="button"
          className={`group inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors duration-200 ${
            isItemActive(item)
              ? "text-indigo-600"
              : "text-slate-700 hover:text-indigo-600"
          }`}
          onClick={() =>
            setActiveDropdown((prev) =>
              prev === item.label ? null : item.label
            )
          }
        >
          <span>{item.label}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-slate-500 group-hover:text-indigo-500"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute left-1/2 top-full z-50 w-[340px] -translate-x-1/2 pt-3"
            >
              <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
                <div className="grid gap-3">
                  {item.dropdown.map((entry) => (
                    <Link
                      key={entry.to}
                      to={entry.to}
                      className="group/link flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-50"
                    >
                      {entry.icon && (
                        <span className="mt-1 rounded-lg bg-indigo-50 p-2 text-indigo-600">
                          <entry.icon className="h-4 w-4" />
                        </span>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {entry.label}
                        </p>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {entry.description}
                        </p>
                      </div>
                      <motion.span
                        className="ml-auto mt-1 text-indigo-500 opacity-0 transition-opacity duration-200 group-hover/link:opacity-100"
                        initial={false}
                      >
                        →
                      </motion.span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="h-8 w-8 text-indigo-600" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((item) =>
            item.dropdown ? (
              <DropdownNavItem key={item.label} item={item} />
            ) : (
              item.to && <SimpleNavLink key={item.to} item={item as NavItem & { to: string }} />
            )
          )}
        </div>

        <div className="hidden items-center space-x-3 md:flex">
          {user ? (
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="font-semibold shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                  Bảng Điều Khiển
                </Button>
              </motion.div>
            </Link>
          ) : (
            <>
              <Link to="/signin">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="relative border-2 border-slate-300 bg-white font-semibold shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:shadow-md"
                  >
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Đăng Nhập
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                    Đăng Ký
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px]">
            <div className="mb-8 flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>

            <nav className="flex flex-col space-y-6">
              {navLinks.map((item) =>
                item.dropdown ? (
                  <div key={item.label} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </p>
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                      {item.dropdown.map((entry) => (
                        <Link
                          key={entry.to}
                          to={entry.to}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 rounded-xl bg-white/70 px-3 py-3 text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {entry.icon && (
                            <span className="mt-1 rounded-lg bg-indigo-100 p-2 text-indigo-600">
                              <entry.icon className="h-4 w-4" />
                            </span>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">
                              {entry.label}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {entry.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  item.to && (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`font-medium transition-colors duration-200 ${
                        isItemActive(item)
                          ? "text-indigo-600"
                          : "text-slate-700 hover:text-indigo-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )
              )}

              <Separator />

              {user ? (
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full font-semibold shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                    Bảng Điều Khiển
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/signin" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-slate-300 bg-white font-semibold shadow-sm transition-all duration-300 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:shadow-md"
                    >
                      <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Đăng Nhập
                      </span>
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                      Đăng Ký
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}


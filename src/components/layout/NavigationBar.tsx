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
  LogOut,
  Menu,
  Sparkles,
  User2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const getInitials = (name?: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function NavigationBar() {
  const { user, signOut } = useAuth();
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-3 rounded-full border-slate-100 bg-white px-3.5 py-1.5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email || undefined} />
                    <AvatarFallback>{getInitials(user.user_metadata?.full_name || user.email)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900 leading-none">
                      {user.user_metadata?.full_name || "Tài khoản"}
                    </span>
                    <span className="text-[11px] text-slate-400 tracking-wide">Tùy chọn</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={12} className="w-64 rounded-2xl border border-slate-100 bg-white/98 p-1 shadow-xl backdrop-blur">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1.5">
                    <span className="text-sm font-semibold text-slate-900 leading-tight">
                      {user.user_metadata?.full_name || "Người dùng TaskFlow"}
                    </span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem asChild className="rounded-xl text-slate-700 focus:bg-indigo-50 focus:text-indigo-700">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Đi tới bảng điều khiển</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl text-slate-700 focus:bg-indigo-50 focus:text-indigo-700">
                  <Link to="/settings?tab=profile" className="flex items-center gap-2">
                    <User2 className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">Tài khoản của tôi</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-1" />
                <DropdownMenuItem
                  className="rounded-xl text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm">Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600">
                Đăng nhập
              </Link>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                    Bắt đầu miễn phí
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
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email || undefined} />
                        <AvatarFallback>{getInitials(user.user_metadata?.full_name || user.email)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                          {user.user_metadata?.full_name || "Người dùng TaskFlow"}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      <Button className="w-full justify-between rounded-xl border border-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                        Đi tới bảng điều khiển
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/settings?tab=profile" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-between rounded-xl border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600">
                        Quản lý tài khoản
                        <User2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/signin" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700">
                      Bắt đầu miễn phí
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


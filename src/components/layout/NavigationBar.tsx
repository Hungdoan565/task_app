import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { motion } from "framer-motion";

export default function NavigationBar() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Trang Chủ" },
    { to: "/features", label: "Tính Năng" },
    { to: "/about", label: "Về Chúng Tôi" },
    { to: "/contact", label: "Liên Hệ" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const NavLink = ({
    to,
    label,
    onClick,
  }: {
    to: string;
    label: string;
    onClick?: () => void;
  }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`transition-all duration-300 font-medium ${
        isActive(to)
          ? "text-indigo-600 font-bold"
          : "text-gray-700 hover:text-indigo-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md fixed w-full z-50 top-0 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} label={link.label} />
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
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
                    className="relative border-2 border-slate-300 hover:border-indigo-300 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-blue-700">
                      Đăng Nhập
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                    Đăng Ký
                  </Button>
                </motion.div>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
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
          <SheetContent side="right" className="w-[300px]">
            <div className="flex items-center space-x-2 mb-8">
              <CheckCircle className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>

            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  onClick={() => setOpen(false)}
                />
              ))}

              <Separator />

              {user ? (
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl font-semibold">
                    Bảng Điều Khiển
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/signin" onClick={() => setOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-slate-300 hover:border-indigo-300 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 font-semibold shadow-sm hover:shadow-md"
                    >
                      <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Đăng Nhập
                      </span>
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl font-semibold">
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

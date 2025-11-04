import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordStrength from "@/components/auth/PasswordStrength";

type AuthMode = "signin" | "signup" | "forgot";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formMessage, setFormMessage] = useState<
    { type: "success" | "error"; text: string }
  | null>(null);

  useEffect(() => {
    setErrors({});
    setFormMessage(null);
  }, [mode]);

  const {
    user,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    resetPassword,
  } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (mode === "signup") {
      if (!fullName.trim()) {
        newErrors.fullName = "Vui lòng nhập họ tên";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
      if (!agreeTerms) {
        newErrors.terms = "Bạn cần đồng ý với điều khoản";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getErrorMessage = (error: unknown) => {
    if (error && typeof error === "object" && "message" in error) {
      const message = (error as { message?: string }).message;
      if (message) return message;
    }
    return "Đã có lỗi xảy ra, vui lòng thử lại.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        setFormMessage({ type: "success", text: "Đăng nhập thành công." });
      } else if (mode === "signup") {
        await signUp(email, password, fullName);
        setFormMessage({
          type: "success",
          text: "Tạo tài khoản thành công! Bạn có thể bắt đầu sử dụng TaskFlow ngay.",
        });
      } else if (mode === "forgot") {
        await resetPassword(email);
        setMode("signin");
        setFormMessage({
          type: "success",
          text: "Chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra email.",
        });
      }
    } catch (error) {
      setFormMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setFormMessage(null);
    try {
      await signInWithGoogle();
      setFormMessage({
        type: "success",
        text: "Đăng nhập với Google thành công.",
      });
    } catch (error) {
      setFormMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    setFormMessage(null);
    try {
      await signInWithGithub();
      setFormMessage({
        type: "success",
        text: "Đăng nhập với GitHub thành công.",
      });
    } catch (error) {
      setFormMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <main id="main-content" className="min-h-screen flex bg-slate-50">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 lg:flex lg:w-[45%]"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Accent shapes */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.07 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-[-8rem] right-[-6rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/80 blur-[140px]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.06 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-[-6rem] left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-blue-500/60 blur-[140px]"
        />

        <div className="relative z-10 flex flex-col justify-center pl-28 pr-16 py-16 xl:pl-56">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 mb-12 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <CheckCircle className="h-10 w-10 text-indigo-400" />
              </motion.div>
              <span className="text-3xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                TaskFlow
              </span>
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl font-semibold text-white mb-6 leading-tight"
            >
              Quản lý công việc
              <br />
              <span className="text-indigo-300">chuyên nghiệp</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base text-indigo-100/90 mb-8 leading-relaxed"
            >
              Nền tảng quản lý công việc được tin dùng bởi hơn 10,000 doanh
              nghiệp tại Việt Nam. Tăng năng suất, tối ưu quy trình làm việc.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {[
                { icon: CheckCircle, text: "Bảo mật cấp doanh nghiệp" },
                { icon: CheckCircle, text: "Hỗ trợ 24/7" },
                { icon: CheckCircle, text: "Miễn phí 30 ngày dùng thử" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5"
                  >
                    <item.icon className="h-5 w-5 text-indigo-200" />
                  </motion.div>
                  <span className="text-indigo-100/90">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="relative flex flex-1 items-center justify-center bg-slate-50 p-6 md:p-12">
        {/* Background overlay for form area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-white"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-[520px]"
        >
          {/* Mobile Logo */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center space-x-2 lg:hidden"
          >
            <CheckCircle className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-slate-900">TaskFlow</span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card className="overflow-hidden border border-slate-200/70 bg-white shadow-xl">
                <CardHeader className="space-y-1 pb-6">
                  <motion.div variants={itemVariants}>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                      {mode === "signin" && "Đăng nhập"}
                      {mode === "signup" && "Tạo tài khoản"}
                      {mode === "forgot" && "Khôi phục mật khẩu"}
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <CardDescription className="text-slate-600 text-[15px]">
                      {mode === "signin" &&
                        "Đăng nhập để tiếp tục sử dụng TaskFlow"}
                      {mode === "signup" && "Tạo tài khoản miễn phí để bắt đầu"}
                      {mode === "forgot" &&
                        "Nhập email để nhận liên kết đặt lại mật khẩu"}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent>
                  <AnimatePresence>
                    {formMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
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

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence mode="wait">
                      {mode === "signup" && (
                        <motion.div
                          variants={fieldVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <div className="space-y-2">
                            <label
                              htmlFor="fullName"
                              className="text-sm font-semibold text-slate-700"
                            >
                              Họ và tên <span className="text-red-600">*</span>
                            </label>
                            <motion.div
                              whileFocus={{ scale: 1.01 }}
                              className="relative"
                            >
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                              <Input
                                id="fullName"
                                type="text"
                                placeholder="Nguyễn Văn A"
                                value={fullName}
                                onChange={(e) => {
                                  setFullName(e.target.value);
                                  if (errors.fullName) {
                                    setErrors({ ...errors, fullName: "" });
                                  }
                                }}
                                className={`pl-10 h-11 transition-all duration-200 ${
                                  errors.fullName
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                                }`}
                                tabIndex={0}
                              />
                            </motion.div>
                            <AnimatePresence>
                              {errors.fullName && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex items-center text-xs text-red-600 mt-1"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {errors.fullName}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-slate-700"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.01 }}
                        className="relative"
                      >
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 h-11 transition-all duration-200"
                          tabIndex={0}
                        />
                      </motion.div>
                    </motion.div>

                    {mode !== "forgot" && (
                      <>
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          <label
                            htmlFor="password"
                            className="text-sm font-semibold text-slate-700"
                          >
                            Mật khẩu <span className="text-red-600">*</span>
                          </label>
                          <motion.div
                            whileFocus={{ scale: 1.01 }}
                            className="relative"
                          >
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              minLength={8}
                              className="pl-10 pr-10 h-11 transition-all duration-200"
                              tabIndex={0}
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              tabIndex={-1}
                              aria-label="Toggle password visibility"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </motion.button>
                          </motion.div>
                          {mode === "signup" && (
                            <PasswordStrength password={password} />
                          )}
                        </motion.div>

                        {mode === "signup" && (
                          <motion.div
                            variants={fieldVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-2"
                          >
                            <label
                              htmlFor="confirmPassword"
                              className="text-sm font-semibold text-slate-700"
                            >
                              Xác nhận mật khẩu{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <motion.div
                              whileFocus={{ scale: 1.01 }}
                              className="relative"
                            >
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  if (errors.confirmPassword) {
                                    setErrors({
                                      ...errors,
                                      confirmPassword: "",
                                    });
                                  }
                                }}
                                className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                                  errors.confirmPassword
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                                }`}
                                minLength={8}
                                tabIndex={0}
                              />
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                tabIndex={-1}
                                aria-label="Toggle confirm password visibility"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </motion.button>
                            </motion.div>
                            <AnimatePresence>
                              {errors.confirmPassword && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex items-center text-xs text-red-600 mt-1"
                                >
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {errors.confirmPassword}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </>
                    )}

                    {mode === "signup" && (
                      <motion.div
                        variants={itemVariants}
                        className="space-y-3 pt-2"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-0.5">
                            <Checkbox
                              id="terms"
                              checked={agreeTerms}
                              onCheckedChange={(checked) => {
                                setAgreeTerms(checked as boolean);
                                if (errors.terms) {
                                  setErrors({ ...errors, terms: "" });
                                }
                              }}
                              className={errors.terms ? "border-red-500" : ""}
                              tabIndex={0}
                            />
                          </div>
                          <label
                            htmlFor="terms"
                            className="text-sm text-slate-600 leading-tight cursor-pointer select-none"
                            onClick={() => {
                              setAgreeTerms(!agreeTerms);
                              if (errors.terms) {
                                setErrors({ ...errors, terms: "" });
                              }
                            }}
                          >
                            Tôi đồng ý với{" "}
                            <a
                              href="/terms"
                              className="text-indigo-600 hover:underline font-medium"
                              onClick={(e) => e.stopPropagation()}
                              tabIndex={0}
                            >
                              Điều khoản sử dụng
                            </a>{" "}
                            và{" "}
                            <a
                              href="/privacy"
                              className="text-indigo-600 hover:underline font-medium"
                              onClick={(e) => e.stopPropagation()}
                              tabIndex={0}
                            >
                              Chính sách bảo mật
                            </a>
                          </label>
                        </div>
                        <AnimatePresence>
                          {errors.terms && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center text-xs text-red-600"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.terms}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {mode === "signin" && (
                      <motion.div
                        variants={itemVariants}
                        className="flex justify-end"
                      >
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 text-sm text-indigo-600 hover:text-indigo-700"
                          onClick={() => setMode("forgot")}
                          tabIndex={0}
                        >
                          Quên mật khẩu?
                        </Button>
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-12 justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-indigo-300"
                          disabled={loading}
                          tabIndex={0}
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Đang xử lý...
                            </div>
                          ) : (
                            <span className="flex items-center justify-center">
                              {mode === "signin" && "Đăng nhập"}
                              {mode === "signup" && "Tạo tài khoản"}
                              {mode === "forgot" && "Gửi liên kết"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>

                  {mode !== "forgot" && (
                    <>
                      <motion.div
                        variants={itemVariants}
                        className="relative my-6"
                      >
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white px-3 text-slate-500 font-medium">
                            Hoặc tiếp tục với
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 gap-4"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full h-11 justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                            tabIndex={0}
                          >
                            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </svg>
                            Google
                          </Button>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGithubSignIn}
                            disabled={loading}
                            className="w-full h-11 justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                            tabIndex={0}
                          >
                            <svg
                              className="mr-2 h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                          </Button>
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-slate-200">
                  <motion.div variants={itemVariants}>
                    {mode === "signin" && (
                      <div className="text-sm text-center text-slate-600">
                        Chưa có tài khoản?{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 font-semibold text-indigo-600 hover:text-indigo-700"
                          onClick={() => setMode("signup")}
                          tabIndex={0}
                        >
                          Đăng ký ngay
                        </Button>
                      </div>
                    )}

                    {mode === "signup" && (
                      <div className="text-sm text-center text-slate-600">
                        Đã có tài khoản?{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 font-semibold text-indigo-600 hover:text-indigo-700"
                          onClick={() => setMode("signin")}
                          tabIndex={0}
                        >
                          Đăng nhập
                        </Button>
                      </div>
                    )}

                    {mode === "forgot" && (
                      <div className="text-sm text-center text-slate-600">
                        Nhớ lại mật khẩu?{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 font-semibold text-indigo-600 hover:text-indigo-700"
                          onClick={() => setMode("signin")}
                          tabIndex={0}
                        >
                          Đăng nhập
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
              tabIndex={0}
            >
              ← Về trang chủ
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
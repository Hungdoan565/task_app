import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="404 - Trang Không Tìm Thấy"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
        path="/404"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 Icon */}
            <div className="relative mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="inline-block"
              >
                <FileQuestion className="h-32 w-32 text-indigo-200 mx-auto" />
              </motion.div>
              
              {/* Floating dots */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.2
                }}
                className="absolute top-0 right-1/4 w-4 h-4 bg-indigo-400 rounded-full"
              />
              <motion.div
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5
                }}
                className="absolute bottom-0 left-1/4 w-3 h-3 bg-blue-400 rounded-full"
              />
            </div>

            {/* 404 Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-8xl md:text-9xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-4"
            >
              Oops! Trang Không Tìm Thấy
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 mb-8 max-w-md mx-auto"
            >
              Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              <Link to="/">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 h-12 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Về Trang Chủ
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 h-12 border-2 border-slate-300 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Quay Lại
              </Button>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border-t border-slate-200 pt-8"
            >
              <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                Hoặc khám phá các trang khác
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/features">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Tính Năng
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Pricing
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Về Chúng Tôi
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Liên Hệ
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}


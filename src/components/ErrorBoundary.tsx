import React, { Component, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import analytics from "@/lib/analytics";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Track error in analytics
    analytics.trackError({
      error,
      errorInfo,
      context: "ErrorBoundary",
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Oops! Đã Có Lỗi Xảy Ra
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                Chúng tôi đã ghi nhận sự cố và sẽ khắc phục sớm nhất. Vui lòng thử
                lại hoặc quay về trang chủ.
              </p>

              {/* Error details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 p-4 bg-slate-100 rounded-lg text-left max-w-xl mx-auto">
                  <p className="text-xs font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="text-xs font-mono text-slate-600">
                      <summary className="cursor-pointer hover:text-slate-900">
                        Component Stack
                      </summary>
                      <pre className="mt-2 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  onClick={this.handleReset}
                  className="px-8 h-12 bg-indigo-600 hover:bg-indigo-700"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Thử Lại
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="px-8 h-12 border-2 border-slate-300 hover:border-indigo-600"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Về Trang Chủ
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


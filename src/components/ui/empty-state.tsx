import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <div className="max-w-md mx-auto">
        {/* Icon or Illustration */}
        {illustration ? (
          <div className="mb-6">{illustration}</div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 mb-6"
          >
            <Icon className="h-10 w-10 text-indigo-400" />
          </motion.div>
        )}

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-xl font-bold text-slate-900 mb-3"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-slate-600 mb-6 leading-relaxed"
        >
          {description}
        </motion.p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                size="lg"
                className="border-2 hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                {secondaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}


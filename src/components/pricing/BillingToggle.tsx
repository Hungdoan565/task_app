import { motion } from "framer-motion";

interface BillingToggleProps {
  value: "monthly" | "annual";
  onChange: (value: "monthly" | "annual") => void;
  annualDiscount?: number;
}

export default function BillingToggle({
  value,
  onChange,
  annualDiscount = 20,
}: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <span
        className={`text-sm font-medium transition-colors ${
          value === "monthly" ? "text-slate-900" : "text-slate-500"
        }`}
      >
        Hàng tháng
      </span>

      <button
        onClick={() => onChange(value === "monthly" ? "annual" : "monthly")}
        className="relative inline-flex h-8 w-16 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        role="switch"
        aria-checked={value === "annual"}
        aria-label="Toggle billing period"
      >
        <motion.span
          initial={false}
          animate={{
            x: value === "annual" ? 32 : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className={`inline-block h-6 w-6 transform rounded-full shadow-lg transition-colors ${
            value === "annual"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600"
              : "bg-white"
          }`}
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${
            value === "annual" ? "text-slate-900" : "text-slate-500"
          }`}
        >
          Hàng năm
        </span>
        {annualDiscount > 0 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm"
          >
            Tiết kiệm {annualDiscount}%
          </motion.span>
        )}
      </div>
    </div>
  );
}


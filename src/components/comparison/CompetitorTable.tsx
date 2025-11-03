import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check, X, Minus } from "lucide-react";

interface ComparisonRow {
  feature: string;
  taskflow: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
  competitor3: boolean | string;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Giá cả",
    taskflow: "Miễn phí - 299k/tháng",
    competitor1: "Miễn phí - 500k/tháng",
    competitor2: "Miễn phí - 450k/tháng",
    competitor3: "Miễn phí - 600k/tháng",
  },
  {
    feature: "Kanban Board",
    taskflow: true,
    competitor1: true,
    competitor2: true,
    competitor3: true,
  },
  {
    feature: "Timeline View",
    taskflow: true,
    competitor1: true,
    competitor2: false,
    competitor3: true,
  },
  {
    feature: "Calendar Integration",
    taskflow: true,
    competitor1: true,
    competitor2: true,
    competitor3: false,
  },
  {
    feature: "AI Task Assistant",
    taskflow: true,
    competitor1: false,
    competitor2: "Có (Premium)",
    competitor3: false,
  },
  {
    feature: "Workflow Automation",
    taskflow: true,
    competitor1: "Giới hạn",
    competitor2: true,
    competitor3: false,
  },
  {
    feature: "Real-time Collaboration",
    taskflow: true,
    competitor1: true,
    competitor2: true,
    competitor3: "Có (Premium)",
  },
  {
    feature: "Custom Templates",
    taskflow: true,
    competitor1: "Giới hạn",
    competitor2: true,
    competitor3: false,
  },
  {
    feature: "Mobile App",
    taskflow: true,
    competitor1: true,
    competitor2: true,
    competitor3: true,
  },
  {
    feature: "Offline Mode",
    taskflow: true,
    competitor1: false,
    competitor2: true,
    competitor3: false,
  },
  {
    feature: "API Access",
    taskflow: true,
    competitor1: "Có (Premium)",
    competitor2: true,
    competitor3: "Có (Enterprise)",
  },
  {
    feature: "Advanced Analytics",
    taskflow: true,
    competitor1: "Có (Premium)",
    competitor2: "Có (Premium)",
    competitor3: false,
  },
  {
    feature: "Hỗ trợ tiếng Việt",
    taskflow: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
  },
  {
    feature: "Hỗ trợ 24/7",
    taskflow: "Có (Pro+)",
    competitor1: "Có (Enterprise)",
    competitor2: "Có (Premium)",
    competitor3: "Có (Enterprise)",
  },
];

const renderValue = (value: boolean | string) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-5 w-5 text-green-600 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-red-400 mx-auto" />
    );
  }
  
  if (value.includes("Giới hạn") || value.includes("Premium") || value.includes("Enterprise")) {
    return (
      <span className="text-xs text-slate-600 flex items-center justify-center gap-1">
        <Minus className="h-4 w-4 text-orange-500" />
        {value}
      </span>
    );
  }
  
  return <span className="text-xs text-slate-700 text-center">{value}</span>;
};

export default function CompetitorTable() {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          So Sánh Với Đối Thủ
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          TaskFlow vượt trội về tính năng và giá cả so với các công cụ tương tự
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-slate-200 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Tính năng</th>
                  <th className="px-4 py-4 text-center font-semibold">
                    <div className="flex flex-col items-center">
                      <span className="text-yellow-300 text-lg mb-1">⭐</span>
                      <span>TaskFlow</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center font-semibold">Asana</th>
                  <th className="px-4 py-4 text-center font-semibold">Trello</th>
                  <th className="px-4 py-4 text-center font-semibold">Monday</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`border-t border-slate-200 hover:bg-slate-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 text-sm">
                      {row.feature}
                    </td>
                    <td className="px-4 py-4 bg-indigo-50/50">
                      <div className="flex justify-center">
                        {renderValue(row.taskflow)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        {renderValue(row.competitor1)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        {renderValue(row.competitor2)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        {renderValue(row.competitor3)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-t border-indigo-200">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Check className="h-4 w-4 text-green-600" />
              <span>Có sẵn</span>
              <span className="mx-2">|</span>
              <X className="h-4 w-4 text-red-400" />
              <span>Không có</span>
              <span className="mx-2">|</span>
              <Minus className="h-4 w-4 text-orange-500" />
              <span>Có giới hạn/Trả phí</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-slate-500 max-w-3xl mx-auto">
          * Dữ liệu cập nhật tháng 11/2024. Các tính năng và giá cả của đối thủ có thể thay đổi.
          TaskFlow tự hào là giải pháp quản lý công việc Việt Nam với hỗ trợ đầy đủ tiếng Việt và
          giá cả cạnh tranh nhất.
        </p>
      </motion.div>
    </div>
  );
}


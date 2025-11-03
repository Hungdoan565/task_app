import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export default function ROICalculator() {
  const [teamSize, setTeamSize] = useState(10);
  const [avgHourlySalary, setAvgHourlySalary] = useState(150000); // VND per hour
  const [hoursWastedPerWeek, setHoursWastedPerWeek] = useState(5);

  // Calculations
  const weeklyWaste = teamSize * hoursWastedPerWeek * avgHourlySalary;
  const monthlyWaste = weeklyWaste * 4;
  const yearlyWaste = monthlyWaste * 12;

  // Assume TaskFlow saves 40% of wasted time
  const taskflowSavings = yearlyWaste * 0.4;
  const proYearlyCost = 99000 * 12 * teamSize * 0.8; // 20% discount for annual
  const netSavings = taskflowSavings - proYearlyCost;
  const roi = proYearlyCost > 0 ? ((netSavings / proYearlyCost) * 100).toFixed(0) : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Tính Toán ROI Của Bạn
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Xem TaskFlow có thể tiết kiệm bao nhiêu chi phí cho đội nhóm của bạn
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-indigo-600" />
                Thông Tin Đội Nhóm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="teamSize" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Số lượng thành viên: <span className="text-indigo-600 font-bold">{teamSize}</span>
                </Label>
                <Input
                  id="teamSize"
                  type="range"
                  min="1"
                  max="100"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <Label htmlFor="avgHourlySalary" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Lương TB/giờ (VND): <span className="text-indigo-600 font-bold">{formatCurrency(avgHourlySalary)}</span>
                </Label>
                <Input
                  id="avgHourlySalary"
                  type="range"
                  min="50000"
                  max="500000"
                  step="10000"
                  value={avgHourlySalary}
                  onChange={(e) => setAvgHourlySalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50K</span>
                  <span>250K</span>
                  <span>500K</span>
                </div>
              </div>

              <div>
                <Label htmlFor="hoursWasted" className="text-sm font-semibold text-slate-700 mb-2 block">
                  Giờ lãng phí/tuần (do kém tổ chức): <span className="text-indigo-600 font-bold">{hoursWastedPerWeek}h</span>
                </Label>
                <Input
                  id="hoursWasted"
                  type="range"
                  min="1"
                  max="20"
                  value={hoursWastedPerWeek}
                  onChange={(e) => setHoursWastedPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1h</span>
                  <span>10h</span>
                  <span>20h</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 italic">
                  * Trung bình: nhân viên mất 5-8 giờ/tuần do email, meetings không hiệu quả
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <TrendingUp className="h-5 w-5" />
                Kết Quả Tính Toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Annual Waste */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-red-200" />
                  <p className="text-sm text-indigo-100">Chi phí lãng phí hàng năm</p>
                </div>
                <p className="text-3xl font-bold">
                  {formatCurrency(yearlyWaste)}
                </p>
              </div>

              {/* TaskFlow Savings */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-200" />
                  <p className="text-sm text-indigo-100">Tiết kiệm với TaskFlow (40%)</p>
                </div>
                <p className="text-3xl font-bold text-green-300">
                  {formatCurrency(taskflowSavings)}
                </p>
              </div>

              {/* Net Savings */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-yellow-200" />
                  <p className="text-sm text-indigo-100">Lợi nhuận ròng/năm</p>
                </div>
                <p className="text-3xl font-bold text-yellow-300">
                  {formatCurrency(netSavings)}
                </p>
                <p className="text-sm text-indigo-200 mt-2">
                  (Đã trừ chi phí gói Pro: {formatCurrency(proYearlyCost)})
                </p>
              </div>

              {/* ROI */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 shadow-xl">
                <p className="text-sm font-medium mb-2">Return on Investment (ROI)</p>
                <p className="text-5xl font-bold">
                  {roi}%
                </p>
                <p className="text-sm mt-2 opacity-90">
                  Mỗi 1₫ đầu tư → {((Number(roi) / 100) + 1).toFixed(1)}₫ giá trị
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          * Số liệu tính toán dựa trên nghiên cứu về năng suất làm việc. Kết quả thực tế có thể khác nhau tuỳ theo từng tổ chức.
          TaskFlow giúp giảm thiểu thời gian lãng phí qua tự động hoá, tập trung công việc và cộng tác hiệu quả.
        </p>
      </motion.div>
    </div>
  );
}


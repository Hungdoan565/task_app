import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { CheckCircle, Users, List } from "lucide-react";

interface FeatureScreenshotProps {
  icon: LucideIcon;
  title: string;
  variant?: "kanban" | "calendar" | "timeline" | "dashboard" | "default";
  className?: string;
}

const generateMockKanban = () => (
  <div className="grid grid-cols-3 gap-3 p-4">
    {["To Do", "In Progress", "Done"].map((column, idx) => (
      <div key={column} className="bg-slate-50 rounded-lg p-3">
        <div className="text-xs font-semibold text-slate-600 mb-3">{column}</div>
        <div className="space-y-2">
          {[...Array(idx === 1 ? 2 : 3)].map((_, cardIdx) => (
            <div
              key={cardIdx}
              className="bg-white rounded p-2 shadow-sm border border-slate-200"
            >
              <div className="h-2 bg-slate-200 rounded w-3/4 mb-1" />
              <div className="h-2 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const generateMockCalendar = () => (
  <div className="p-4">
    <div className="grid grid-cols-7 gap-1 mb-2">
      {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
        <div key={day} className="text-xs font-semibold text-slate-600 text-center">
          {day}
        </div>
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {[...Array(35)].map((_, idx) => {
        const isNextMonth = idx >= 30;
        const displayDay = isNextMonth ? idx - 29 : idx + 1;
        const eventCells = new Set([9, 14, 20]);
        const isEventDay = eventCells.has(idx);

        const baseClass = isNextMonth
          ? "bg-slate-50 text-slate-300"
          : "bg-slate-50 text-slate-600";

        const highlightClass = isEventDay
          ? "bg-indigo-100 text-indigo-700 font-semibold"
          : baseClass;

        return (
          <div
            key={idx}
            className={`aspect-square rounded text-xs flex items-center justify-center ${highlightClass}`}
          >
            {displayDay}
            {isEventDay && (
              <div className="w-1 h-1 bg-indigo-500 rounded-full ml-1" />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const generateMockTimeline = () => (
  <div className="p-4 space-y-3">
    {[
      { title: "Project Planning", progress: 100, color: "bg-green-500" },
      { title: "Design Phase", progress: 60, color: "bg-indigo-500" },
      { title: "Development", progress: 30, color: "bg-blue-500" },
      { title: "Testing", progress: 0, color: "bg-slate-300" },
    ].map((item, idx) => (
      <div key={idx} className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">{item.title}</span>
          <span className="text-slate-500">{item.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${item.color} transition-all`}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const generateMockDashboard = () => (
  <div className="p-4 space-y-3">
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Total Tasks", value: "24", icon: List },
        { label: "Completed", value: "18", icon: CheckCircle },
        { label: "Team", value: "8", icon: Users },
      ].map((stat, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-3 text-center border border-indigo-100"
        >
          <stat.icon className="h-4 w-4 mx-auto mb-1 text-indigo-600" />
          <div className="text-xs font-bold text-slate-900">{stat.value}</div>
          <div className="text-[10px] text-slate-600">{stat.label}</div>
        </div>
      ))}
    </div>
    <div className="bg-slate-50 rounded-lg p-3 space-y-2">
      <div className="text-xs font-semibold text-slate-600 mb-2">Recent Activity</div>
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex items-center gap-2 bg-white rounded p-2">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="h-3 w-3 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="h-2 bg-slate-200 rounded w-3/4 mb-1" />
            <div className="h-1.5 bg-slate-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function FeatureScreenshot({
  icon: Icon,
  title,
  variant = "default",
  className = "",
}: FeatureScreenshotProps) {
  const getMockContent = () => {
    switch (variant) {
      case "kanban":
        return generateMockKanban();
      case "calendar":
        return generateMockCalendar();
      case "timeline":
        return generateMockTimeline();
      case "dashboard":
        return generateMockDashboard();
      default:
        return (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <Icon className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 font-semibold mb-2">{title}</p>
              <p className="text-slate-400 text-sm">Interactive demo</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg hover:shadow-2xl hover:border-indigo-200 transition-all duration-300">
        {/* Browser Chrome */}
        <div className="bg-slate-200 px-3 py-2 flex items-center gap-2 border-b border-slate-300">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-[10px] text-slate-500">
            taskflow.vn
          </div>
        </div>

        {/* Content */}
        <div className="bg-white min-h-[240px]">{getMockContent()}</div>
      </Card>
    </motion.div>
  );
}


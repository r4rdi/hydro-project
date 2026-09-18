import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export type SensorStatus = "optimal" | "warning" | "critical" | "offline";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: SensorStatus;
  icon: LucideIcon;
}

export function SensorCard({ title, value, unit, status, icon: Icon }: SensorCardProps) {
  const statusConfig = {
    optimal: { color: "text-brand-green-dark", bg: "bg-brand-green-primary/10", border: "border-brand-green-primary/20", label: "Optimal" },
    warning: { color: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200", label: "Warning" },
    critical: { color: "text-red-600", bg: "bg-red-100", border: "border-red-200", label: "Critical" },
    offline: { color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200", label: "Offline" },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="p-5 flex flex-col justify-between h-full group relative overflow-hidden w-full">
      <div className={cn("absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-30 rounded-full transition-colors duration-500", currentStatus.bg)} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-brand-orange-start transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider", currentStatus.bg, currentStatus.color, currentStatus.border)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", status === "offline" ? "bg-gray-400" : currentStatus.color.replace("text-", "bg-"))} />
          {currentStatus.label}
        </div>
      </div>

      <div className="mt-2 relative z-10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{status === "offline" ? "--" : value}</span>
          <span className="text-sm font-semibold text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}

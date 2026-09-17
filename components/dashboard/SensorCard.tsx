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
    optimal: { color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/20", label: "Optimal" },
    warning: { color: "text-brand-amber", bg: "bg-brand-amber/10", border: "border-brand-amber/20", label: "Warning" },
    critical: { color: "text-brand-red", bg: "bg-brand-red/10", border: "border-brand-red/20", label: "Critical" },
    offline: { color: "text-zinc-500", bg: "bg-zinc-800", border: "border-zinc-700", label: "Offline" },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="glass-card p-5 flex flex-col justify-between h-full group relative overflow-hidden">
      <div className={cn("absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 rounded-full transition-colors duration-500", currentStatus.bg)} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
            <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-medium text-zinc-300">{title}</h3>
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5", currentStatus.bg, currentStatus.color, currentStatus.border)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", status === "offline" ? "bg-zinc-500" : currentStatus.color.replace("text-", "bg-"))} />
          {currentStatus.label}
        </div>
      </div>

      <div className="mt-2 relative z-10">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-white tracking-tight">{status === "offline" ? "--" : value}</span>
          <span className="text-sm font-medium text-zinc-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}

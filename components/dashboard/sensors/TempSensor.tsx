import { Droplets, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { TelemetryDataPoint } from "@/components/dashboard/TelemetryChart";
import { getWaterTempStyle } from "@/lib/waterTempStyle";

interface TempSensorProps {
  value: number;
  data: TelemetryDataPoint[];
}

export function TempSensor({ value, data }: TempSensorProps) {
  const isOffline = value === 0;
  const style = isOffline 
    ? { icon: "⚫", label: "OFFLINE", textClass: "text-slate-400" }
    : getWaterTempStyle(value);

  const MAX_TEMP = 50;
  const percent = Math.min(Math.max((value / MAX_TEMP) * 100, 0), 100);

  return (
    <div className="p-5 flex flex-col justify-between h-full w-full relative group overflow-hidden bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
            <Droplets className={cn("w-5 h-5 transition-colors", isOffline ? "text-slate-400" : "text-brand-orange-start")} />
          </div>
          <h3 className="font-semibold text-gray-700">Water Temp</h3>
        </div>
        <div
          className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider backdrop-blur-md",
            isOffline 
              ? "bg-slate-100 text-slate-500 border-slate-200" 
              : "bg-white border-gray-100 text-gray-600 shadow-sm"
          )}
        >
          <span className="text-xs">{style.icon}</span>
          <span>{style.label}</span>
        </div>
      </div>

      {/* Thermometer Indicator */}
      <div className="flex-1 flex items-center justify-center relative w-full h-full my-4 -translate-x-4">
        <div className="relative h-full w-[120px] max-h-[220px] flex items-center">
          
          {/* Tooltip Bubble (Left side) */}
          <div 
            className="absolute left-0 z-20 flex items-center transition-all duration-1000 ease-in-out"
            style={{ bottom: `calc(${percent}% - 16px)` }}
          >
            <div className="bg-[#333333] text-white px-3 py-1.5 rounded-full font-bold text-lg flex items-baseline gap-0.5 shadow-lg relative">
              {isOffline ? "--" : <AnimatedNumber value={value} decimals={1} />}
              <span className="text-sm">°C</span>
              {/* Pointer triangle */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-l-8 border-l-[#333333]" />
            </div>
          </div>

          {/* Thermometer Tube */}
          <div className="absolute right-0 w-12 h-full bg-[#e5e7eb] rounded-full overflow-hidden shadow-inner border-2 border-white">
            {/* Gradient Liquid Fill */}
            <div 
              className="absolute bottom-0 left-0 right-0 w-full transition-all duration-1000 ease-in-out"
              style={{ 
                height: `${percent}%`,
                background: 'linear-gradient(to top, #38bdf8 0%, #34d399 40%, #fbbf24 70%, #f87171 100%)',
                backgroundSize: '100% 220px', // Lock gradient to absolute scale, not relative height
                backgroundPosition: 'bottom'
              }}
            >
              {/* Optional: Liquid wave / highlight effect */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-t-full" />
            </div>
          </div>

          {/* Tick Marks (Overlayed on left side of tube) */}
          <div className="absolute right-12 h-full flex flex-col justify-between py-4 pointer-events-none z-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2.5 h-[2px] bg-white rounded-r-sm opacity-80" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Button */}
      <div className="mt-auto flex justify-end relative z-10">
        <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-brand-orange-start transition-colors bg-white/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 hover:border-brand-orange-start/30 shadow-sm">
          VIEW LOGS <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

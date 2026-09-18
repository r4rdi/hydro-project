'use client';

import { Beaker, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { motion } from "motion/react";

interface pHSensorProps {
  value: number;
}

export function PHSensor({ value }: pHSensorProps) {
  const isWarning = value < 5.5 || value > 6.5;
  const isOffline = value === 0;

  const MAX_PH = 14;
  const percentage = Math.min(Math.max((value / MAX_PH) * 100, 0), 100);

  // Safe zone calculations
  const safeMin = 5.5;
  const safeMax = 6.5;
  const safeLeft = (safeMin / MAX_PH) * 100;
  const safeWidth = ((safeMax - safeMin) / MAX_PH) * 100;

  return (
    <div className="p-5 flex flex-col justify-between h-full w-full relative group">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
            <Beaker className="w-5 h-5 text-gray-400 group-hover:text-brand-orange-start transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-700">pH Level</h3>
        </div>
        {!isOffline && (
          <div
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider",
              isWarning
                ? "bg-orange-500/10 text-orange-600 border-orange-200"
                : "bg-emerald-500/10 text-emerald-600 border-emerald-200"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isWarning ? "bg-orange-500" : "bg-emerald-500"
              )}
            />
            {isWarning ? "Warning" : "Optimal"}
          </div>
        )}
      </div>

      {/* pH Gradient Bar */}
      <div className="flex-1 flex flex-col justify-center -translate-y-4">
        <div className="relative w-full h-4 rounded-full mt-2 bg-gradient-to-r from-red-500 via-yellow-400 to-indigo-600 shadow-inner">
          {/* Safe Zone Highlight */}
          <div 
            className="absolute top-[-4px] bottom-[-4px] bg-white/40 border-x-2 border-white/80 rounded-[2px]"
            style={{ left: `${safeLeft}%`, width: `${safeWidth}%` }}
          />

          {/* Marker thumb */}
          <motion.div
            className="absolute top-1/2 -mt-3 -ml-2 w-4 h-6 bg-white border border-gray-300 shadow-md rounded-[4px] z-10 flex items-center justify-center"
            initial={{ left: "0%" }}
            animate={{ left: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="w-0.5 h-3 bg-gray-300 rounded-full" />
          </motion.div>
        </div>
        
        {/* Min/Max Labels */}
        <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2 px-1">
          <span>0</span>
          <span>7</span>
          <span>14</span>
        </div>
      </div>

      {/* Absolute Centered Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 pointer-events-none z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            {isOffline ? "--" : <AnimatedNumber value={value} decimals={2} />}
          </span>
          <span className="text-lg font-bold text-gray-700 uppercase">pH</span>
        </div>
      </div>

      {/* Footer / Button */}
      <div className="mt-auto flex justify-end relative z-10">
        <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-brand-orange-start transition-colors bg-white/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 hover:border-brand-orange-start/30">
          VIEW LOGS <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

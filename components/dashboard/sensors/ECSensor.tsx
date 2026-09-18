'use client';

import { ActivitySquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { motion } from "motion/react";

interface ECSensorProps {
  value: number;
}

export function ECSensor({ value }: ECSensorProps) {
  const isWarning = value < 1.0 || value > 2.5;
  const isOffline = value === 0;

  // For the gauge calculation (Assuming max EC is 4.0 for display purposes)
  const MAX_EC = 4.0;
  const percentage = Math.min(Math.max((value / MAX_EC) * 100, 0), 100);
  
  // A standard SVG semi-circle path length is approx 125.6 for r=40
  const pathLength = 125.6; 
  const strokeDashoffset = pathLength - (pathLength * percentage) / 100;

  return (
    <div className="p-5 flex flex-col justify-between h-full w-full relative group">
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
            <ActivitySquare className="w-5 h-5 text-gray-400 group-hover:text-brand-orange-start transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-700">EC / TDS</h3>
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

      {/* Gauge and Value */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-2">
        <svg
          viewBox="0 0 100 65"
          className="w-full max-w-[220px] overflow-visible"
        >
          <defs>
            <linearGradient id="ec-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />    {/* Blue (Low) */}
              <stop offset="50%" stopColor="#10b981" />   {/* Green (Optimal 2.0 mS/cm) */}
              <stop offset="75%" stopColor="#f59e0b" />   {/* Orange (High) */}
              <stop offset="100%" stopColor="#ef4444" />  {/* Red (Warning) */}
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.15" />
            </filter>
          </defs>
          
          {/* Background Track */}
          <path
            d="M 15 50 A 35 35 0 0 1 85 50"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Tick Marks */}
          <g>
            {[0, 25.7, 51.4, 77.1, 102.8, 128.5, 154.2, 180].map((deg, i) => (
              <line 
                key={i} 
                x1="24" y1="50" x2="26" y2="50" 
                stroke="#cbd5e1" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                transform={`rotate(${deg} 50 50)`} 
              />
            ))}
          </g>
          
          {/* Animated Value Track */}
          <motion.path
            d="M 15 50 A 35 35 0 0 1 85 50"
            fill="none"
            stroke="url(#ec-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={109.95} // approx pi * 35
            initial={{ strokeDashoffset: 109.95 }}
            animate={{ strokeDashoffset: 109.95 - (109.95 * percentage) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Needle Pointer */}
          <motion.g
            initial={{ rotate: 0, originX: "50%", originY: "50%" }}
            animate={{ rotate: (percentage / 100) * 180, originX: "50%", originY: "50%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#shadow)"
          >
            {/* Transparent bounding circle to force center at 50,50 */}
            <circle cx="50" cy="50" r="50" fill="transparent" />
            {/* Needle Line */}
            <polygon points="50,48.5 50,51.5 18,50" fill="#f43f5e" />
          </motion.g>
          
          {/* Center Pivot Base */}
          <circle cx="50" cy="50" r="4.5" fill="#e2e8f0" filter="url(#shadow)" />
          <circle cx="50" cy="50" r="2" fill="#f43f5e" />

        </svg>

        {/* Value below Gauge */}
        <div className="mt-4 flex items-baseline gap-1 pointer-events-none">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {isOffline ? "--" : <AnimatedNumber value={value} decimals={2} />}
          </span>
          <span className="text-xs font-bold text-gray-400 uppercase">mS/cm</span>
        </div>
      </div>

      {/* Footer / Button */}
      <div className="mt-2 flex justify-end relative z-10">
        <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-brand-orange-start transition-colors bg-white/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 hover:border-brand-orange-start/30">
          VIEW LOGS <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

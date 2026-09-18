'use client';

import { Wind, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface HumiditySensorProps {
  value: number;
}

export function HumiditySensor({ value }: HumiditySensorProps) {
  const isWarning = value > 80;
  const isOffline = value === 0;

  // Calculate top offset for the wave (0% humidity = top: 100%, 100% humidity = top: 0%)
  const percentage = Math.min(Math.max(value, 0), 100);
  const fillHeight = `${100 - percentage}%`;

  return (
    <div className="p-5 flex flex-col justify-between h-full w-full relative group overflow-hidden bg-white">
      {/* Dynamic Keyframes for wave animation */}
      <style>{`
        @keyframes waveShift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-fast {
          animation: waveShift 3s linear infinite;
        }
        .animate-wave-slow {
          animation: waveShift 5s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gray-50 border border-gray-100 bg-white/50 backdrop-blur-md">
            <Wind className="w-5 h-5 text-gray-400 group-hover:text-brand-orange-start transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-700 bg-white/50 px-1 rounded backdrop-blur-sm">Air Humidity</h3>
        </div>
        {!isOffline && (
          <div
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider backdrop-blur-md",
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

      {/* Liquid Wave Fill */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-blue-100 transition-all duration-1000 ease-in-out"
        style={{ top: fillHeight }}
      >
        {/* Background Wave */}
        <div className="absolute left-0 right-0 top-[-20px] h-[20px] w-[200%] animate-wave-slow opacity-50">
          <svg viewBox="0 0 200 20" className="w-full h-full" preserveAspectRatio="none">
            <path d="M 0 10 Q 25 0 50 10 T 100 10 T 150 10 T 200 10 V 20 H 0 Z" fill="#dbeafe" />
          </svg>
        </div>
        
        {/* Foreground Wave */}
        <div className="absolute left-0 right-0 top-[-15px] h-[15px] w-[200%] animate-wave-fast">
          <svg viewBox="0 0 200 15" className="w-full h-full" preserveAspectRatio="none">
            <path d="M 0 7.5 Q 25 15 50 7.5 T 100 7.5 T 150 7.5 T 200 7.5 V 15 H 0 Z" fill="#dbeafe" />
          </svg>
        </div>
      </div>

      {/* Absolute Centered Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="flex items-baseline gap-1 bg-white/40 px-4 py-2 rounded-2xl backdrop-blur-md shadow-sm border border-white/50">
          <span className="text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            {isOffline ? "--" : <AnimatedNumber value={value} decimals={0} />}
          </span>
          <span className="text-lg font-bold text-gray-700">%</span>
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

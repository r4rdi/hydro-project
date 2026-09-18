export type TempStatus =
  | "freezing"
  | "cold"
  | "cool"
  | "optimal"
  | "peak"
  | "warm"
  | "hot"
  | "critical";

export interface WaterTempStyle {
  status: TempStatus;
  label: string;
  bgClass: string;
  textClass: string;
  glowClass: string;
  icon: string;
  strokeColor: string; // added for sparkline
}

export function getWaterTempStyle(temp: number): WaterTempStyle {
  if (temp < 8) {
    return {
      status: "freezing",
      label: "CRITICAL COLD",
      bgClass: "bg-blue-950/70 border-blue-700/60",
      textClass: "text-blue-300",
      glowClass: "drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]",
      icon: "❄️",
      strokeColor: "#93c5fd",
    };
  }
  if (temp < 12) {
    return {
      status: "cold",
      label: "VERY COLD",
      bgClass: "bg-blue-900/60 border-blue-600/50",
      textClass: "text-blue-200",
      glowClass: "drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]",
      icon: "🧊",
      strokeColor: "#bfdbfe",
    };
  }
  if (temp < 15) {
    return {
      status: "cold",
      label: "COLD",
      bgClass: "bg-blue-800/50 border-blue-500/40",
      textClass: "text-blue-100",
      glowClass: "drop-shadow-[0_0_8px_rgba(147,197,253,0.3)]",
      icon: "💧",
      strokeColor: "#dbeafe",
    };
  }
  if (temp < 18) {
    return {
      status: "cool",
      label: "COOL",
      bgClass: "bg-cyan-700/40 border-cyan-500/40",
      textClass: "text-cyan-100",
      glowClass: "drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]",
      icon: "🌊",
      strokeColor: "#cffafe",
    };
  }
  if (temp < 20) {
    return {
      status: "optimal",
      label: "OPTIMAL",
      bgClass: "bg-emerald-700/40 border-emerald-500/50",
      textClass: "text-emerald-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]",
      icon: "🌱",
      strokeColor: "#d1fae5",
    };
  }
  if (temp <= 22) {
    return {
      status: "peak",
      label: "PEAK OPTIMAL",
      bgClass: "bg-emerald-600/50 border-emerald-400/70",
      textClass: "text-white",
      glowClass: "drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]",
      icon: "✅",
      strokeColor: "#ffffff",
    };
  }
  if (temp <= 24) {
    return {
      status: "optimal",
      label: "OPTIMAL",
      bgClass: "bg-emerald-700/40 border-emerald-500/50",
      textClass: "text-emerald-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]",
      icon: "🌿",
      strokeColor: "#d1fae5",
    };
  }
  if (temp <= 26) {
    return {
      status: "warm",
      label: "WARM",
      bgClass: "bg-amber-600/40 border-amber-500/50",
      textClass: "text-amber-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]",
      icon: "⚠️",
      strokeColor: "#fef3c7",
    };
  }
  if (temp <= 30) {
    return {
      status: "hot",
      label: "HOT",
      bgClass: "bg-orange-600/50 border-orange-500/60",
      textClass: "text-orange-100",
      glowClass: "drop-shadow-[0_0_12px_rgba(255,107,0,0.4)]",
      icon: "🔥",
      strokeColor: "#ffedd5",
    };
  }
  if (temp <= 35) {
    return {
      status: "hot",
      label: "VERY HOT",
      bgClass: "bg-orange-700/60 border-orange-500/70",
      textClass: "text-orange-50",
      glowClass: "drop-shadow-[0_0_14px_rgba(234,88,12,0.5)]",
      icon: "🔥🔥",
      strokeColor: "#fff7ed",
    };
  }
  if (temp <= 40) {
    return {
      status: "critical",
      label: "CRITICAL",
      bgClass: "bg-red-600/50 border-red-500/60",
      textClass: "text-red-50",
      glowClass: "drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]",
      icon: "🚨",
      strokeColor: "#fef2f2",
    };
  }
  return {
    status: "critical",
    label: "EXTREME",
    bgClass: "bg-red-700/60 border-red-500/80 animate-pulse",
    textClass: "text-white",
    glowClass: "drop-shadow-[0_0_16px_rgba(239,68,68,0.7)]",
    icon: "💀",
    strokeColor: "#ffffff",
  };
}

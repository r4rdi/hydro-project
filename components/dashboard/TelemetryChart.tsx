"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

export interface TelemetryDataPoint {
  timestamp: string;
  value: number;
}

interface TelemetryChartProps {
  title: string;
  data: TelemetryDataPoint[];
  color: "green" | "blue" | "amber" | "red" | "orange";
  unit: string;
  minDomain?: number | "auto";
  maxDomain?: number | "auto";
}

export function TelemetryChart({ title, data, color, unit, minDomain = "auto", maxDomain = "auto" }: TelemetryChartProps) {
  const colorMap = {
    green: "#10b981",
    blue: "#3b82f6",
    amber: "#f59e0b",
    red: "#ef4444",
    orange: "#ff6b00",
  };

  const hexColor = colorMap[color as keyof typeof colorMap] || colorMap.green;

  return (
    <div className="p-6 h-[320px] flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -top-20 -left-20 w-40 h-40 blur-3xl opacity-20 rounded-full transition-colors duration-700" style={{ backgroundColor: hexColor }} />
      <h3 className="font-bold text-gray-800 mb-6 relative z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hexColor }} />
        {title}
      </h3>
      <div className="flex-1 w-full h-full min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={hexColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={hexColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9CA3AF" 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                try {
                  return format(new Date(val), "HH:mm");
                } catch {
                  return "";
                }
              }}
              minTickGap={30}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              domain={[minDomain, maxDomain]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-100 p-3 shadow-xl rounded-xl">
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                        {label ? format(new Date(label), "HH:mm:ss") : ""}
                      </p>
                      <p className="text-gray-900 font-extrabold text-lg">
                        {payload[0].value} <span className="text-gray-500 text-xs font-semibold">{unit}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={hexColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color-${color})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

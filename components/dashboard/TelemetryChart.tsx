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
  color: "green" | "blue" | "amber" | "red";
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
  };

  const hexColor = colorMap[color];

  return (
    <div className="glass-panel p-5 h-[300px] flex flex-col">
      <h3 className="font-medium text-zinc-300 mb-4">{title}</h3>
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={hexColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={hexColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#52525b" 
              fontSize={12} 
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
              stroke="#52525b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              domain={[minDomain, maxDomain]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card !bg-zinc-900/90 p-3 shadow-2xl">
                      <p className="text-zinc-400 text-xs mb-1">
                        {label ? format(new Date(label), "HH:mm:ss") : ""}
                      </p>
                      <p className="text-white font-medium">
                        {payload[0].value} <span className="text-zinc-500 text-xs">{unit}</span>
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
              strokeWidth={2}
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

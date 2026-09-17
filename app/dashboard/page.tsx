"use client";

import { useState, useEffect } from "react";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { ActuatorControl } from "@/components/dashboard/ActuatorControl";
import { TelemetryChart, TelemetryDataPoint } from "@/components/dashboard/TelemetryChart";
import { Beaker, Droplets, Wind, Fan, ActivitySquare, AlertCircle } from "lucide-react";

const generateMockData = (base: number, variance: number, count: number): TelemetryDataPoint[] => {
  const data: TelemetryDataPoint[] = [];
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 60000).toISOString(),
      value: Number((base + (Math.random() * variance * 2 - variance)).toFixed(2)),
    });
  }
  return data;
};

export default function DashboardPage() {
  const [phData, setPhData] = useState<TelemetryDataPoint[]>([]);
  const [ecData, setEcData] = useState<TelemetryDataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPhData(generateMockData(6.2, 0.3, 30));
    setEcData(generateMockData(1.8, 0.1, 30));
    setMounted(true);

    const interval = setInterval(() => {
      const now = new Date().toISOString();
      setPhData(prev => [...prev.slice(1), { timestamp: now, value: Number((6.2 + (Math.random() * 0.6 - 0.3)).toFixed(2)) }]);
      setEcData(prev => [...prev.slice(1), { timestamp: now, value: Number((1.8 + (Math.random() * 0.2 - 0.1)).toFixed(2)) }]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render with random data

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard 
          title="pH Level" 
          value={phData[phData.length - 1]?.value || 0} 
          unit="pH" 
          status="optimal" 
          icon={Beaker} 
        />
        <SensorCard 
          title="EC / TDS" 
          value={ecData[ecData.length - 1]?.value || 0} 
          unit="mS/cm" 
          status="optimal" 
          icon={ActivitySquare} 
        />
        <SensorCard 
          title="Water Temp" 
          value={24.7} 
          unit="°C" 
          status="warning" 
          icon={Droplets} 
        />
        <SensorCard 
          title="Air Humidity" 
          value={72.1} 
          unit="%" 
          status="optimal" 
          icon={Wind} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TelemetryChart 
              title="pH Trend (Live)" 
              data={phData} 
              color="green" 
              unit="pH" 
              minDomain={5.5} 
              maxDomain={7.0} 
            />
            <TelemetryChart 
              title="EC Trend (Live)" 
              data={ecData} 
              color="blue" 
              unit="mS/cm" 
              minDomain={1.5} 
              maxDomain={2.2} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5">
            <h3 className="font-medium text-zinc-300 mb-4">Actuator Controls</h3>
            <div className="space-y-3">
              <ActuatorControl 
                name="Circulation Pump" 
                initialState={true} 
                mode="auto" 
                icon={Droplets} 
                onToggle={() => {}} 
                onModeChange={() => {}} 
              />
              <ActuatorControl 
                name="Dosing Pump A" 
                initialState={false} 
                mode="auto" 
                icon={Beaker} 
                onToggle={() => {}} 
                onModeChange={() => {}} 
              />
              <ActuatorControl 
                name="Exhaust Fan" 
                initialState={true} 
                mode="manual" 
                icon={Fan} 
                onToggle={() => {}} 
                onModeChange={() => {}} 
              />
            </div>
          </div>

          <div className="glass-panel p-5">
             <h3 className="font-medium text-zinc-300 mb-4">Active Alerts & Logs</h3>
             <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-lg bg-brand-red/10 border border-brand-red/20">
                  <AlertCircle className="w-5 h-5 text-brand-red shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-brand-red">Water Temp {'>'} 24.5°C</p>
                    <p className="text-xs text-brand-red/70 mt-1">10:14 AM - Cooling triggered</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg bg-brand-amber/10 border border-brand-amber/20">
                  <AlertCircle className="w-5 h-5 text-brand-amber shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-brand-amber">Low EC Warning</p>
                    <p className="text-xs text-brand-amber/70 mt-1">09:30 AM - Dosing A queued</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

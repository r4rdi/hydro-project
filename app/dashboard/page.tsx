"use client";
console.log("HMR trigger");

import { useState, useEffect } from "react";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { ActuatorControl } from "@/components/dashboard/ActuatorControl";
import { TelemetryChart, TelemetryDataPoint } from "@/components/dashboard/TelemetryChart";
import { Fan, AlertCircle, Droplets, Beaker } from "lucide-react";
import { getLatestTelemetry } from "@/services/thingsboard";
import { ECSensor } from "@/components/dashboard/sensors/ECSensor";
import { TempSensor } from "@/components/dashboard/sensors/TempSensor";
import { HumiditySensor } from "@/components/dashboard/sensors/HumiditySensor";
import { PHSensor } from "@/components/dashboard/sensors/pHSensor";

import DraggableWidgetGrid, { WidgetItem, WidgetSize } from "@/components/ui/draggable-widget-grid";

type Kind =
  | 'ph_sensor'
  | 'ec_sensor'
  | 'temp_sensor'
  | 'humidity_sensor'
  | 'system_status'
  | 'alerts'
  | 'ph_trend'
  | 'ec_trend'
  | 'actuators';

interface Widget extends WidgetItem {
  kind: Kind;
}

const WIDGETS: Widget[] = [
  { id: 'ph_sensor', kind: 'ph_sensor', size: 'sm', label: 'pH Level' },
  { id: 'ec_sensor', kind: 'ec_sensor', size: 'sm', label: 'EC / TDS' },
  { id: 'temp_sensor', kind: 'temp_sensor', size: 'sm', label: 'Water Temp' },
  { id: 'humidity_sensor', kind: 'humidity_sensor', size: 'sm', label: 'Air Humidity' },
  { id: 'system_status', kind: 'system_status', size: 'wide', label: 'System Status' },
  { id: 'alerts', kind: 'alerts', size: 'wide', label: 'Active Alerts' },
  { id: 'ph_trend', kind: 'ph_trend', size: 'wide', label: 'pH Trend' },
  { id: 'ec_trend', kind: 'ec_trend', size: 'wide', label: 'EC Trend' },
  { id: 'actuators', kind: 'actuators', size: 'wide', label: 'Actuators' },
];

export default function DashboardPage() {
  const [phData, setPhData] = useState<TelemetryDataPoint[]>([]);
  const [ecData, setEcData] = useState<TelemetryDataPoint[]>([]);
  const [waterTempData, setWaterTempData] = useState<TelemetryDataPoint[]>([]);
  
  // Latest scalar values
  const [waterTemp, setWaterTemp] = useState<number>(0);
  const [humidity, setHumidity] = useState<number>(0);
  
  // Actuator states
  const [waterPump, setWaterPump] = useState<boolean>(true);
  const [nutrientPumpA, setNutrientPumpA] = useState<boolean>(false);
  const [exhaustFan, setExhaustFan] = useState<boolean>(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchData = async () => {
      const data = await getLatestTelemetry();
      
      const toTelemetryPoint = (item: any): TelemetryDataPoint => ({
        timestamp: new Date(item.ts).toISOString(),
        value: Number(item.value)
      });

      // Update series data (keep last 30 points for chart)
      if (data["sensors.ph"]) {
        setPhData(prev => {
          const newData = data["sensors.ph"].map(toTelemetryPoint);
          const merged = [...prev, ...newData];
          const unique = merged.filter((v,i,a) => a.findIndex(t => t.timestamp === v.timestamp) === i);
          return unique.slice(-30);
        });
      }
      if (data["sensors.ec"]) {
        setEcData(prev => {
          const newData = data["sensors.ec"].map(toTelemetryPoint);
          const merged = [...prev, ...newData];
          const unique = merged.filter((v,i,a) => a.findIndex(t => t.timestamp === v.timestamp) === i);
          return unique.slice(-30);
        });
      }
      if (data["sensors.water_temp"]) {
        setWaterTempData(prev => {
          const newData = data["sensors.water_temp"].map(toTelemetryPoint);
          const merged = [...prev, ...newData];
          const unique = merged.filter((v,i,a) => a.findIndex(t => t.timestamp === v.timestamp) === i);
          return unique.slice(-30);
        });
      }
      
      // Update latest scalars
      if (data["sensors.water_temp"] && data["sensors.water_temp"].length > 0) {
        setWaterTemp(Number(data["sensors.water_temp"][0].value));
      }
      if (data["sensors.humidity"] && data["sensors.humidity"].length > 0) {
        setHumidity(Number(data["sensors.humidity"][0].value));
      }
      
      // Update actuators
      if (data["actuators.water_pump"] && data["actuators.water_pump"].length > 0) {
        const val = data["actuators.water_pump"][0].value;
        setWaterPump(val === "true" || val === true);
      }
      if (data["actuators.nutrient_pump_a"] && data["actuators.nutrient_pump_a"].length > 0) {
        const val = data["actuators.nutrient_pump_a"][0].value;
        setNutrientPumpA(val === "true" || val === true);
      }
      if (data["actuators.exhaust_fan"] && data["actuators.exhaust_fan"].length > 0) {
        const val = data["actuators.exhaust_fan"][0].value;
        setExhaustFan(val === "true" || val === true);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const renderWidget = (item: Widget, size: WidgetSize) => {
    switch (item.kind) {
      case 'ph_sensor':
        return (
          <PHSensor 
            value={phData[phData.length - 1]?.value || 0} 
          />
        );
      case 'ec_sensor':
        return (
          <ECSensor 
            value={ecData[ecData.length - 1]?.value || 0} 
          />
        );
      case 'temp_sensor':
        return (
          <TempSensor 
            value={waterTemp} 
            data={waterTempData}
          />
        );
      case 'humidity_sensor':
        return (
          <HumiditySensor 
            value={humidity} 
          />
        );
      case 'system_status':
        return (
          <div className="h-full relative overflow-hidden group bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange-start opacity-30 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange-end opacity-20 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold">System Status</h3>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">All Systems Nominal</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10">Yield +12%</span>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl mt-4">
                 <p className="text-sm font-medium text-gray-200">Next scheduled maintenance in 14 days.</p>
                 <button className="mt-3 w-full py-2 bg-gradient-to-r from-brand-orange-start to-brand-orange-end rounded-xl text-sm font-bold text-white shadow-lg">View Schedule</button>
              </div>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="p-6 h-full flex flex-col">
             <h3 className="font-bold text-gray-800 mb-5">Active Alerts & Logs</h3>
             <div className="space-y-3 flex-1 overflow-y-auto">
                <div className="flex gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-700">Water Temp {'>'} 24.5°C</p>
                    <p className="text-xs font-medium text-red-500/80 mt-1">10:14 AM - Cooling triggered</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Low EC Warning</p>
                    <p className="text-xs font-medium text-amber-500/80 mt-1">09:30 AM - Dosing A queued</p>
                  </div>
                </div>
             </div>
          </div>
        );
      case 'ph_trend':
        return (
          <TelemetryChart 
            title="pH Trend (Live)" 
            data={phData} 
            color="green" 
            unit="pH" 
            minDomain={5.5} 
            maxDomain={7.0} 
          />
        );
      case 'ec_trend':
        return (
          <TelemetryChart 
            title="EC Trend (Live)" 
            data={ecData} 
            color="orange" 
            unit="mS/cm" 
            minDomain={1.5} 
            maxDomain={2.2} 
          />
        );
      case 'actuators':
        return (
          <div className="p-6 h-full flex flex-col">
            <h3 className="font-bold text-gray-800 mb-5">Actuator Controls</h3>
            <div className="grid grid-cols-1 gap-4 flex-1 overflow-y-auto">
              <ActuatorControl 
                name="Circulation Pump" 
                initialState={waterPump} 
                mode="auto" 
                icon={Droplets} 
                onToggle={() => {}} 
                onModeChange={() => {}} 
              />
              <ActuatorControl 
                name="Dosing Pump A" 
                initialState={nutrientPumpA} 
                mode="auto" 
                icon={Beaker} 
                onToggle={() => {}} 
                onModeChange={() => {}} 
              />
              <ActuatorControl 
                name="Exhaust Fan" 
                initialState={exhaustFan} 
                mode="manual" 
                icon={Fan} 
                onToggle={() => {}} 
                onModeChange={() => {}} 
              />
            </div>
          </div>
        );
      default:
        return <div>Unknown Widget</div>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Greeting Section */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Good morning,</h2>
        <p className="text-gray-500 font-medium mt-1">Here&apos;s what&apos;s happening in your hydroponic workspace today.</p>
      </div>

      <DraggableWidgetGrid 
        items={WIDGETS} 
        renderItem={(item) => renderWidget(item as Widget, item.size)} 
      />
    </div>
  );
}

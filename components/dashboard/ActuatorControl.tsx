"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Power } from "lucide-react";

interface ActuatorControlProps {
  name: string;
  initialState: boolean;
  mode: "auto" | "manual";
  icon: LucideIcon;
  onToggle: (newState: boolean) => void;
  onModeChange: (newMode: "auto" | "manual") => void;
}

export function ActuatorControl({ name, initialState, mode, icon: Icon, onToggle, onModeChange }: ActuatorControlProps) {
  const [isOn, setIsOn] = useState(initialState);
  const [currentMode, setCurrentMode] = useState(mode);

  const handleToggle = () => {
    if (currentMode === "auto") return;
    const newState = !isOn;
    setIsOn(newState);
    onToggle(newState);
  };

  const toggleMode = () => {
    const newMode = currentMode === "auto" ? "manual" : "auto";
    setCurrentMode(newMode);
    onModeChange(newMode);
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl border transition-all duration-300 shadow-sm", 
          isOn ? "bg-gradient-to-br from-brand-green-primary to-brand-green-dark border-transparent text-white" : "bg-gray-50 border-gray-200 text-gray-400"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Status: <span className={isOn ? "text-brand-green-dark" : "text-gray-400"}>{isOn ? "Active" : "Inactive"}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={toggleMode}
          className={cn("px-4 py-2 rounded-full text-xs font-bold transition-all border shadow-sm",
            currentMode === "auto" 
              ? "bg-blue-50 text-blue-600 border-blue-200" 
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
          )}
        >
          {currentMode === "auto" ? "AUTO" : "MANUAL"}
        </button>

        <button
          onClick={handleToggle}
          disabled={currentMode === "auto"}
          className={cn(
            "p-2 rounded-full border transition-all flex items-center justify-center shadow-sm",
            currentMode === "auto" ? "opacity-40 cursor-not-allowed" : "cursor-pointer active:scale-95",
            isOn && currentMode === "manual" 
              ? "bg-gradient-to-tr from-brand-orange-start to-brand-orange-end text-white border-transparent shadow-[0_4px_12px_rgba(255,107,0,0.3)]" 
              : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50 hover:text-brand-orange-start"
          )}
        >
          <Power className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

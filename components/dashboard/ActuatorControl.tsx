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
    <div className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={cn("p-2.5 rounded-xl border transition-all duration-300", 
          isOn ? "bg-brand-green/10 border-brand-green/20 text-brand-green" : "bg-zinc-800 border-zinc-700 text-zinc-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-zinc-200">{name}</h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Status: <span className={isOn ? "text-brand-green font-medium" : "text-zinc-400"}>{isOn ? "Active" : "Inactive"}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={toggleMode}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
            currentMode === "auto" 
              ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20" 
              : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
          )}
        >
          {currentMode === "auto" ? "AUTO" : "MANUAL"}
        </button>

        <button
          onClick={handleToggle}
          disabled={currentMode === "auto"}
          className={cn(
            "p-2 rounded-lg border transition-all flex items-center justify-center",
            currentMode === "auto" ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95",
            isOn && currentMode === "manual" 
              ? "bg-brand-green text-zinc-950 border-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
              : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
          )}
        >
          <Power className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

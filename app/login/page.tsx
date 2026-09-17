"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Lock, Mail, ArrowRight, Droplets } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4 lg:p-8 relative font-sans text-gray-900">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl p-3 flex flex-col md:flex-row relative z-10 min-h-[600px]">
        
        {/* Left Side: Illustration / Branding Panel */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#F6F6F6] rounded-[1.5rem] p-8 relative overflow-hidden items-center justify-between">
          {/* Logo */}
          <div className="absolute top-8 left-8 flex items-center gap-2">
             <Image src="/logo.png" alt="Hydro Logo" width={24} height={24} className="object-contain" />
             <span className="font-bold text-gray-800 tracking-tight">Hydro</span>
          </div>
          
          {/* Onboarding Copy Area */}
          <div className="flex-1 flex flex-col justify-center w-full mt-12 px-4">
            <div className="space-y-6 max-w-sm">
              <h2 className="text-3xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                Performa Andal di Cloud, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500">Siap Panen Maksimal!</span> 
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Solusi terintegrasi tanpa rasa khawatir. Di-hosting dan di-deploy pada arsitektur cloud berkecepatan tinggi dengan uptime terjamin, <strong className="text-gray-900">Hydro</strong> memastikan data pertanian presisi Anda selalu aktif dan dapat diakses kapan saja.
              </p>
            </div>
          </div>

          {/* Supported By Section */}
          <div className="w-full mt-auto pt-8 flex flex-col items-center gap-5">
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Supported By</span>
            <div className="flex items-center justify-center gap-5 flex-wrap opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <img src="https://cdn.simpleicons.org/arduino/00979D" alt="Arduino IDE" title="Arduino" className="h-6 object-contain hover:scale-110 transition-transform" />
              <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" title="TypeScript" className="h-6 object-contain hover:scale-110 transition-transform" />
              <img src="https://cdn.simpleicons.org/cplusplus/00599C" alt="C++" title="C++" className="h-6 object-contain hover:scale-110 transition-transform" />
              <img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" title="Python" className="h-6 object-contain hover:scale-110 transition-transform" />
              <img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase" title="Supabase" className="h-6 object-contain hover:scale-110 transition-transform" />
              <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" title="Vercel" className="h-5 object-contain hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="flex-1 flex flex-col p-8 md:p-12 relative">
          
          {/* Top Right: Sign Up Link */}
          <div className="absolute top-8 right-8 text-xs font-medium text-gray-500">
            Don't have an account? <span className="text-gray-900 font-bold hover:underline cursor-pointer">Sign up</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full mt-10 md:mt-0">
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">In</span></h1>
            
            <p className="text-xs font-medium text-gray-500 mb-4">Sign In with Open account</p>
            
            {/* OAuth Buttons (Side-by-side) */}
            <div className="flex gap-4 mb-8">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              
              <button
                type="button"
                onClick={() => handleOAuth('apple')}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.365 14.316c-.023-2.628 2.15-3.896 2.25-3.953-1.223-1.786-3.125-2.03-3.818-2.062-1.62-.163-3.16.953-3.985.953-.825 0-2.09-.92-3.415-.895-1.715.025-3.3.99-4.186 2.528-1.8 3.12-.462 7.72 1.295 10.25 1.035 1.5 2.255 3.175 3.86 3.12 1.53-.05 2.115-.978 3.975-.978 1.84 0 2.395.977 3.995.95 1.638-.025 2.69-1.522 3.715-3.02 1.185-1.733 1.675-3.415 1.7-3.504-.038-.016-3.298-1.265-3.346-3.889zM15.175 5.51c.846-1.025 1.417-2.453 1.26-3.873-1.227.05-2.71.815-3.578 1.838-.7.884-1.385 2.338-1.196 3.725 1.365.106 2.668-.66 3.514-1.69z"/>
                </svg>
                Apple ID
              </button>
            </div>

            <p className="text-[11px] font-medium text-gray-500 mb-4">Or continue with email address</p>

            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium">
                  {state.error}
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="operator@hydro.web.id"
                  className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-blue-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-blue-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                />
              </div>

              <div className="pt-2 space-y-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold py-3 px-4 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none text-sm"
                >
                  {isPending ? "Authenticating..." : "Sign In"}
                </button>
                <div className="text-center">
                  <a href="#" className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                    Forgot password?
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative nav with wave animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '450ms' }}></div>
      </div>
    </div>
  );
}

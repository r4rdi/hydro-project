"use client";

import { useState, useActionState } from "react";
import { login } from "./actions";
import { signup } from "../signup/actions";
import { Lock, Mail, User, Server } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

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
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4 lg:p-8 relative font-sans text-gray-900 overflow-hidden">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl relative z-10 min-h-[650px] overflow-hidden">
        
        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden flex flex-col w-full min-h-[650px] p-6 relative">
          
          {/* Mobile Login Form */}
          <div className={`transition-all duration-500 absolute inset-0 p-6 flex flex-col justify-center bg-white ${isSignUp ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="w-full max-w-sm mx-auto">
              <div className="text-right text-xs font-medium text-gray-500 mb-8">
                Don't have an account? <button type="button" onClick={() => setIsSignUp(true)} className="text-gray-900 font-bold hover:underline">Sign up</button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">In</span></h1>
              <form action={loginAction} className="space-y-4">
                {loginState?.error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium">
                    {loginState.error}
                  </div>
                )}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
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
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-blue-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoginPending}
                    className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold py-3 px-4 rounded-full shadow-md transition-all duration-200 disabled:opacity-70 text-sm"
                  >
                    {isLoginPending ? "Authenticating..." : "Sign In"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Signup Form */}
          <div className={`transition-all duration-500 absolute inset-0 p-6 flex flex-col justify-center bg-white ${!isSignUp ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'}`}>
            <div className="w-full max-w-sm mx-auto">
              <div className="text-left text-xs font-medium text-gray-500 mb-8">
                Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-gray-900 font-bold hover:underline">Sign in</button>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Account</span></h1>
              <form action={signupAction} className="space-y-4">
                {signupState?.error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium">
                    {signupState.error}
                  </div>
                )}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="operator@hydro.web.id"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Server className="w-4 h-4" />
                  </div>
                  <input
                    name="deviceId"
                    type="text"
                    required
                    placeholder="Device ID (misal: HYDRO-NODE-001)"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Buat Password"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSignupPending}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 px-4 rounded-full shadow-md transition-all duration-200 disabled:opacity-70 text-sm"
                  >
                    {isSignupPending ? "Mengajukan..." : "Ajukan Pembuatan Akun"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:block absolute inset-3">
          
          {/* Left Form Panel: SIGNUP */}
          <div className="absolute top-0 left-0 w-1/2 h-full p-8 lg:p-12 flex flex-col justify-center">
            <div className="absolute top-4 left-8 text-xs font-medium text-gray-500">
              Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-gray-900 font-bold hover:underline cursor-pointer">Sign in</button>
            </div>
            
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Account</span>
              </h1>
              <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                Daftarkan akun dashboard Anda. Persetujuan admin diperlukan sebelum Anda dapat mengakses kontrol.
              </p>

              <form action={signupAction} className="space-y-4">
                {signupState?.error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium">
                    {signupState.error}
                  </div>
                )}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="operator@hydro.web.id"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Server className="w-4 h-4" />
                  </div>
                  <input
                    name="deviceId"
                    type="text"
                    required
                    placeholder="Device ID (misal: HYDRO-NODE-001)"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Buat Password"
                    className="w-full bg-[#F6F6F6] border-transparent focus:bg-white border focus:border-emerald-600 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all duration-200"
                  />
                </div>
                <div className="pt-2 space-y-4">
                  <button
                    type="submit"
                    disabled={isSignupPending}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 px-4 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none text-sm"
                  >
                    {isSignupPending ? "Mengajukan..." : "Ajukan Pembuatan Akun"}
                  </button>
                  <div className="text-center text-xs text-gray-500 px-4">
                    Dengan mendaftar, Anda menyetujui bahwa akun ini ditautkan dengan hak milik perangkat keras Anda.
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Form Panel: LOGIN */}
          <div className="absolute top-0 right-0 w-1/2 h-full p-8 lg:p-12 flex flex-col justify-center">
            <div className="absolute top-4 right-8 text-xs font-medium text-gray-500">
              Don't have an account? <button type="button" onClick={() => setIsSignUp(true)} className="text-gray-900 font-bold hover:underline cursor-pointer">Sign up</button>
            </div>

            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">In</span></h1>
              <p className="text-xs font-medium text-gray-500 mb-4">Sign In with Open account</p>

              {/* OAuth Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth('apple')}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-full py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.365 14.316c-.023-2.628 2.15-3.896 2.25-3.953-1.223-1.786-3.125-2.03-3.818-2.062-1.62-.163-3.16.953-3.985.953-.825 0-2.09-.92-3.415-.895-1.715.025-3.3.99-4.186 2.528-1.8 3.12-.462 7.72 1.295 10.25 1.035 1.5 2.255 3.175 3.86 3.12 1.53-.05 2.115-.978 3.975-.978 1.84 0 2.395.977 3.995.95 1.638-.025 2.69-1.522 3.715-3.02 1.185-1.733 1.675-3.415 1.7-3.504-.038-.016-3.298-1.265-3.346-3.889zM15.175 5.51c.846-1.025 1.417-2.453 1.26-3.873-1.227.05-2.71.815-3.578 1.838-.7.884-1.385 2.338-1.196 3.725 1.365.106 2.668-.66 3.514-1.69z" />
                  </svg>
                  Apple ID
                </button>
              </div>

              <p className="text-[11px] font-medium text-gray-500 mb-4">Or continue with email address</p>

              <form action={loginAction} className="space-y-4">
                {loginState?.error && (
                  <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium">
                    {loginState.error}
                  </div>
                )}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
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
                    disabled={isLoginPending}
                    className="w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold py-3 px-4 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none text-sm"
                  >
                    {isLoginPending ? "Authenticating..." : "Sign In"}
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

          {/* THE SLIDING OVERLAY PANEL */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full bg-[#F6F6F6] rounded-[1.5rem] z-20 shadow-xl overflow-hidden transition-transform duration-[800ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isSignUp ? 'translate-x-full' : 'translate-x-0'}`}
          >
            {/* Login Overlay (Visible when on Login view, isSignUp = false) */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-between transition-all duration-[600ms] ease-in-out ${isSignUp ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 delay-200'}`}>
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Hydro Logo" width={24} height={24} className="object-contain" />
                <span className="font-bold text-gray-800 tracking-tight">Hydro</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center w-full mt-12 px-4">
                <div className="space-y-6 max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-[1.3] tracking-tight min-h-[140px]">
                    <span className="block">Optimize your</span>
                    <AnimatedTextCycle 
                      words={[
                        "yield",
                        "productivity",
                        "projects",
                        "business",
                        "crop",
                        "pH level",
                        "nutrients",
                        "greenhouse"
                      ]}
                      interval={2500}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 px-1 pb-1" 
                    />
                    <span className="block">with smart IoT precision.</span>
                  </h2>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                    Solusi cloud terintegrasi untuk pemantauan hidroponik yang stabil, cepat, dan selalu terhubung.
                  </p>
                </div>
              </div>

              <div className="w-full mt-auto pt-8 flex flex-col items-center gap-5">
                <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">BUILT BY</span>
                <div className="flex items-center justify-center gap-5 flex-wrap">
                  <a href="https://docs.arduino.cc/software/ide/" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.simpleicons.org/arduino/00979D" alt="Arduino IDE" title="Arduino" className="h-6 object-contain transition-all duration-150 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer" />
                  </a>
                  <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" title="TypeScript" className="h-6 object-contain transition-all duration-150 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer" />
                  </a>
                  <a href="https://isocpp.org/" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.simpleicons.org/cplusplus/00599C" alt="C++" title="C++" className="h-6 object-contain transition-all duration-150 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer" />
                  </a>
                  <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" title="Python" className="h-6 object-contain transition-all duration-150 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer" />
                  </a>
                  <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase" title="Supabase" className="h-6 object-contain transition-all duration-150 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer" />
                  </a>
                  <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" title="Vercel" className="h-5 object-contain transition-all duration-150 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 cursor-pointer" />
                  </a>
                </div>
              </div>
            </div>

            {/* Signup Overlay (Visible when on Signup view, isSignUp = true) */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-between transition-all duration-[600ms] ease-in-out ${!isSignUp ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 delay-200'}`}>
              <div className="flex items-center justify-end gap-2">
                <span className="font-bold text-gray-800 tracking-tight">Hydro</span>
                <Image src="/logo.png" alt="Hydro Logo" width={24} height={24} className="object-contain" />
              </div>
              
              <div className="flex-1 flex flex-col justify-center w-full mt-12 px-4 text-right items-end">
                <div className="space-y-6 max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-[1.3] tracking-tight min-h-[140px]">
                    <span className="block">Start</span>
                    <AnimatedTextCycle 
                      words={[
                        "monitoring",
                        "optimizing",
                        "tracking",
                        "scaling",
                        "securing",
                        "growing"
                      ]}
                      interval={2500}
                      className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-500 to-teal-600 px-1 pb-1"
                    />
                    <span className="block">with complete peace of mind.</span>
                  </h2>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed text-right">
                    Akses eksklusif untuk pemilik perangkat terverifikasi demi menjamin keamanan data operasional Anda.
                  </p>
                </div>
              </div>

              <div className="w-full mt-auto pt-8 flex flex-col items-center gap-4">
                <div className="flex gap-4 opacity-75">
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Lock className="w-5 h-5" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-500">Secure</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Server className="w-5 h-5" />
                     </div>
                     <span className="text-[10px] font-bold text-gray-500">Device Bound</span>
                   </div>
                </div>
              </div>
            </div>
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

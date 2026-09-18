"use client";

import { useActionState } from "react";
import { signup } from "./actions";
import { Lock, Mail, User, Server } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4 lg:p-8 relative font-sans text-gray-900">
      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl p-3 flex flex-col md:flex-row relative z-10 min-h-[600px]">
        
        {/* Left Side: Form Panel */}
        <div className="flex-1 flex flex-col p-8 md:p-12 relative order-2 md:order-1">
          {/* Top Left: Sign In Link (Mobile only, hidden on desktop) */}
          <div className="absolute top-8 left-8 text-xs font-medium text-gray-500 md:hidden">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-900 font-bold hover:underline cursor-pointer">
              Sign in
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full mt-10 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Account</span>
            </h1>
            
            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
              Daftarkan akun dashboard Anda. Persetujuan admin diperlukan sebelum Anda dapat mengakses kontrol.
            </p>

            <form action={formAction} className="space-y-4">
              {state?.error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center font-medium">
                  {state.error}
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
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
                  id="email"
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
                  id="deviceId"
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
                  id="password"
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
                  disabled={isPending}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 px-4 rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none text-sm"
                >
                  {isPending ? "Mengajukan..." : "Ajukan Pembuatan Akun"}
                </button>
                <div className="text-center text-xs text-gray-500 px-4">
                  Dengan mendaftar, Anda menyetujui bahwa akun ini ditautkan dengan hak milik perangkat keras Anda.
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Illustration / Branding Panel */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#F6F6F6] rounded-[1.5rem] p-8 relative overflow-hidden items-center justify-between order-1 md:order-2">
          {/* Logo */}
          <div className="absolute top-8 right-8 flex items-center gap-2">
            <span className="font-bold text-gray-800 tracking-tight">Hydro</span>
            <Image src="/logo.png" alt="Hydro Logo" width={24} height={24} className="object-contain" />
          </div>

          {/* Top Left: Sign In Link (Desktop) */}
          <div className="absolute top-8 left-8 text-xs font-medium text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-900 font-bold hover:underline cursor-pointer">
              Sign in
            </Link>
          </div>

          {/* Onboarding Copy Area */}
          <div className="flex-1 flex flex-col justify-center w-full mt-12 px-4 text-right items-end">
            <div className="space-y-6 max-w-sm">
              <h2 className="text-3xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                Integrasi Aman & <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-500 to-teal-600">Terpercaya.</span>
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed text-right">
                Akses dashboard <strong className="text-gray-900">Hydro</strong> dibatasi hanya untuk pemilik perangkat yang sah. Setiap permintaan akun akan diverifikasi secara manual oleh administrator untuk memastikan keamanan data operasional Anda.
              </p>
            </div>
          </div>

          {/* Trust Badges */}
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

      {/* Bottom decorative nav with wave animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '450ms' }}></div>
      </div>
    </div>
  );
}

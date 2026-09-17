"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Lock, Mail, ArrowRight, Droplets } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex items-center justify-center md:p-4 lg:p-8">
      {/* Container */}
      <div className="w-full max-w-6xl min-h-[100dvh] md:min-h-[600px] md:h-[85vh] flex flex-col md:flex-row md:rounded-3xl overflow-hidden md:shadow-2xl bg-white md:border border-zinc-200">

        {/* Left Side: Branding (Dark with orange/amber glow) */}
        <div className="hidden md:flex flex-col relative w-[45%] bg-[#111111] text-white p-12 items-center justify-center overflow-hidden">
          {/* Subtle warm glow background like reference */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/4" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 group cursor-default">
            <div className="w-24 h-24 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/5 shadow-2xl flex items-center justify-center p-4 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/[0.05] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
              <Image src="/logo.png" alt="Hydro Logo" width={64} height={64} className="object-contain transition-transform duration-500 group-hover:-rotate-3" />
            </div>
            <div className="space-y-4 max-w-xs">
              <h1 className="text-3xl font-bold tracking-tight transition-colors duration-300 group-hover:text-amber-50">One Platform to Streamline All Hydroponic Operations</h1>
              <p className="text-zinc-400 text-sm leading-relaxed transition-colors duration-300 group-hover:text-zinc-300">
                Control your pH, EC, and climate in real-time. Boost your yield effortlessly with automated precision.
              </p>
            </div>

            {/* Carousel dots placeholder */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-white transition-all duration-300 hover:scale-150 cursor-pointer"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-700 transition-all duration-300 hover:bg-zinc-400 cursor-pointer"></span>
              <span className="w-2 h-2 rounded-full bg-zinc-700 transition-all duration-300 hover:bg-zinc-400 cursor-pointer"></span>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 text-xs text-zinc-500 hover:text-zinc-400 transition-colors cursor-default">
            &copy; 2026 Hydro Enterprise
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col p-8 sm:p-12 relative text-zinc-950">
          <div className="flex items-center justify-between mb-auto">
            <div className="md:hidden flex items-center gap-2 group cursor-pointer">
              <Image src="/logo.png" alt="Hydro Logo" width={32} height={32} className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-bold text-lg transition-colors group-hover:text-amber-600">Hydro</span>
            </div>
            <div className="hidden md:block group cursor-pointer">
              {/* Optional top-left brand marker if needed */}
              <Image src="/logo.png" alt="Hydro Logo" width={32} height={32} className="transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="text-sm font-medium text-zinc-500">
              Don't have an account? <span className="text-zinc-950 underline decoration-zinc-300 underline-offset-4 cursor-pointer hover:text-amber-600 hover:decoration-amber-500 transition-colors duration-200">Sign Up</span>
            </div>
          </div>

          <div className="max-w-sm w-full mx-auto my-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Welcome back to Hydro!</h2>
              <p className="text-sm text-zinc-500">Please enter your details to sign in your account</p>
            </div>

            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-2">
                  {state.error}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 text-xs font-medium text-zinc-400 before:flex-1 before:h-px before:bg-zinc-200 after:flex-1 after:h-px after:bg-zinc-200">
                Or sign in with
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 relative group">
                  <label className="text-sm font-medium text-zinc-700 transition-colors group-focus-within:text-amber-600" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="operator@hydro.web.id"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:border-amber-400/50 hover:shadow-sm transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative group">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700 transition-colors group-focus-within:text-amber-600" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="minimum 8 characters"
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 hover:border-amber-400/50 hover:shadow-sm transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:shadow-inner active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isPending ? (
                    "Authenticating..."
                  ) : (
                    <>
                      Sign In 
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <div className="text-center">
                  <a href="#" className="text-sm font-medium text-zinc-600 hover:text-amber-600 transition-colors underline underline-offset-4 decoration-zinc-300 hover:decoration-amber-500">Forgot password?</a>
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end gap-6 text-xs text-zinc-500 mt-auto">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background Silhouette Gradients - Adjusted to match reference */}
      <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-brand-orange-start/15 rounded-full blur-[200px] pointer-events-none -translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[1000px] h-[1000px] bg-blue-600/15 rounded-full blur-[200px] pointer-events-none translate-x-1/3 translate-y-1/4" />

      {/* Container - Glassmorphism Split Layout */}
      <div className="w-full max-w-6xl min-h-[100dvh] md:min-h-[600px] md:h-[85vh] flex flex-col md:flex-row rounded-3xl overflow-hidden glass-panel relative z-10 bg-[#12141D]/60 border-white/5 backdrop-blur-2xl shadow-2xl">

        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col relative w-[45%] text-brand-text-primary p-12 items-center justify-center overflow-hidden border-r border-brand-border/50 bg-[#12141D]/40">
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 group cursor-default">
            <div className="w-24 h-24 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl flex items-center justify-center p-4 transition-all duration-500 group-hover:scale-105 glow-purple">
              <Image src="/logo.png" alt="Hydro Logo" width={64} height={64} className="object-contain transition-transform duration-500 group-hover:-rotate-3" />
            </div>
            <div className="space-y-4 max-w-xs">
              <h1 className="text-3xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-brand-purple-primary">Dark Elegance & Precision</h1>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                Control your pH, EC, and climate in real-time. Boost your yield effortlessly with automated precision.
              </p>
            </div>
          </div>
          <div className="absolute bottom-8 left-8 text-xs text-brand-text-secondary hover:text-white transition-colors cursor-default">
            &copy; 2026 Hydro Enterprise
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col p-8 sm:p-12 relative text-brand-text-primary bg-[#12141D]/60">
          <div className="flex items-center justify-between mb-auto">
            <div className="md:hidden flex items-center gap-2 group cursor-pointer">
              <Image src="/logo.png" alt="Hydro Logo" width={32} height={32} className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-bold text-lg text-white">Hydro</span>
            </div>
            <div className="hidden md:block group cursor-pointer">
              <Image src="/logo.png" alt="Hydro Logo" width={32} height={32} className="transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div className="text-sm font-medium text-brand-text-secondary">
              Don't have an account? <span className="text-brand-purple-primary underline decoration-brand-purple-primary/30 underline-offset-4 cursor-pointer hover:text-brand-orange-start hover:decoration-brand-orange-start transition-colors duration-200">Sign Up</span>
            </div>
          </div>

          <div className="max-w-sm w-full mx-auto my-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back to Hydro</h2>
              <p className="text-sm text-brand-text-secondary">Please enter your details to sign in your account</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="w-full flex items-center justify-center gap-3 bg-[#12141D]/50 border border-brand-border rounded-xl px-4 py-3 text-sm font-medium text-white cursor-pointer hover:bg-brand-border/50 hover:border-brand-border transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              
              <button
                type="button"
                onClick={() => handleOAuth('apple')}
                className="w-full flex items-center justify-center gap-3 bg-[#12141D]/50 border border-brand-border rounded-xl px-4 py-3 text-sm font-medium text-white cursor-pointer hover:bg-brand-border/50 hover:border-brand-border transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.365 14.316c-.023-2.628 2.15-3.896 2.25-3.953-1.223-1.786-3.125-2.03-3.818-2.062-1.62-.163-3.16.953-3.985.953-.825 0-2.09-.92-3.415-.895-1.715.025-3.3.99-4.186 2.528-1.8 3.12-.462 7.72 1.295 10.25 1.035 1.5 2.255 3.175 3.86 3.12 1.53-.05 2.115-.978 3.975-.978 1.84 0 2.395.977 3.995.95 1.638-.025 2.69-1.522 3.715-3.02 1.185-1.733 1.675-3.415 1.7-3.504-.038-.016-3.298-1.265-3.346-3.889zM15.175 5.51c.846-1.025 1.417-2.453 1.26-3.873-1.227.05-2.71.815-3.578 1.838-.7.884-1.385 2.338-1.196 3.725 1.365.106 2.668-.66 3.514-1.69z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-medium text-brand-text-secondary before:flex-1 before:h-px before:bg-brand-border after:flex-1 after:h-px after:bg-brand-border">
              Or sign in with
            </div>

            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-2">
                  {state.error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5 relative group">
                  <label className="text-sm font-medium text-brand-text-secondary transition-colors group-focus-within:text-brand-purple-primary" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="operator@hydro.web.id"
                      className="w-full bg-[#090A0F]/50 border border-brand-border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-purple-primary/30 focus:border-brand-purple-primary hover:border-brand-border/80 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative group">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-brand-text-secondary transition-colors group-focus-within:text-brand-purple-primary" htmlFor="password">
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
                      className="w-full bg-[#090A0F]/50 border border-brand-border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-purple-primary/30 focus:border-brand-purple-primary hover:border-brand-border/80 transition-all duration-200 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <button
                  type="submit"
                  disabled={isPending}
                  className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange-start to-brand-purple-primary hover:from-brand-orange-end hover:to-brand-purple-dark text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:glow-orange hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
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
                <div className="text-center pt-2">
                  <a href="#" className="text-sm font-medium text-brand-text-secondary hover:text-brand-purple-primary transition-colors underline underline-offset-4 decoration-brand-border hover:decoration-brand-purple-primary/50">Forgot password?</a>
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end gap-6 text-xs text-brand-text-secondary mt-auto">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

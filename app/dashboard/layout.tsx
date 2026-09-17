import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Bell, Settings } from "lucide-react";
import Image from "next/image";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.email?.split("@")[0] || "Operator";

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center">
                <Image src="/logo.png" alt="Hydro Logo" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">HYDRO</h1>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-zinc-400">Site-Alpha-BDG</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="flex items-center gap-1 text-brand-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-1">
                <a href="/dashboard" className="px-3 py-1.5 text-sm font-medium text-white bg-zinc-800/50 rounded-md">Dashboard</a>
                <a href="#" className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md">Devices</a>
                <a href="#" className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md">Controls</a>
                <a href="#" className="px-3 py-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-md">Analytics</a>
              </nav>

              <div className="flex items-center gap-3 md:pl-6 md:border-l border-zinc-800">
                <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-red border-2 border-zinc-950" />
                </button>
                <button className="p-2 text-zinc-400 hover:text-white transition-colors hidden sm:block">
                  <Settings className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-green to-brand-blue flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="hidden sm:block text-sm">
                    <p className="font-medium text-white">{userName}</p>
                    <p className="text-xs text-zinc-500">Operator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  );
}

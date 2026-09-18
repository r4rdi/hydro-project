import { Bell, Settings } from "lucide-react";
import Image from "next/image";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const supabase = await createClient();
  // const { data: { user } } = await supabase.auth.getUser();

  // if (!user) {
  //   redirect("/login");
  // }

  // const userName = user.email?.split("@")[0] || "Operator";
  const userName = "Developer";

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <header className="bg-brand-surface rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] px-4 py-3 flex items-center justify-between z-50 relative">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-orange-start to-brand-orange-end rounded-xl flex items-center justify-center shadow-md">
              <Image src="/logo.png" alt="Hydro Logo" width={24} height={24} className="object-contain brightness-0 invert" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 tracking-tight">Hydro Dashboard</h1>
              <div className="flex items-center gap-1.5 text-[10px] font-medium">
                <span className="text-gray-500">Site-Alpha-BDG</span>
                <span className="w-1 h-1 rounded-full bg-brand-green-primary animate-pulse" />
              </div>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center bg-gray-50/80 rounded-full p-1 border border-gray-100 shadow-inner">
            <a href="/dashboard" className="px-5 py-2 text-sm font-semibold text-gray-900 bg-white rounded-full shadow-sm">Overview</a>
            <a href="#" className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-full">Devices</a>
            <a href="#" className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-full">Controls</a>
            <a href="#" className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-full">Analytics</a>
            <a href="#" className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-full">Settings</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 bg-brand-orange-start hover:bg-brand-orange-end text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition-colors">
              <span className="text-lg leading-none">+</span> New
            </button>
            <div className="flex items-center gap-1 ml-2">
              <button className="p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-50">
                <Settings className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange-end border-2 border-white" />
              </button>
              <button className="w-9 h-9 ml-2 rounded-full bg-gradient-to-tr from-brand-green-primary to-brand-green-dark flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">{userName.charAt(0).toUpperCase()}</span>
              </button>
            </div>
          </div>

        </header>
      </div>

      <main suppressHydrationWarning className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        {children}
      </main>
    </div>
  );
}

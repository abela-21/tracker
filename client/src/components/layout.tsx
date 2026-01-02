import { Link, useLocation } from "wouter";
import { CheckSquare, Calendar, BarChart2, Settings, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: CheckSquare, label: "Today" },
    { href: "/week", icon: Calendar, label: "Week" },
    { href: "/month", icon: BarChart2, label: "Month" },
    { href: "/habits", icon: List, label: "Habits" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col">
      <main className="flex-1 pb-24 md:pb-8 max-w-md mx-auto w-full p-4 md:p-8">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-md pb-safe z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer transition-colors px-4", 
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Plus, Compass, User } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/upload", icon: Plus, label: "Upload", special: true },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-zinc-800 pb-safe">
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label, special }) => {
          const isActive = pathname.startsWith(href);

          if (special) {
            return (
              <Link key={href} href={href} className="flex flex-col items-center -mt-5">
                <div className="w-14 h-14 rounded-full btn-purple flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Icon size={24} className="text-white" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
              <Icon size={22} className={isActive ? "text-purple-400" : "text-zinc-500"} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${isActive ? "text-purple-400" : "text-zinc-500"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  AlertOctagon,
  Activity,
  Heart,
  Shield,
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLink[] = [
  { label: "Beranda", href: "/", icon: Shield },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Asisten AI", href: "/chat", icon: MessageSquare },
  { label: "Darurat & SOS", href: "/sos", icon: AlertOctagon },
  { label: "Sistem", href: "/sistem", icon: Activity },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = React.memo(function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-[var(--navbar-height)] left-0 z-40
          h-[calc(100vh-var(--navbar-height))]
          flex flex-col border-r border-slate-200 dark:border-[var(--border-muted)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 bg-white dark:bg-[var(--bg-elevated)] w-56
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            const isEmergency = link.href === "/sos";

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2 rounded-lg
                  text-xs font-semibold transition-all duration-150
                  ${active
                    ? isEmergency
                      ? "bg-red-500/10 text-red-600 dark:text-red-300 border-l-2 border-red-500 pl-2.5"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-300 border-l-2 border-teal-500 pl-2.5"
                    : "text-slate-500 dark:text-white/45 hover:text-slate-900 hover:dark:text-white hover:bg-slate-100 hover:dark:bg-[var(--bg-subtle)] border-l-2 border-transparent"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors duration-150 ${active
                    ? isEmergency ? "text-red-500 dark:text-red-400" : "text-teal-600 dark:text-teal-400"
                    : "text-slate-400 dark:text-white/30 group-hover:text-slate-600 group-hover:dark:text-white/55"
                    }`}
                />
                <span className="leading-none">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-slate-200 dark:border-[var(--border-muted)] bg-slate-50/50 dark:bg-[var(--bg-subtle)] flex items-center gap-1.5 flex-shrink-0">
          <Heart className="w-3 h-3 text-red-500/50 dark:text-white/15" />
          <span className="text-[10px] font-medium text-slate-400 dark:text-white/20 tracking-tight">
            Pijak × IBM SkillsBuild
          </span>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
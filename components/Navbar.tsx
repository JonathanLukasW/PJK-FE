"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, LayoutDashboard, Activity, MessageSquare, AlertOctagon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocationSelector } from "@/components/LocationSelector";

interface NavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const NAV_LINKS = [
  { href: "/", label: "Beranda", icon: Shield },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Asisten AI", icon: MessageSquare },
  { href: "/sos", label: "Darurat", icon: AlertOctagon },
  { href: "/sistem", label: "Sistem", icon: Activity },
];

export default function Navbar({ isSidebarOpen, onToggleSidebar }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-colors backdrop-blur-md"
      style={{
        height: "var(--navbar-height)",
        background: "rgba(255, 255, 255, 0.7)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="SiagaAI — Beranda"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-[var(--fg)] tracking-tight">
                Siaga<span className="text-teal-500">AI</span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "text-[var(--fg)] bg-[var(--bg-subtle)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]/50"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <LocationSelector />
          <ThemeToggle />

          <button
            id="sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label={isSidebarOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

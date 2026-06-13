"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Shield,
  LayoutDashboard,
  Activity,
  MessageSquare,
  AlertOctagon,
  LogIn,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocationSelector } from "@/components/LocationSelector";
import { useAppStore } from "@/stores/app-store";

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

function UserMenu() {
  const authUser = useAppStore((s) => s.authUser);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!authUser) {
    return (
      <button
        id="btn-login-google"
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          bg-teal-600 hover:bg-teal-500 active:scale-95
          text-white transition-all duration-150 shadow-sm"
      >
        <LogIn className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Login</span>
      </button>
    );
  }

  const initials = authUser.name
    ? authUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  return (
    <div ref={menuRef} className="relative">
      <button
        id="btn-user-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg
          hover:bg-[var(--bg-subtle)] transition-colors group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {authUser.image ? (
          <Image
            src={authUser.image}
            alt={authUser.name ?? "User avatar"}
            width={30}
            height={30}
            className="rounded-full ring-2 ring-teal-500/40 object-cover"
          />
        ) : (
          <span className="w-[30px] h-[30px] rounded-full bg-teal-600 flex items-center justify-center
            text-white text-xs font-bold ring-2 ring-teal-500/40">
            {initials}
          </span>
        )}
        <span className="hidden md:block text-sm font-medium text-[var(--fg)] max-w-[120px] truncate">
          {authUser.name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--fg-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl border border-[var(--border-muted)]
            bg-[var(--bg-card)] z-50 overflow-hidden
            animate-[fadeSlideDown_0.15s_ease-out]"
        >
          <div className="px-4 py-3 border-b border-[var(--border-muted)]">
            <div className="flex items-center gap-3">
              {authUser.image ? (
                <Image
                  src={authUser.image}
                  alt={authUser.name ?? "avatar"}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-teal-500/30 object-cover"
                />
              ) : (
                <span className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center
                  text-white text-sm font-bold ring-2 ring-teal-500/30">
                  {initials}
                </span>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--fg)] truncate">
                  {authUser.name}
                </p>
                <p className="text-xs text-[var(--fg-muted)] truncate">
                  {authUser.email}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
                bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                Demo Auth — Google
              </span>
            </div>
          </div>

          <div className="px-2 py-1.5">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--fg-muted)]">
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">{authUser.email}</span>
            </div>
          </div>

          <div className="border-t border-[var(--border-muted)] px-2 py-1.5">
            <button
              id="btn-logout"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                text-red-500 hover:bg-red-500/10 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <LocationSelector />
          <ThemeToggle />
          <UserMenu />

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

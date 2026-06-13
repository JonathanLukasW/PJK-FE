"use client";

import React, { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";
import { FloatingSOS } from "@/components/FloatingSOS";
import { GlobalHealthCheck } from "@/components/GlobalHealthCheck";
import { useAppStore } from "@/stores/app-store";
import { AuthSync } from "@/components/AuthSync";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCity = localStorage.getItem("siagaai:last_city");
      if (savedCity) {
        useAppStore.setState({ selectedCity: savedCity });
      }
      const savedLocationMode = localStorage.getItem("siagaai:location_mode");
      if (savedLocationMode === "auto" || savedLocationMode === "manual") {
        useAppStore.setState({ locationMode: savedLocationMode });
      }
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = () => closeSidebar();
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [closeSidebar]);

  return (
    <ToastProvider>
      <AuthSync />
      <GlobalHealthCheck />
      <Navbar isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

      <div className="lg:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </div>

      <main
        className="w-full transition-all duration-300 ease-in-out"
        style={{
          marginTop: "var(--navbar-height)",
          minHeight: "calc(100vh - var(--navbar-height))",
        }}
      >
        {children}
      </main>

      <FloatingSOS />
    </ToastProvider>
  );
}
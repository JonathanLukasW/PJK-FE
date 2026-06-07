"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, ChevronDown, Check, Navigation } from "lucide-react";
import { useAppStore } from "@/stores/app-store";

import { AVAILABLE_CITIES } from "@/lib/constants";

export function LocationSelector() {
  const { locationMode, setLocationMode, selectedCity, setCity } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredCities = AVAILABLE_CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCity = (city: string) => {
    setLocationMode("manual");
    setCity(city);
    useAppStore.getState().refreshData();
    setIsOpen(false);
  };

  const handleSelectAuto = () => {
    setLocationMode("auto");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={modalRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] hover:bg-[var(--border-muted)] transition-colors text-sm font-medium"
      >
        <MapPin className="w-3.5 h-3.5 text-teal-500" />
        <span className="hidden sm:inline max-w-[120px] truncate text-[var(--fg)]">
          {locationMode === "auto" ? "Lokasi Saat Ini" : selectedCity}
        </span>
        <span className="hidden sm:inline text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg-muted)]">
          {locationMode === "auto" ? "AUTO" : "MANUAL"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[var(--fg-muted)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[280px] sm:w-[320px] bg-[var(--bg-elevated)] border border-[var(--border-muted)] rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">

          <div className="p-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold text-[var(--fg)] mb-2">Pilih Lokasi Pemantauan</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-subtle)]" />
              <input
                type="text"
                placeholder="Cari kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg outline-none focus:border-teal-500 transition-colors text-[var(--fg)] placeholder-[var(--fg-muted)]"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto p-2 space-y-1">
            <button
              onClick={handleSelectAuto}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${locationMode === "auto"
                  ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold"
                  : "text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                }`}
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                <div>
                  <p>Gunakan Lokasi Saat Ini</p>
                  <p className="text-[10px] text-[var(--fg-muted)] font-normal">Deteksi otomatis (GPS)</p>
                </div>
              </div>
              {locationMode === "auto" && <Check className="w-4 h-4" />}
            </button>

            <div className="my-2 border-t border-[var(--border)]" />

            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = locationMode === "manual" && selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => handleSelectCity(city)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${isSelected
                        ? "bg-[var(--bg-subtle)] text-[var(--fg)] font-semibold"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-teal-500" : "opacity-0"}`} />
                      {city}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-teal-500" />}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-[var(--fg-muted)]">
                Kota tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

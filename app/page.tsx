"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

export default function LandingPage() {


  return (
    <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
      <main className="flex-1 flex flex-col justify-center py-12">

        <section className="px-5 lg:px-12 w-full">
          <div className="max-w-3xl mx-auto animate-fade-in text-left">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-600 dark:text-teal-300 mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse inline-block" />
              Sistem Pemantauan Aktif — Indonesia
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-[var(--fg)] leading-tight tracking-tight mb-4">
              Peringatan Dini Banjir{" "}
              <span className="text-teal-600 dark:text-teal-400">Berbasis AI</span>{" "}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-8">
              SiagaAI memantau risiko banjir secara real-time menggunakan model
              prediktif Machine Learning, data cuaca BMKG, dan panduan mitigasi
              resmi BNPB untuk membantu masyarakat
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-colors shadow-md shadow-teal-600/20 dark:shadow-none" href="/dashboard">
                Buka Dashboard Risiko
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-muted)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] text-sm font-semibold transition-colors" href="/chat">
                <MessageSquare className="w-4 h-4" />
                Tanya Asisten Mitigasi
              </Link>
            </div>

          </div>
        </section>



      </main>
    </div>
  );
}
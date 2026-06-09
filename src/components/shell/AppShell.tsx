"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ClipboardList,
  BookOpen,
  Users,
  CheckSquare,
  Settings,
  MoreHorizontal,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAcertosManagerOptional } from "@/context/AcertosManagerContext";
import { BadgeStatus } from "@/components/acertos/BadgeStatus";

type NavItem = { href: string; icon: React.ComponentType<{ className?: string }>; label: string };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Acerto",
    items: [
      { href: "/acertos",   icon: LayoutGrid,    label: "Painel" },
      { href: "/",          icon: ClipboardList, label: "Acerto" },
      { href: "/lancamentos",         icon: BookOpen, label: "Lançamentos" },
      { href: "/lancamentos-lideres", icon: Users,    label: "Líderes" },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/encerramento",  icon: CheckSquare, label: "Encerramento" },
      { href: "/configuracoes", icon: Settings,    label: "Configurações" },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
const PRIMARY_MOBILE = ALL_ITEMS.slice(0, 4);
const OVERFLOW_MOBILE = ALL_ITEMS.slice(4);

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const manager = useAcertosManagerOptional();
  const activeAcerto = manager?.activeAcerto ?? null;
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  const isMoreActive = OVERFLOW_MOBILE.some((i) => isActive(i.href));

  return (
    <div className="flex h-dvh bg-[#0F1117] text-white font-sans overflow-hidden">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[#2A2F45] bg-[#161B2E]">
        {/* Brand */}
        <div className="pt-5 pb-4 px-4 flex flex-col items-center gap-2 border-b border-[#2A2F45]">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-black/30 overflow-hidden">
            <Image src="/logo.png" alt="SELS UCOB" width={40} height={40} className="object-contain" priority />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#8B8FA8]">SELS UCOB</p>
        </div>

        {/* Nav groups */}
        <nav className="px-3 mt-4 pb-4 flex-1 flex flex-col">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className={cn(gi > 0 && "mt-4")}>
              <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B8FA8]">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                      active
                        ? "bg-[#6C63FF] text-white font-medium"
                        : "text-[#8B8FA8] hover:bg-[#2A2F45]/50 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4 shrink-0", active ? "text-white" : "text-[#8B8FA8]/60")} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Active acerto indicator — bottom of sidebar */}
          {activeAcerto && (
            <div className="mt-auto pt-3 border-t border-[#2A2F45]">
              <div className="p-3 rounded-xl bg-[#1E2235] border border-[#2A2F45]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8B8FA8] mb-1">Acerto ativo</p>
                <p className="text-sm font-medium text-white truncate" title={activeAcerto.nome}>
                  {activeAcerto.nome}
                </p>
                <div className="mt-1.5">
                  <BadgeStatus status={activeAcerto.status} />
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0F1117]">
        {/* Header */}
        <header className="h-14 shrink-0 flex items-center px-4 md:px-6 border-b border-[#2A2F45] bg-[#161B2E]/80 backdrop-blur-md">
          <span className="font-semibold text-white uppercase tracking-wider text-sm">
            {ALL_ITEMS.find((i) => isActive(i.href))?.label ?? "Acerto de Colportagem"}
          </span>
        </header>

        {/* Read-only banner */}
        {activeAcerto?.status === "Encerrado" && path !== "/acertos" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-sm">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              Este acerto está <strong>encerrado</strong> — somente leitura e exportação.
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto overscroll-y-contain p-4 md:p-6 lg:p-8">
          <div className="mx-auto min-h-full max-w-7xl w-full">
            {children}
          </div>
        </div>

        {/* Bottom nav — mobile only */}
        <nav
          className="shrink-0 relative flex md:hidden border-t border-[#2A2F45] bg-[#161B2E]/95 backdrop-blur-md z-30"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {moreOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
              <div className="absolute bottom-full left-0 right-0 z-50 bg-[#161B2E] border-t border-[#2A2F45] shadow-2xl shadow-black/60 p-3 space-y-1 animate-fade-in">
                {OVERFLOW_MOBILE.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                        active
                          ? "bg-[#6C63FF] text-white font-medium"
                          : "text-[#8B8FA8] hover:bg-[#2A2F45]/50 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-[#8B8FA8]/60")} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {PRIMARY_MOBILE.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3.5 transition-colors active:bg-[#2A2F45]/60",
                  active ? "text-white" : "text-[#8B8FA8]"
                )}
              >
                <item.icon className={cn("w-5 h-5", active ? "text-[#6C63FF]" : "text-[#8B8FA8]/60")} />
                <span className={cn("text-[10px] font-semibold tracking-wide", active ? "text-white" : "text-[#8B8FA8]")}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3.5 transition-colors active:bg-[#2A2F45]/60",
              moreOpen || isMoreActive ? "text-white" : "text-[#8B8FA8]"
            )}
          >
            <MoreHorizontal className={cn("w-5 h-5", moreOpen || isMoreActive ? "text-[#6C63FF]" : "text-[#8B8FA8]/60")} />
            <span className={cn("text-[10px] font-semibold tracking-wide", moreOpen || isMoreActive ? "text-white" : "text-[#8B8FA8]")}>
              Mais
            </span>
          </button>
        </nav>
      </main>
    </div>
  );
}

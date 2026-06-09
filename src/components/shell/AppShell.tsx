"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAcertosManagerOptional } from "@/context/AcertosManagerContext";
import { BadgeStatus } from "@/components/acertos/BadgeStatus";
import styles from "./AppShell.module.css";

const NAV = [
  { href: "/acertos",               icone: "🗂",  label: "Painel" },
  { href: "/",                      icone: "📋", label: "Acerto" },
  { href: "/lancamentos",           icone: "📝", label: "Lançamentos" },
  { href: "/lancamentos-lideres",   icone: "👥", label: "Líderes" },
  { href: "/encerramento",          icone: "✅", label: "Encerramento" },
  { href: "/configuracoes",         icone: "⚙",  label: "Configurações" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const manager = useAcertosManagerOptional();
  const activeAcerto = manager?.activeAcerto ?? null;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcone}>📚</span>
          <div>
            <span className={styles.brandNome}>Acerto</span>
            <span className={styles.brandSub}>Colportagem · SELS UCOB</span>
          </div>
        </div>

        {/* Indicador do acerto ativo */}
        {activeAcerto && (
          <div className={styles.acertoAtivo}>
            <span className={styles.acertoAtivoLabel}>Acerto ativo</span>
            <span className={styles.acertoAtivoNome} title={activeAcerto.nome}>
              {activeAcerto.nome}
            </span>
            <BadgeStatus status={activeAcerto.status} />
          </div>
        )}

        <nav className={styles.nav} aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${path === item.href ? styles.navAtivo : ""}`}
            >
              <span className={styles.navIcone}>{item.icone}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className={styles.conteudo}>
        {/* Banner somente leitura para acertos encerrados */}
        {activeAcerto?.status === "Encerrado" && path !== "/acertos" && (
          <div className={styles.bannerReadOnly}>
            <span>🔒</span>
            <span>
              Este acerto está <strong>encerrado</strong> — somente leitura e
              exportação.
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

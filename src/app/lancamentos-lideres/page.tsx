"use client";

import React from "react";
import { CabecalhoLider } from "@/components/lancamentos-lideres/CabecalhoLider";
import { TabelaLider } from "@/components/lancamentos-lideres/TabelaLider";
import { PainelConfig } from "@/components/lancamentos-lideres/PainelConfig";
import styles from "./page.module.css";

export default function LancamentosLideresPage() {
  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <div className={styles.paginaTitulo}>
          <h1 className={styles.titulo}>Lançamentos — Líderes</h1>
          <div className={styles.etapa}>
            <span className={styles.etapaAtual}>3</span>
            <span className={styles.etapaSep}>/</span>
            <span className={styles.etapaTotal}>3</span>
          </div>
        </div>
        <CabecalhoLider />
        <div className={styles.corpo}>
          <TabelaLider />
          <PainelConfig />
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import { CabecalhoCampanha } from "@/components/lancamentos/CabecalhoCampanha";
import { TabelaLancamentos } from "@/components/lancamentos/TabelaLancamentos";
import styles from "./page.module.css";

export default function LancamentosPage() {
  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <div className={styles.paginaTitulo}>
          <h1 className={styles.titulo}>Lançamentos</h1>
          <div className={styles.etapa}>
            <span className={styles.etapaAtual}>2</span>
            <span className={styles.etapaSep}>/</span>
            <span className={styles.etapaTotal}>3</span>
          </div>
        </div>
        <CabecalhoCampanha />
        <TabelaLancamentos />
      </main>
    </div>
  );
}

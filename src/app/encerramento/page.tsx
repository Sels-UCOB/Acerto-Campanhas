"use client";

import React from "react";
import { ResumoCampanha } from "@/components/encerramento/ResumoCampanha";
import { ResumoLideresTabela } from "@/components/encerramento/ResumoLideresTabela";
import { DiferencaCaixa } from "@/components/encerramento/DiferencaCaixa";
import styles from "./page.module.css";

export default function EncerramentoPage() {
  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <div className={styles.paginaTitulo}>
          <h1 className={styles.titulo}>Encerramento</h1>
          <span className={styles.badge}>Resumo final</span>
        </div>

        <div className={styles.secoes}>
          <ResumoCampanha />
          <ResumoLideresTabela />
          <DiferencaCaixa />
        </div>
      </main>
    </div>
  );
}

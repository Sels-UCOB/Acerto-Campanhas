"use client";

import React from "react";
import { ResumoCampanha } from "@/components/encerramento/ResumoCampanha";
import { ResumoLideresTabela } from "@/components/encerramento/ResumoLideresTabela";
import { DiferencaCaixa } from "@/components/encerramento/DiferencaCaixa";
import { BotaoGerarCSV } from "@/components/encerramento/BotaoGerarCSV";
import { BotoesExportarPDF } from "@/components/encerramento/BotoesExportarPDF";
import { BotaoEncerrar } from "@/components/encerramento/BotaoEncerrar";
import styles from "./page.module.css";

export default function EncerramentoPage() {
  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <div className={styles.paginaTitulo}>
          <h1 className={styles.titulo}>Encerramento</h1>
          <span className={styles.badge}>Resumo final</span>
          <BotaoGerarCSV />
          <BotoesExportarPDF />
        </div>

        <div className={styles.secoes}>
          <ResumoCampanha />
          <ResumoLideresTabela />
          <DiferencaCaixa />
          <div className={styles.acaoEncerrar}>
            <BotaoEncerrar />
          </div>
        </div>
      </main>
    </div>
  );
}

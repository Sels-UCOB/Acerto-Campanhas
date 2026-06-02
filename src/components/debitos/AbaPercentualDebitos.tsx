"use client";

import React from "react";
import { useAcerto } from "@/context/AcertoContext";
import styles from "./AbaPercentualDebitos.module.css";

export function AbaPercentualDebitos() {
  const { state } = useAcerto();
  const numLideres = state.config.numLideres ?? 1;
  const lideres = Array.from({ length: numLideres }, (_, i) => state.config.lideres[i]).filter(
    (l) => l.nome.trim()
  );

  if (lideres.length === 0) {
    return <p className={styles.vazio}>Nenhum líder configurado.</p>;
  }

  const soma = lideres.reduce((s, l) => s + (l.percentualDebito ?? 0), 0);
  const somaErro = Math.abs(soma - 100) > 0.01;

  return (
    <div className={styles.container}>
      <p className={styles.descricao}>Configure o % de débitos na aba Acerto.</p>
      <div className={styles.somaLinha}>
        <span>Soma atual</span>
        <span className={somaErro ? styles.somaErro : styles.somaOk}>{soma.toFixed(2)}%</span>
      </div>
    </div>
  );
}

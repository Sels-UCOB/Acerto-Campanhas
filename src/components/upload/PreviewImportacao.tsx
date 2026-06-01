"use client";

import React, { useState } from "react";
import type { DadosImportados } from "@/types/acerto";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import { EXIBICAO } from "@/config/app";
import styles from "./PreviewImportacao.module.css";

interface PreviewImportacaoProps {
  dados: DadosImportados;
  onLimpar: () => void;
}

export function PreviewImportacao({ dados, onLimpar }: PreviewImportacaoProps) {
  const [expandido, setExpandido] = useState(false);
  const visiveis = expandido ? dados.nomes : dados.nomes.slice(0, EXIBICAO.previewMaxLinhas);

  return (
    <div className={styles.card}>
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoTexto}>
          <span className={styles.badge}>✓ Importado</span>
          <span className={styles.contagem}>{dados.nomes.length} colportores</span>
        </div>
        <button className={styles.btnLimpar} onClick={onLimpar} type="button">
          Trocar arquivo
        </button>
      </div>

      <div className={styles.totais}>
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Compra Total</span>
          <span className={styles.totalValor}>{formatarBRL(dados.compraTotal)}</span>
        </div>
        <div className={styles.separador} />
        <div className={styles.totalItem}>
          <span className={styles.totalLabel}>Bonificado</span>
          <span className={styles.totalValor}>{formatarBRL(dados.bonificado)}</span>
        </div>
      </div>

      <div className={styles.tabela}>
        <div className={styles.tabelaCabecalho}>
          <span>Nome</span>
          <span>Saldo</span>
        </div>
        {visiveis.map((nome, i) => (
          <div
            key={i}
            className={`${styles.tabelaLinha} ${dados.saldos[i] < 0 ? styles.saldoNegativo : dados.saldos[i] > 0 ? styles.saldoPositivo : ""}`}
          >
            <span className={styles.nomeColportor}>{nome}</span>
            <span className={styles.saldo}>{formatarBRL(dados.saldos[i])}</span>
          </div>
        ))}
      </div>

      {dados.nomes.length > 5 && (
        <button
          className={styles.btnExpandir}
          onClick={() => setExpandido((v) => !v)}
          type="button"
        >
          {expandido
            ? "Mostrar menos ▲"
            : `Ver todos os ${dados.nomes.length} colportores ▼`}
        </button>
      )}
    </div>
  );
}

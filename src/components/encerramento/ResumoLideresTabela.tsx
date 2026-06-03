"use client";

import React, { useMemo } from "react";
import { useAcerto } from "@/context/AcertoContext";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { useDebitos } from "@/context/DebitosContext";
import { calcularResumoLider, calcularTotalDevedores } from "@/lib/calcularDebitos";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import styles from "./ResumoLideresTabela.module.css";

export function ResumoLideresTabela() {
  const { state } = useAcerto();
  const { cartaBolsa } = useLancamentoLider();
  const { devedores, gastosLideres } = useDebitos();

  const compraBonificada = state.dadosImportados?.bonificado ?? 0;
  const numLideres = state.config.numLideres ?? 1;

  const resumos = useMemo(() => {
    const totalDevedores = calcularTotalDevedores(devedores);
    return Array.from({ length: numLideres }, (_, i) => state.config.lideres[i])
      .filter((l) => l.nome.trim())
      .map((lider, idx) =>
        calcularResumoLider({
          lider,
          percentualDebito: lider.percentualDebito ?? 0,
          totalDevedores,
          gastosLider: gastosLideres[idx],
          compraBonificada,
          cartaBolsaValor: cartaBolsa.valor,
          cartaBolsaReceptor: cartaBolsa.liderReceptor,
        })
      );
  }, [state.config, devedores, gastosLideres, compraBonificada, cartaBolsa, numLideres]);

  if (resumos.length === 0) {
    return (
      <section className={styles.card}>
        <h2 className={styles.titulo}>Resumo dos Líderes</h2>
        <p className={styles.vazio}>Nenhum líder configurado.</p>
      </section>
    );
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Resumo dos Líderes</h2>
      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th className={styles.thNome}>Líder</th>
              <th className={styles.thNum}>Bruto</th>
              <th className={styles.thNum}>Débitos</th>
              <th className={styles.thNum}>Dízimo</th>
              <th className={styles.thNum}>INSS</th>
              <th className={styles.thNum}>IRPF</th>
              <th className={styles.thNum}>Carta</th>
              <th className={styles.thNum}>Saldo final</th>
            </tr>
          </thead>
          <tbody>
            {resumos.map((r) => (
              <tr key={r.nome} className={styles.linha}>
                <td className={styles.tdNome}>{r.nome}</td>
                <td className={styles.tdNum}>{formatarBRL(r.totalBruto)}</td>
                <td className={`${styles.tdNum} ${styles.negativo}`}>
                  {r.totalDebitos > 0 ? `−${formatarBRL(r.totalDebitos)}` : "—"}
                </td>
                <td className={`${styles.tdNum} ${styles.negativo}`}>
                  −{formatarBRL(r.dizimo)}
                </td>
                <td className={`${styles.tdNum} ${styles.negativo}`}>
                  −{formatarBRL(r.inss)}
                </td>
                <td className={`${styles.tdNum} ${styles.negativo}`}>
                  {r.irpf > 0 ? `−${formatarBRL(r.irpf)}` : "—"}
                </td>
                <td className={`${styles.tdNum} ${r.carta > 0 ? styles.negativo : ""}`}>
                  {r.carta > 0 ? `−${formatarBRL(r.carta)}` : "—"}
                </td>
                <td
                  className={`${styles.tdNum} ${styles.saldo} ${
                    r.saldoFinal < 0 ? styles.negativo : styles.positivo
                  }`}
                >
                  {formatarBRL(r.saldoFinal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

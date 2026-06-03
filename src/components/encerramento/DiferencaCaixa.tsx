"use client";

import React, { useMemo } from "react";
import { useAcerto } from "@/context/AcertoContext";
import { useLancamento } from "@/context/LancamentoContext";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { useDebitos } from "@/context/DebitosContext";
import { calcularSaldos } from "@/lib/calcularSaldos";
import { calcularResumoLider, calcularTotalDevedores } from "@/lib/calcularDebitos";
import { FPC_PERCENTUAL } from "@/config/impostos";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import styles from "./DiferencaCaixa.module.css";

function arred(n: number) {
  return Math.round(n * 100) / 100;
}

export function DiferencaCaixa() {
  const { state } = useAcerto();
  const { lancamentos } = useLancamento();
  const { cartaBolsa, jurosCampanha } = useLancamentoLider();
  const { devedores, gastosLideres, gastosCaixa } = useDebitos();

  const compraBonificada = state.dadosImportados?.bonificado ?? 0;
  const numLideres = state.config.numLideres ?? 1;

  const calculo = useMemo(() => {
    const saldos = calcularSaldos(lancamentos);
    const saldoInicial = saldos.length > 0 ? saldos[saldos.length - 1] : 0;

    const fpc = arred(compraBonificada * FPC_PERCENTUAL);
    const juros = jurosCampanha ?? 0;
    const base = arred(saldoInicial - fpc + juros);

    const totalDevedores = calcularTotalDevedores(devedores);
    const lideres = Array.from({ length: numLideres }, (_, i) => state.config.lideres[i]).filter(
      (l) => l.nome.trim()
    );

    const totalDebitosLideres = arred(
      lideres.reduce((s, lider, idx) => {
        const r = calcularResumoLider({
          lider,
          percentualDebito: lider.percentualDebito ?? 0,
          totalDevedores,
          gastosLider: gastosLideres[idx],
          compraBonificada,
          cartaBolsaValor: cartaBolsa.valor,
          cartaBolsaReceptor: cartaBolsa.liderReceptor,
        });
        return s + r.totalDebitos;
      }, 0)
    );

    const totalDebitosCaixa = arred(
      gastosCaixa.gastos +
        gastosCaixa.debitosAdicionais.reduce((s, d) => s + d.valor, 0)
    );

    const diferenca = arred(base - totalDebitosLideres - totalDebitosCaixa);

    return {
      saldoInicial,
      fpc,
      juros,
      base,
      totalDebitosLideres,
      totalDebitosCaixa,
      diferenca,
      temJuros: jurosCampanha !== null,
    };
  }, [
    lancamentos,
    compraBonificada,
    jurosCampanha,
    devedores,
    gastosLideres,
    gastosCaixa,
    cartaBolsa,
    state.config,
    numLideres,
  ]);

  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Diferença de Caixa</h2>

      <div className={styles.bloco}>
        <div className={styles.linha}>
          <span className={styles.desc}>Saldo final (Lançamentos)</span>
          <span className={styles.valor}>{formatarBRL(calculo.saldoInicial)}</span>
        </div>
        <div className={styles.linha}>
          <span className={styles.desc}>2% Bonificação (FPC)</span>
          <span className={`${styles.valor} ${styles.negativo}`}>
            −{formatarBRL(calculo.fpc)}
          </span>
        </div>
        {calculo.temJuros && (
          <div className={styles.linha}>
            <span className={styles.desc}>Juros Campanha</span>
            <span
              className={`${styles.valor} ${
                calculo.juros >= 0 ? styles.positivo : styles.negativo
              }`}
            >
              {calculo.juros >= 0
                ? `+${formatarBRL(calculo.juros)}`
                : `−${formatarBRL(Math.abs(calculo.juros))}`}
            </span>
          </div>
        )}
        <div className={`${styles.linha} ${styles.subtotal}`}>
          <span className={styles.desc}>
            Base {calculo.temJuros ? "(após Juros Campanha)" : "(após FPC)"}
          </span>
          <span className={styles.valor}>{formatarBRL(calculo.base)}</span>
        </div>
      </div>

      <div className={styles.separador} />

      <div className={styles.bloco}>
        <div className={styles.linha}>
          <span className={styles.desc}>Total débitos líderes</span>
          <span className={`${styles.valor} ${styles.negativo}`}>
            {calculo.totalDebitosLideres > 0
              ? `−${formatarBRL(calculo.totalDebitosLideres)}`
              : "—"}
          </span>
        </div>
        <div className={styles.linha}>
          <span className={styles.desc}>Total débitos caixa</span>
          <span className={`${styles.valor} ${styles.negativo}`}>
            {calculo.totalDebitosCaixa > 0
              ? `−${formatarBRL(calculo.totalDebitosCaixa)}`
              : "—"}
          </span>
        </div>
      </div>

      <div className={styles.separador} />

      <div className={`${styles.linha} ${styles.resultado}`}>
        <span className={styles.resultadoLabel}>Diferença de caixa</span>
        <span
          className={`${styles.resultadoValor} ${
            calculo.diferenca < 0 ? styles.negativo : styles.positivo
          }`}
        >
          {formatarBRL(calculo.diferenca)}
        </span>
      </div>
    </section>
  );
}

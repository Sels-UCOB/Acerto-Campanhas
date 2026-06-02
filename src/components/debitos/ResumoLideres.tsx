"use client";

import React, { useState, useMemo } from "react";
import { useDebitos } from "@/context/DebitosContext";
import { useAcerto } from "@/context/AcertoContext";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { calcularTotalDevedores, calcularResumoLider } from "@/lib/calcularDebitos";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import styles from "./ResumoLideres.module.css";

export function ResumoLideres() {
  const { state } = useAcerto();
  const { cartaBolsa } = useLancamentoLider();
  const {
    devedores,
    gastosLideres,
    setGastosLider,
    addDebitoAdicional,
    updateDebitoAdicional,
    removeDebitoAdicional,
  } = useDebitos();

  const [expandidos, setExpandidos] = useState<Record<number, boolean>>({});

  const compraBonificada = state.dadosImportados?.bonificado ?? 0;
  const totalDevedores = useMemo(() => calcularTotalDevedores(devedores), [devedores]);

  const numLideres = state.config.numLideres ?? 1;
  const lideres = Array.from({ length: numLideres }, (_, i) => state.config.lideres[i]).filter(
    (l) => l.nome.trim()
  );

  if (lideres.length === 0) {
    return (
      <div className={styles.vazio}>
        <p>Nenhum líder configurado.</p>
      </div>
    );
  }

  const toggleExpandido = (idx: number) =>
    setExpandidos((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className={styles.container}>
      <h3 className={styles.secaoTitulo}>Resumo dos Líderes</h3>
      <div className={styles.cards}>
        {lideres.map((lider, idx) => {
          const resumo = calcularResumoLider({
            lider,
            percentualDebito: lider.percentualDebito ?? 0,
            totalDevedores,
            gastosLider: gastosLideres[idx],
            compraBonificada,
            cartaBolsaValor: cartaBolsa.valor,
            cartaBolsaReceptor: cartaBolsa.liderReceptor,
          });

          const gastosConfig = gastosLideres[idx];
          const expandido = expandidos[idx] ?? false;

          return (
            <div key={lider.nome} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNome}>{lider.nome}</span>
              </div>

              {/* 1. Gastos do líder */}
              <div className={styles.secao}>
                <label className={styles.secaoLabel}>Gastos do líder</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="R$ 0,00"
                  min={0}
                  step="0.01"
                  value={gastosConfig.gastos || ""}
                  onChange={(e) => setGastosLider(idx, parseFloat(e.target.value) || 0)}
                />
              </div>

              {/* 2. Débitos de colportores */}
              <div className={styles.secao}>
                <div className={styles.debitosHeader}>
                  <span className={styles.secaoLabel}>Débitos de colportores</span>
                  <button
                    type="button"
                    className={styles.btnExpandir}
                    onClick={() => toggleExpandido(idx)}
                  >
                    <span className={styles.btnExpandirValor}>
                      {formatarBRL(resumo.debitoColportores)}
                    </span>
                    <span className={styles.expandirIcone}>{expandido ? "▲" : "▼"}</span>
                  </button>
                </div>
                {expandido && (
                  <div className={styles.listaColportores}>
                    {devedores.length === 0 ? (
                      <span className={styles.semDevedores}>Sem devedores registrados</span>
                    ) : (
                      devedores.map((d) => {
                        const pct = lider.percentualDebito ?? 0;
                        const valorIndividual = Math.round((pct / 100) * d.valorDebito * 100) / 100;
                        return (
                          <div key={d.id} className={styles.colportorLinha}>
                            <span className={styles.colportorNome}>{d.nome || "—"}</span>
                            <span className={styles.colportorPct}>{pct.toFixed(1)}%</span>
                            <span className={styles.colportorValor}>
                              {formatarBRL(valorIndividual)}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* 3. Débitos adicionais */}
              <div className={styles.secao}>
                <div className={styles.debitosAdicHeader}>
                  <span className={styles.secaoLabel}>Débitos adicionais</span>
                  <button
                    type="button"
                    className={styles.btnAddAdic}
                    onClick={() => addDebitoAdicional(idx)}
                  >
                    + Adicionar
                  </button>
                </div>
                {gastosConfig.debitosAdicionais.map((d) => (
                  <div key={d.id} className={styles.debitoAdicLinha}>
                    <input
                      type="text"
                      className={styles.inputDesc}
                      placeholder="Descrição"
                      value={d.descricao}
                      onChange={(e) =>
                        updateDebitoAdicional(idx, d.id, { descricao: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className={styles.inputValorAdic}
                      placeholder="0,00"
                      min={0}
                      step="0.01"
                      value={d.valor || ""}
                      onChange={(e) =>
                        updateDebitoAdicional(idx, d.id, {
                          valor: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <button
                      type="button"
                      className={styles.btnRemoverAdic}
                      onClick={() => removeDebitoAdicional(idx, d.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 4. Total débitos */}
              <div className={styles.totalDebitos}>
                <span>Total de débitos</span>
                <span className={styles.totalDebitosValor}>{formatarBRL(resumo.totalDebitos)}</span>
              </div>

              {/* 5. Resumo financeiro */}
              <div className={styles.resumoFinanceiro}>
                <div className={styles.rfLinha}>
                  <span>Bonificação + Auxílio</span>
                  <span className={styles.rfPositivo}>{formatarBRL(resumo.totalBruto)}</span>
                </div>
                {resumo.carta > 0 && (
                  <div className={styles.rfLinha}>
                    <span>Carta de Bolsa</span>
                    <span className={styles.rfNegativo}>−{formatarBRL(resumo.carta)}</span>
                  </div>
                )}
                <div className={styles.rfLinha}>
                  <span>Total Débitos</span>
                  <span className={styles.rfNegativo}>−{formatarBRL(resumo.totalDebitos)}</span>
                </div>
                <div className={styles.rfLinha}>
                  <span>Dízimo</span>
                  <span className={styles.rfNegativo}>−{formatarBRL(resumo.dizimo)}</span>
                </div>
                <div className={styles.rfLinha}>
                  <span>INSS</span>
                  <span className={styles.rfNegativo}>−{formatarBRL(resumo.inss)}</span>
                </div>
                <div className={styles.rfLinha}>
                  <span>IRPF</span>
                  <span className={styles.rfNegativo}>−{formatarBRL(resumo.irpf)}</span>
                </div>
                <div className={styles.rfSaldo}>
                  <span>Saldo final</span>
                  <span
                    className={`${styles.rfSaldoValor} ${
                      resumo.saldoFinal < 0 ? styles.rfNegativo : styles.rfPositivo
                    }`}
                  >
                    {formatarBRL(resumo.saldoFinal)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    gastosCaixa,
    setGastosCaixa,
    addDebitoAdicionalCaixa,
    updateDebitoAdicionalCaixa,
    removeDebitoAdicionalCaixa,
  } = useDebitos();

  const [expandidos, setExpandidos] = useState<Record<number, boolean>>({});

  const compraBonificada = state.dadosImportados?.bonificado ?? 0;
  const totalDevedores = useMemo(() => calcularTotalDevedores(devedores), [devedores]);

  const numLideres = state.config.numLideres ?? 1;
  const lideres = Array.from({ length: numLideres }, (_, i) => state.config.lideres[i]).filter(
    (l) => l.nome.trim()
  );
  const caixa = state.config.caixa;
  const temCaixa = caixa.nome.trim().length > 0;

  if (lideres.length === 0 && !temCaixa) {
    return (
      <div className={styles.vazio}>
        <p>Nenhum líder configurado.</p>
      </div>
    );
  }

  const toggleExpandido = (idx: number) =>
    setExpandidos((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const salarioCaixa = caixa.salarioCaixa ?? 0;
  const auxilioCaixa = Math.round((caixa.auxilioPercentual / 100) * compraBonificada * 100) / 100;
  const totalBrutoCaixa = Math.round((salarioCaixa + auxilioCaixa) * 100) / 100;
  const totalGastosCaixa = Math.round(
    (gastosCaixa.gastos + gastosCaixa.debitosAdicionais.reduce((s, d) => s + d.valor, 0)) * 100
  ) / 100;
  const saldoCaixa = Math.round((totalBrutoCaixa - totalGastosCaixa) * 100) / 100;

  return (
    <div className={styles.container}>
      <h3 className={styles.secaoTitulo}>Resumo dos Líderes</h3>
      <div className={styles.cards}>

        {/* Cards dos líderes */}
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

        {/* Card do Caixa */}
        {temCaixa && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardNome}>{caixa.nome}</span>
              <span className={styles.cardTag}>Caixa</span>
            </div>

            {/* Salário + Auxílio — sempre visível no topo */}
            <div className={styles.resumoFinanceiro}>
              {salarioCaixa > 0 && (
                <div className={styles.rfLinha}>
                  <span>Salário</span>
                  <span className={styles.rfPositivo}>{formatarBRL(salarioCaixa)}</span>
                </div>
              )}
              {auxilioCaixa > 0 && (
                <div className={styles.rfLinha}>
                  <span>Auxílio</span>
                  <span className={styles.rfPositivo}>{formatarBRL(auxilioCaixa)}</span>
                </div>
              )}
              <div className={styles.rfLinha}>
                <span style={{ fontWeight: 700 }}>Total bruto</span>
                <span className={styles.rfPositivo} style={{ fontWeight: 700 }}>
                  {formatarBRL(totalBrutoCaixa)}
                </span>
              </div>
            </div>

            <div
              style={{
                height: 1,
                background: "var(--borda)",
                margin: "0.5rem 0",
              }}
            />

            {/* Gastos do caixa */}
            <div className={styles.secao}>
              <label className={styles.secaoLabel}>Gastos do caixa</label>
              <input
                type="number"
                className={styles.input}
                placeholder="R$ 0,00"
                min={0}
                step="0.01"
                value={gastosCaixa.gastos || ""}
                onChange={(e) => setGastosCaixa(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Outros gastos */}
            <div className={styles.secao}>
              <div className={styles.debitosAdicHeader}>
                <span className={styles.secaoLabel}>Outros gastos</span>
                <button
                  type="button"
                  className={styles.btnAddAdic}
                  onClick={addDebitoAdicionalCaixa}
                >
                  + Adicionar
                </button>
              </div>
              {gastosCaixa.debitosAdicionais.map((d) => (
                <div key={d.id} className={styles.debitoAdicLinha}>
                  <input
                    type="text"
                    className={styles.inputDesc}
                    placeholder="Descrição"
                    value={d.descricao}
                    onChange={(e) =>
                      updateDebitoAdicionalCaixa(d.id, { descricao: e.target.value })
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
                      updateDebitoAdicionalCaixa(d.id, {
                        valor: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <button
                    type="button"
                    className={styles.btnRemoverAdic}
                    onClick={() => removeDebitoAdicionalCaixa(d.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Total gastos + Saldo */}
            <div className={styles.totalDebitos}>
              <span>Total de gastos</span>
              <span className={styles.totalDebitosValor}>{formatarBRL(totalGastosCaixa)}</span>
            </div>

            <div className={styles.rfSaldo}>
              <span>Saldo final</span>
              <span
                className={`${styles.rfSaldoValor} ${
                  saldoCaixa < 0 ? styles.rfNegativo : styles.rfPositivo
                }`}
              >
                {formatarBRL(saldoCaixa)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

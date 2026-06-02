"use client";

import React, { useState, useCallback } from "react";
import { useLancamento } from "@/context/LancamentoContext";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { calcularSaldos } from "@/lib/calcularSaldos";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import { NovoTipoModal } from "./NovoTipoModal";
import styles from "./TabelaLancamentos.module.css";

export function TabelaLancamentos() {
  const { lancamentos, addLancamento, updateLancamento, removeLancamento } =
    useLancamento();
  const { tipos } = useConfiguracao();
  const [modalRowId, setModalRowId] = useState<string | null>(null);

  const saldos = calcularSaldos(lancamentos);

  const handleValor = useCallback(
    (id: string, raw: string) => {
      const num = raw === "" ? null : parseFloat(raw);
      updateLancamento(id, { valor: num === null || isNaN(num) ? null : num });
    },
    [updateLancamento]
  );

  const handleSaldoManual = useCallback(
    (id: string, raw: string) => {
      const num = raw === "" ? 0 : parseFloat(raw);
      updateLancamento(id, { saldoManual: isNaN(num) ? 0 : num });
    },
    [updateLancamento]
  );

  const saldoFinal = saldos.length > 0 ? saldos[saldos.length - 1] : 0;

  return (
    <div className={styles.container}>
      {modalRowId && (
        <NovoTipoModal
          onSalvar={(id) => {
            updateLancamento(modalRowId, { tipoLancamentoId: id });
            setModalRowId(null);
          }}
          onFechar={() => setModalRowId(null)}
        />
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th className={styles.thNum}>#</th>
              <th className={styles.thTipo}>Tipo Lançamento</th>
              <th className={styles.thHistorico}>Histórico</th>
              <th className={styles.thValor}>D/C</th>
              <th className={styles.thSaldo}>Saldo</th>
              <th className={styles.thAcao} aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((lanc, idx) => {
              const saldo = saldos[idx] ?? 0;
              const isPrimeira = idx === 0;

              return (
                <tr
                  key={lanc.id}
                  className={isPrimeira ? styles.linhaSaldoInicial : ""}
                >
                  <td className={styles.tdNum}>{idx + 1}</td>

                  {isPrimeira ? (
                    <td colSpan={3} className={styles.tdSaldoInicialLabel}>
                      Saldo Inicial
                    </td>
                  ) : (
                    <>
                      <td className={styles.tdTipo}>
                        <select
                          value={lanc.tipoLancamentoId}
                          onChange={(e) => {
                            if (e.target.value === "__novo__") {
                              setModalRowId(lanc.id);
                            } else {
                              updateLancamento(lanc.id, {
                                tipoLancamentoId: e.target.value,
                              });
                            }
                          }}
                          className={styles.selectTipo}
                        >
                          <option value="">— selecione —</option>
                          {tipos.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nome}
                            </option>
                          ))}
                          <option disabled>──────────</option>
                          <option value="__novo__">
                            + Novo Tipo de Lançamento...
                          </option>
                        </select>
                      </td>

                      <td className={styles.tdHistorico}>
                        <input
                          type="text"
                          value={lanc.historico}
                          onChange={(e) =>
                            updateLancamento(lanc.id, {
                              historico: e.target.value,
                            })
                          }
                          className={styles.inputTexto}
                          placeholder="Descrição"
                        />
                      </td>

                      <td className={styles.tdValor}>
                        <input
                          type="number"
                          value={lanc.valor ?? ""}
                          onChange={(e) => handleValor(lanc.id, e.target.value)}
                          className={`${styles.inputNum} ${
                            lanc.valor !== null && lanc.valor < 0
                              ? styles.valorNegativo
                              : ""
                          }`}
                          step="0.01"
                          placeholder="+/- valor"
                        />
                      </td>
                    </>
                  )}

                  <td
                    className={`${styles.tdSaldo} ${
                      saldo < 0 ? styles.negativo : ""
                    }`}
                  >
                    {isPrimeira ? (
                      <input
                        type="number"
                        value={lanc.saldoManual ?? ""}
                        onChange={(e) =>
                          handleSaldoManual(lanc.id, e.target.value)
                        }
                        className={`${styles.inputNum} ${styles.inputSaldoInicial}`}
                        step="0.01"
                        placeholder="0,00"
                      />
                    ) : (
                      <span className={styles.saldoValor}>
                        {formatarBRL(saldo)}
                      </span>
                    )}
                  </td>

                  <td className={styles.tdAcao}>
                    {!isPrimeira && (
                      <button
                        type="button"
                        onClick={() => removeLancamento(lanc.id)}
                        className={styles.btnRemover}
                        aria-label={`Remover linha ${idx + 1}`}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.rodape}>
        <button
          type="button"
          onClick={addLancamento}
          className={styles.btnAddLinha}
        >
          + Adicionar Linha
        </button>
        <span
          className={`${styles.saldoFinal} ${
            saldoFinal < 0 ? styles.negativo : ""
          }`}
        >
          Saldo final: <strong>{formatarBRL(saldoFinal)}</strong>
        </span>
      </div>
    </div>
  );
}

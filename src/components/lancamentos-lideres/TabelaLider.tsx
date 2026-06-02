"use client";

import React, { useMemo, useState } from "react";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { useLancamento } from "@/context/LancamentoContext";
import { useAcerto } from "@/context/AcertoContext";
import { gerarLinhasLider } from "@/lib/gerarLinhasLider";
import { calcularSaldosLider } from "@/lib/calcularSaldosLider";
import { calcularSaldos } from "@/lib/calcularSaldos";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import { ModalDetalhe } from "./ModalDetalhe";
import type { LinhaTabela } from "@/types/lancamentoLider";
import styles from "./TabelaLider.module.css";

function formatDC(valor: number): string {
  if (valor === 0) return "—";
  const abs = formatarBRL(Math.abs(valor));
  return valor > 0 ? `+${abs}` : `-${abs}`;
}

export function TabelaLider() {
  const { cartaBolsa, jurosCampanha } = useLancamentoLider();
  const { lancamentos } = useLancamento();
  const { state } = useAcerto();
  const salarioCaixa = state.config.caixa.salarioCaixa;

  const configs = state.config.lideres
    .filter((l) => l.nome.trim())
    .map((l) => ({
      nome: l.nome,
      bonificacaoPercentual: l.bonificacaoPercentual,
      auxilioPercentual: l.auxilioPercentual,
    }));

  const caixaConfig = state.config.caixa.nome.trim()
    ? { nome: state.config.caixa.nome, auxilioPercentual: state.config.caixa.auxilioPercentual }
    : null;
  const [modalLinha, setModalLinha] = useState<LinhaTabela | null>(null);

  const compraBonificada = state.dadosImportados?.bonificado ?? 0;

  const saldosLancamentos = useMemo(
    () => calcularSaldos(lancamentos),
    [lancamentos]
  );
  const saldoInicial =
    saldosLancamentos.length > 0
      ? saldosLancamentos[saldosLancamentos.length - 1]
      : 0;

  const linhas = useMemo(
    () =>
      gerarLinhasLider({
        configs,
        cartaBolsa,
        compraBonificada,
        jurosCampanha,
        salarioCaixa,
        caixaConfig,
      }),
    [configs, cartaBolsa, compraBonificada, jurosCampanha, salarioCaixa]
  );

  const saldos = useMemo(
    () => calcularSaldosLider(linhas, saldoInicial),
    [linhas, saldoInicial]
  );

  const saldoFinal =
    saldos.length > 0 ? saldos[saldos.length - 1] : saldoInicial;

  return (
    <div className={styles.container}>
      {modalLinha && (
        <ModalDetalhe linha={modalLinha} onFechar={() => setModalLinha(null)} />
      )}

      <div className={styles.saldoHerdado}>
        <span className={styles.saldoHerdadoLabel}>Saldo herdado da campanha</span>
        <span
          className={`${styles.saldoHerdadoValor} ${saldoInicial < 0 ? styles.negativo : ""}`}
        >
          {formatarBRL(saldoInicial)}
        </span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th className={styles.thDesc}>Descrição</th>
              <th className={styles.thValor}>D/C</th>
              <th className={styles.thSaldo}>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, idx) => {
              const saldo = saldos[idx] ?? saldoInicial;

              if (linha.tipo === "header") {
                return (
                  <tr key={linha.id} className={styles.linhaHeader}>
                    <td colSpan={3} className={styles.tdHeader}>
                      {linha.descricao}
                    </td>
                  </tr>
                );
              }

              const isNegativo = linha.valor < 0;
              const isFpc = linha.tipo === "fpc";
              const isSalario = linha.tipo === "salarioCaixa";

              return (
                <tr
                  key={linha.id}
                  className={[
                    styles.linhaItem,
                    isFpc ? styles.linhaFpc : "",
                    isSalario ? styles.linhaSalario : "",
                    linha.clicavel ? styles.linhaClicavel : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={
                    linha.clicavel ? () => setModalLinha(linha) : undefined
                  }
                  title={linha.clicavel ? "Clique para ver detalhes" : undefined}
                >
                  <td className={styles.tdDesc}>
                    <span>{linha.descricao}</span>
                    {linha.clicavel && (
                      <span className={styles.badge}>detalhes</span>
                    )}
                    {isSalario && (
                      <span className={styles.badgeExcluido}>
                        fora do saldo
                      </span>
                    )}
                  </td>
                  <td
                    className={`${styles.tdValor} ${isNegativo ? styles.negativo : styles.positivo}`}
                  >
                    {formatDC(linha.valor)}
                  </td>
                  <td
                    className={`${styles.tdSaldo} ${saldo < 0 ? styles.negativo : ""}`}
                  >
                    {linha.excluirDoSaldo ? (
                      <span className={styles.excluido}>—</span>
                    ) : (
                      formatarBRL(saldo)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.rodape}>
        <span
          className={`${styles.saldoFinal} ${saldoFinal < 0 ? styles.negativo : ""}`}
        >
          Saldo final: <strong>{formatarBRL(saldoFinal)}</strong>
        </span>
      </div>
    </div>
  );
}

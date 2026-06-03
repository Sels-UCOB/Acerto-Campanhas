"use client";

import React, { useMemo } from "react";
import { useLancamento } from "@/context/LancamentoContext";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import styles from "./ResumoCampanha.module.css";

export function ResumoCampanha() {
  const { lancamentos } = useLancamento();
  const { tipos } = useConfiguracao();

  const { grupos, totalGeral } = useMemo(() => {
    const mapa = new Map<string, number>();

    for (const l of lancamentos) {
      if (!l.tipoLancamentoId || l.valor === null) continue;
      mapa.set(l.tipoLancamentoId, (mapa.get(l.tipoLancamentoId) ?? 0) + l.valor);
    }

    const grupos = Array.from(mapa.entries()).map(([id, total]) => ({
      nome: tipos.find((t) => t.id === id)?.nome ?? id,
      total,
    }));

    const totalGeral = grupos.reduce((s, g) => s + g.total, 0);
    return { grupos, totalGeral };
  }, [lancamentos, tipos]);

  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Resumo da Campanha</h2>

      {grupos.length === 0 ? (
        <p className={styles.vazio}>Nenhum lançamento registrado.</p>
      ) : (
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th className={styles.thTipo}>Tipo de lançamento</th>
              <th className={styles.thValor}>Total</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((g) => (
              <tr key={g.nome} className={styles.linha}>
                <td className={styles.tdTipo}>{g.nome}</td>
                <td className={styles.tdValor}>{formatarBRL(g.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={styles.rodape}>
              <td className={styles.tdTotalLabel}>Total geral</td>
              <td className={styles.tdTotalValor}>{formatarBRL(totalGeral)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  );
}

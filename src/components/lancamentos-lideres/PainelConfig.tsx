"use client";

import React from "react";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { useAcerto } from "@/context/AcertoContext";
import styles from "./PainelConfig.module.css";

export function PainelConfig() {
  const { cartaBolsa, jurosCampanha, updateCartaBolsa, setJurosCampanha } =
    useLancamentoLider();
  const { state } = useAcerto();
  const lideres = state.config.lideres.filter((l) => l.nome.trim());

  return (
    <aside className={styles.painel}>
      <h2 className={styles.titulo}>Configuração</h2>

      {lideres.length === 0 && (
        <p className={styles.aviso}>
          Nenhum líder configurado. Defina os líderes na aba Acerto.
        </p>
      )}

      <div className={styles.separador} />

      <h3 className={styles.secaoTitulo}>Carta de Bolsa</h3>
      <div className={styles.grupo}>
        <label className={styles.label}>Valor</label>
        <input
          type="number"
          className={styles.input}
          value={cartaBolsa.valor === 0 ? "" : cartaBolsa.valor}
          placeholder="R$ 0,00"
          min={0}
          step="0.01"
          onChange={(e) =>
            updateCartaBolsa({ valor: parseFloat(e.target.value) || 0 })
          }
        />
      </div>
      <div className={styles.grupo}>
        <label className={styles.label}>Líder receptor</label>
        <select
          className={styles.select}
          value={cartaBolsa.liderReceptor}
          onChange={(e) => updateCartaBolsa({ liderReceptor: e.target.value })}
        >
          <option value="">— nenhum —</option>
          {lideres.map((l) => (
            <option key={l.nome} value={l.nome}>
              {l.nome}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.separador} />

      <h3 className={styles.secaoTitulo}>Lançamentos Manuais</h3>
      <div className={styles.grupo}>
        <label className={styles.label}>Juros Campanha</label>
        <input
          type="number"
          className={styles.input}
          value={jurosCampanha ?? ""}
          placeholder="+/- valor"
          step="0.01"
          onChange={(e) =>
            setJurosCampanha(
              e.target.value === "" ? null : parseFloat(e.target.value)
            )
          }
        />
      </div>
    </aside>
  );
}

"use client";

import React, { useState, useCallback } from "react";
import { useDebitos } from "@/context/DebitosContext";
import { calcularTotalDevedores } from "@/lib/calcularDebitos";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import styles from "./TabelaDevedores.module.css";

export function TabelaDevedores() {
  const { devedores, addDevedor, updateDevedor, removeDevedor, salvar } = useDebitos();
  const total = calcularTotalDevedores(devedores);
  const [salvo, setSalvo] = useState(false);

  const handleSalvar = useCallback(() => {
    salvar();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }, [salvar]);

  return (
    <div className={styles.container}>
      <div className={styles.cabecalho}>
        <h3 className={styles.titulo}>Débitos de Colportores</h3>
        <button type="button" className={styles.btnAdd} onClick={addDevedor}>
          + Adicionar
        </button>
      </div>

      {devedores.length === 0 ? (
        <p className={styles.vazio}>Nenhum devedor registrado.</p>
      ) : (
        <div className={styles.lista}>
          <div className={styles.listaHeader}>
            <span>Nome</span>
            <span className={styles.colValor}>Valor</span>
          </div>
          {devedores.map((d) => (
            <div key={d.id} className={styles.linha}>
              <input
                className={styles.inputNome}
                type="text"
                placeholder="Nome do colportor"
                value={d.nome}
                onChange={(e) => updateDevedor(d.id, { nome: e.target.value })}
              />
              <input
                className={styles.inputValor}
                type="number"
                placeholder="0,00"
                min={0}
                step="0.01"
                value={d.valorDebito || ""}
                onChange={(e) =>
                  updateDevedor(d.id, { valorDebito: parseFloat(e.target.value) || 0 })
                }
              />
              <button
                type="button"
                className={styles.btnRemover}
                onClick={() => removeDevedor(d.id)}
                title="Remover"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.rodape}>
        <span className={styles.totalLabel}>Total débitos</span>
        <span className={styles.totalValor}>{formatarBRL(total)}</span>
      </div>

      <div className={styles.acoes}>
        <button
          type="button"
          className={salvo ? styles.btnSalvoOk : styles.btnSalvar}
          onClick={handleSalvar}
        >
          {salvo ? "Salvo ✓" : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}

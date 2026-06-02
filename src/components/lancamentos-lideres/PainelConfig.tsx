"use client";

import React from "react";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { useAcerto } from "@/context/AcertoContext";
import styles from "./PainelConfig.module.css";

export function PainelConfig() {
  const {
    configs,
    cartaBolsa,
    jurosCampanha,
    salarioCaixa,
    updateConfig,
    updateCartaBolsa,
    setJurosCampanha,
    setSalarioCaixa,
  } = useLancamentoLider();
  const { state } = useAcerto();
  const lideres = state.config.lideres.filter(Boolean);

  return (
    <aside className={styles.painel}>
      <h2 className={styles.titulo}>Configuração</h2>

      {configs.length === 0 && (
        <p className={styles.aviso}>
          Nenhum líder configurado. Defina os líderes na aba Acerto.
        </p>
      )}

      {configs.map((config) => (
        <div key={config.nome} className={styles.secaoLider}>
          <h3 className={styles.liderNome}>{config.nome}</h3>
          <div className={styles.grupo}>
            <label className={styles.label}>Bonificação %</label>
            <div className={styles.inputPct}>
              <input
                type="number"
                className={styles.input}
                value={config.bonificacaoPercentual === 0 ? "" : config.bonificacaoPercentual}
                placeholder="0"
                min={0}
                max={100}
                step="0.01"
                onChange={(e) =>
                  updateConfig(config.nome, {
                    bonificacaoPercentual: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <span className={styles.pctSufixo}>%</span>
            </div>
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Auxílio %</label>
            <div className={styles.inputPct}>
              <input
                type="number"
                className={styles.input}
                value={config.auxilioPercentual === 0 ? "" : config.auxilioPercentual}
                placeholder="0"
                min={0}
                max={100}
                step="0.01"
                onChange={(e) =>
                  updateConfig(config.nome, {
                    auxilioPercentual: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <span className={styles.pctSufixo}>%</span>
            </div>
          </div>
        </div>
      ))}

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
            <option key={l} value={l}>
              {l}
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
      <div className={styles.grupo}>
        <label className={styles.label}>Salário Caixa</label>
        <input
          type="number"
          className={styles.input}
          value={salarioCaixa ?? ""}
          placeholder="Valor"
          min={0}
          step="0.01"
          onChange={(e) =>
            setSalarioCaixa(
              e.target.value === "" ? null : parseFloat(e.target.value)
            )
          }
        />
        <span className={styles.nota}>Não entra no cálculo do saldo</span>
      </div>
    </aside>
  );
}

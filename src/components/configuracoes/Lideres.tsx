"use client";

import React, { useEffect, useState } from "react";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { useAcerto } from "@/context/AcertoContext";
import { ConfirmDialog } from "./ConfirmDialog";
import styles from "./Lideres.module.css";

export function Lideres() {
  const { lideres, initLideres, updateLider, deleteLider } = useConfiguracao();
  const { state } = useAcerto();
  const [confirmarId, setConfirmarId] = useState<string | null>(null);

  useEffect(() => {
    const nomes = state.config.lideres.filter((l) => l.nome).map((l) => l.nome);
    if (state.config.caixa.nome.trim()) nomes.push(state.config.caixa.nome);
    initLideres(nomes);
  }, [initLideres, state.config.lideres, state.config.caixa.nome]);

  const naoConfigurados = lideres.filter(
    (l) => !l.subcontaLider.trim() || !l.subcontaLucro.trim()
  );
  const liderAlvo = lideres.find((l) => l.id === confirmarId);

  return (
    <div className={styles.container}>
      {confirmarId && liderAlvo && (
        <ConfirmDialog
          mensagem={`Tem certeza que deseja excluir o líder "${liderAlvo.nome}"?`}
          onConfirmar={() => { deleteLider(confirmarId); setConfirmarId(null); }}
          onCancelar={() => setConfirmarId(null)}
        />
      )}

      {naoConfigurados.length > 0 && (
        <div className={styles.aviso} role="alert">
          ⚠ Por Favor, configure as Subcontas do(s) Líderes!
        </div>
      )}

      {lideres.length === 0 ? (
        <p className={styles.vazio}>
          Nenhum líder encontrado. Configure os líderes na tela de Importação &amp; Configuração primeiro.
        </p>
      ) : (
        <div className={styles.lista}>
          {lideres.map((lider) => {
            const incompleto =
              !lider.subcontaLider.trim() || !lider.subcontaLucro.trim();
            return (
              <div
                key={lider.id}
                className={`${styles.card} ${incompleto ? styles.cardIncompleto : styles.cardOk}`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.nomeArea}>
                    <span className={styles.nomeLider}>{lider.nome}</span>
                    {incompleto ? (
                      <span className={styles.badgeAviso}>Não configurado</span>
                    ) : (
                      <span className={styles.badgeOk}>Configurado</span>
                    )}
                  </div>
                  <button
                    className={styles.btnExcluir}
                    onClick={() => setConfirmarId(lider.id)}
                    type="button"
                    aria-label={`Excluir líder ${lider.nome}`}
                  >
                    Excluir
                  </button>
                </div>

                <div className={styles.campos}>
                  <div className={styles.grupo}>
                    <label
                      className={styles.label}
                      htmlFor={`subcontaLider-${lider.id}`}
                    >
                      Subconta Líder *
                    </label>
                    <input
                      id={`subcontaLider-${lider.id}`}
                      className={`${styles.input} ${!lider.subcontaLider.trim() ? styles.inputVazio : ""}`}
                      type="text"
                      placeholder="Código da subconta"
                      value={lider.subcontaLider}
                      onChange={(e) =>
                        updateLider(lider.id, { subcontaLider: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.grupo}>
                    <label
                      className={styles.label}
                      htmlFor={`subcontaLucro-${lider.id}`}
                    >
                      Subconta Lucro *
                    </label>
                    <input
                      id={`subcontaLucro-${lider.id}`}
                      className={`${styles.input} ${!lider.subcontaLucro.trim() ? styles.inputVazio : ""}`}
                      type="text"
                      placeholder="Código da subconta"
                      value={lider.subcontaLucro}
                      onChange={(e) =>
                        updateLider(lider.id, { subcontaLucro: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

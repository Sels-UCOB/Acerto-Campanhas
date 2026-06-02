"use client";

import React from "react";
import styles from "./ConfirmDialog.module.css";

interface ConfirmDialogProps {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({ mensagem, onConfirmar, onCancelar }: ConfirmDialogProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal>
      <div className={styles.caixa}>
        <p className={styles.mensagem}>{mensagem}</p>
        <div className={styles.acoes}>
          <button className={styles.btnCancelar} onClick={onCancelar} type="button">
            Cancelar
          </button>
          <button className={styles.btnConfirmar} onClick={onConfirmar} type="button">
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}

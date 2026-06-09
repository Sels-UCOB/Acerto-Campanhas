"use client";

import React, { useState } from "react";
import { useAcertosManagerOptional } from "@/context/AcertosManagerContext";
import styles from "./BotaoEncerrar.module.css";

export function BotaoEncerrar() {
  const manager = useAcertosManagerOptional();
  const [flash, setFlash] = useState(false);

  if (!manager) return null;

  const { activeId, activeAcerto, closeAcerto } = manager;

  if (!activeId || !activeAcerto) return null;

  if (activeAcerto.status === "Encerrado") {
    const dt = activeAcerto.dataEncerramento
      ? new Date(activeAcerto.dataEncerramento).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";
    return (
      <div className={styles.encerradoBox}>
        <span className={styles.encerradoIcone}>✅</span>
        <span className={styles.encerradoTexto}>Encerrado em {dt}</span>
      </div>
    );
  }

  const handleEncerrar = () => {
    closeAcerto(activeId);
    setFlash(true);
    setTimeout(() => setFlash(false), 4000);
  };

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.btn} onClick={handleEncerrar}>
        Encerrar Acerto
      </button>
      {flash && (
        <span className={styles.flash}>✔ Acerto encerrado com sucesso!</span>
      )}
    </div>
  );
}

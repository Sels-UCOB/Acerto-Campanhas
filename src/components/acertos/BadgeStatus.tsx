import React from "react";
import type { StatusAcerto } from "@/types/acertoManager";
import styles from "./BadgeStatus.module.css";

interface Props {
  status: StatusAcerto;
}

const LABELS: Record<StatusAcerto, string> = {
  Criado: "Criado",
  "Em Aberto": "Em Aberto",
  Encerrado: "Encerrado",
};

export function BadgeStatus({ status }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status.replace(" ", "")]}`}>
      {LABELS[status]}
    </span>
  );
}

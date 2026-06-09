"use client";

import React, { useState } from "react";
import type { AcertoMeta } from "@/types/acertoManager";
import { BadgeStatus } from "./BadgeStatus";
import styles from "./TabelaAcertos.module.css";

interface Props {
  acertos: AcertoMeta[];
  activeId: string | null;
  onEntrar: (acerto: AcertoMeta) => void;
  onEditar: (acerto: AcertoMeta) => void;
  onExcluir: (acerto: AcertoMeta) => void;
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function TabelaAcertos({
  acertos,
  activeId,
  onEntrar,
  onEditar,
  onExcluir,
}: Props) {
  const [confirmarExcluir, setConfirmarExcluir] = useState<string | null>(null);

  if (acertos.length === 0) {
    return (
      <div className={styles.vazio}>
        <span className={styles.vazioIcone}>📋</span>
        <p>Nenhum acerto encontrado.</p>
        <p className={styles.vazioSub}>Clique em "Novo Acerto" para começar.</p>
      </div>
    );
  }

  const handleExcluirConfirmar = (acerto: AcertoMeta) => {
    if (confirmarExcluir === acerto.id) {
      onExcluir(acerto);
      setConfirmarExcluir(null);
    } else {
      setConfirmarExcluir(acerto.id);
    }
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th className={styles.th}>Nome</th>
            <th className={styles.th}>Campo</th>
            <th className={styles.th}>Tipo de Campanha</th>
            <th className={styles.th}>Criado em</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {acertos.map((a) => (
            <tr
              key={a.id}
              className={`${styles.tr} ${a.id === activeId ? styles.trAtivo : ""}`}
            >
              <td className={styles.td}>
                <span className={styles.nome}>{a.nome}</span>
                {a.id === activeId && (
                  <span className={styles.ativoChip}>ativo</span>
                )}
              </td>
              <td className={styles.td}>{a.campo}</td>
              <td className={styles.td}>{a.tipoCampanha}</td>
              <td className={styles.td}>{fmtData(a.dataCriacao)}</td>
              <td className={styles.td}>
                <BadgeStatus status={a.status} />
              </td>
              <td className={styles.tdAcoes}>
                {a.status === "Encerrado" ? (
                  <button
                    className={`${styles.btn} ${styles.btnVisualizar}`}
                    onClick={() => onEntrar(a)}
                  >
                    Visualizar
                  </button>
                ) : (
                  <>
                    <button
                      className={`${styles.btn} ${styles.btnEntrar}`}
                      onClick={() => onEntrar(a)}
                    >
                      Entrar
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnEditar}`}
                      onClick={() => onEditar(a)}
                    >
                      Editar
                    </button>
                    {a.status === "Criado" && (
                      <button
                        className={`${styles.btn} ${
                          confirmarExcluir === a.id
                            ? styles.btnExcluirConfirmar
                            : styles.btnExcluir
                        }`}
                        onClick={() => handleExcluirConfirmar(a)}
                        onBlur={() =>
                          setConfirmarExcluir((prev) =>
                            prev === a.id ? null : prev
                          )
                        }
                      >
                        {confirmarExcluir === a.id ? "Confirmar?" : "Excluir"}
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

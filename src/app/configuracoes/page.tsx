"use client";

import React, { useState } from "react";
import { TiposLancamento } from "@/components/configuracoes/TiposLancamento";
import { Campos } from "@/components/configuracoes/Campos";
import { Lideres } from "@/components/configuracoes/Lideres";
import styles from "./page.module.css";

type Aba = "tipos" | "campos" | "lideres";

const ABAS: { id: Aba; label: string }[] = [
  { id: "tipos",   label: "Tipos de Lançamento" },
  { id: "campos",  label: "Campos" },
  { id: "lideres", label: "Líderes" },
];

export default function ConfiguracoesPage() {
  const [aba, setAba] = useState<Aba>("tipos");

  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        <h1 className={styles.titulo}>Configurações</h1>
        <nav className={styles.tabs} aria-label="Seções de configuração">
          {ABAS.map((a) => (
            <button
              key={a.id}
              className={`${styles.tab} ${aba === a.id ? styles.tabAtiva : ""}`}
              onClick={() => setAba(a.id)}
              type="button"
              aria-current={aba === a.id ? "page" : undefined}
            >
              {a.label}
            </button>
          ))}
        </nav>

        <div className={styles.conteudo}>
          {aba === "tipos"   && <TiposLancamento />}
          {aba === "campos"  && <Campos />}
          {aba === "lideres" && <Lideres />}
        </div>
      </main>
    </div>
  );
}

"use client";

import React, { useRef, useState, useCallback } from "react";
import { parseRelatorioSaldo } from "@/lib/parseRelatorioSaldo";
import type { DadosImportados } from "@/types/acerto";
import styles from "./XlsxUploader.module.css";

interface XlsxUploaderProps {
  onImportado: (dados: DadosImportados) => void;
}

export function XlsxUploader({ onImportado }: XlsxUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);

  const processar = useCallback(
    async (arquivo: File) => {
      if (!arquivo.name.match(/\.(xlsx|xlsm|xls)$/i)) {
        setErro("Formato inválido. Envie um arquivo .xlsx ou .xlsm");
        return;
      }
      setErro(null);
      setCarregando(true);
      setNomeArquivo(arquivo.name);
      try {
        const dados = await parseRelatorioSaldo(arquivo);
        onImportado(dados);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro ao processar arquivo.");
        setNomeArquivo(null);
      } finally {
        setCarregando(false);
      }
    },
    [onImportado]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processar(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastando(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processar(f);
  };

  return (
    <div
      className={`${styles.zona} ${arrastando ? styles.arrastando : ""} ${carregando ? styles.carregando : ""}`}
      onClick={() => !carregando && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
      onDragLeave={() => setArrastando(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      aria-label="Área de upload do relatório de saldo"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xlsm,.xls"
        onChange={onFileChange}
        className={styles.inputOculto}
        aria-hidden
      />

      <div className={styles.icone}>
        {carregando ? (
          <span className={styles.spinner} aria-label="Processando..." />
        ) : (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
            <rect width="40" height="40" rx="8" fill="currentColor" fillOpacity=".08" />
            <path
              d="M20 10v14M14 18l6 6 6-6M12 28h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <div className={styles.texto}>
        {carregando ? (
          <span>Processando <strong>{nomeArquivo}</strong>…</span>
        ) : nomeArquivo ? (
          <span>✓ <strong>{nomeArquivo}</strong> — clique para trocar</span>
        ) : (
          <>
            <strong>Arraste o relatório de saldo</strong>
            <span>ou clique para selecionar · .xlsx / .xlsm</span>
          </>
        )}
      </div>

      {erro && (
        <div className={styles.erro} role="alert">
          ⚠ {erro}
        </div>
      )}
    </div>
  );
}

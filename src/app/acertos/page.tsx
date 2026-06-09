"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAcertosManager } from "@/context/AcertosManagerContext";
import { FiltrosAcertos } from "@/components/acertos/FiltrosAcertos";
import { TabelaAcertos } from "@/components/acertos/TabelaAcertos";
import { ModalCriarAcerto } from "@/components/acertos/ModalCriarAcerto";
import type { AcertoMeta, CriarAcertoData, FiltrosAcerto } from "@/types/acertoManager";
import styles from "./page.module.css";

const FILTROS_INICIAIS: FiltrosAcerto = {
  status: "todos",
  campo: "todos",
  tipoCampanha: "todos",
  dataInicio: "",
  dataFim: "",
};

export default function PainelAcertosPage() {
  const router = useRouter();
  const {
    acertos,
    activeId,
    createAcerto,
    updateAcerto,
    deleteAcerto,
    setActiveAcerto,
  } = useAcertosManager();

  const [filtros, setFiltros] = useState<FiltrosAcerto>(FILTROS_INICIAIS);
  const [modalAberto, setModalAberto] = useState(false);
  const [acertoParaEditar, setAcertoParaEditar] = useState<AcertoMeta | null>(null);

  const acertosFiltrados = useMemo(() => {
    return acertos.filter((a) => {
      if (filtros.status !== "todos" && a.status !== filtros.status) return false;
      if (filtros.campo !== "todos" && a.campo !== filtros.campo) return false;
      if (
        filtros.tipoCampanha !== "todos" &&
        a.tipoCampanha !== filtros.tipoCampanha
      )
        return false;
      if (filtros.dataInicio) {
        const desde = filtros.dataInicio + "T00:00:00";
        if (a.dataCriacao < desde) return false;
      }
      if (filtros.dataFim) {
        const ate = filtros.dataFim + "T23:59:59";
        if (a.dataCriacao > ate) return false;
      }
      return true;
    });
  }, [acertos, filtros]);

  const handleCriar = (data: CriarAcertoData) => {
    createAcerto(data);
    setModalAberto(false);
    router.push("/");
  };

  const handleEditar = (data: CriarAcertoData) => {
    if (!acertoParaEditar) return;
    updateAcerto(acertoParaEditar.id, data);
    setAcertoParaEditar(null);
    setModalAberto(false);
  };

  const handleEntrar = (acerto: AcertoMeta) => {
    setActiveAcerto(acerto.id);
    router.push("/");
  };

  const handleAbrirEditar = (acerto: AcertoMeta) => {
    setAcertoParaEditar(acerto);
    setModalAberto(true);
  };

  const handleExcluir = (acerto: AcertoMeta) => {
    deleteAcerto(acerto.id);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setAcertoParaEditar(null);
  };

  const totalPorStatus = useMemo(
    () => ({
      Criado: acertos.filter((a) => a.status === "Criado").length,
      "Em Aberto": acertos.filter((a) => a.status === "Em Aberto").length,
      Encerrado: acertos.filter((a) => a.status === "Encerrado").length,
    }),
    [acertos]
  );

  return (
    <div className={styles.pagina}>
      <main className={styles.main}>
        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Painel de Acertos</h1>
            <p className={styles.subtitulo}>
              Gerencie os ciclos de acerto das campanhas de colportagem
            </p>
          </div>
          <button
            type="button"
            className={styles.btnNovo}
            onClick={() => {
              setAcertoParaEditar(null);
              setModalAberto(true);
            }}
          >
            + Novo Acerto
          </button>
        </div>

        {/* Resumo rápido */}
        {acertos.length > 0 && (
          <div className={styles.resumo}>
            <div className={styles.resumoItem}>
              <span className={styles.resumoNum}>{totalPorStatus.Criado}</span>
              <span className={styles.resumoLabel}>Criado</span>
            </div>
            <div className={styles.resumoItem}>
              <span className={`${styles.resumoNum} ${styles.resumoAberto}`}>
                {totalPorStatus["Em Aberto"]}
              </span>
              <span className={styles.resumoLabel}>Em Aberto</span>
            </div>
            <div className={styles.resumoItem}>
              <span className={`${styles.resumoNum} ${styles.resumoEncerrado}`}>
                {totalPorStatus.Encerrado}
              </span>
              <span className={styles.resumoLabel}>Encerrado</span>
            </div>
            <div className={styles.resumoItem}>
              <span className={styles.resumoNum}>{acertos.length}</span>
              <span className={styles.resumoLabel}>Total</span>
            </div>
          </div>
        )}

        {/* Filtros */}
        <FiltrosAcertos filtros={filtros} onChange={setFiltros} />

        {/* Tabela */}
        <TabelaAcertos
          acertos={acertosFiltrados}
          activeId={activeId}
          onEntrar={handleEntrar}
          onEditar={handleAbrirEditar}
          onExcluir={handleExcluir}
        />
      </main>

      {/* Modal criar / editar */}
      {modalAberto && (
        <ModalCriarAcerto
          onClose={handleFecharModal}
          onSalvar={acertoParaEditar ? handleEditar : handleCriar}
          dadosIniciais={
            acertoParaEditar
              ? {
                  nome: acertoParaEditar.nome,
                  campo: acertoParaEditar.campo,
                  tipoCampanha: acertoParaEditar.tipoCampanha,
                }
              : undefined
          }
          modoEdicao={!!acertoParaEditar}
        />
      )}
    </div>
  );
}

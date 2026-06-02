"use client";

import React, { useState } from "react";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { useAcerto } from "@/context/AcertoContext";
import { ConfirmDialog } from "./ConfirmDialog";
import type { TipoLancamento } from "@/types/configuracao";
import styles from "./TiposLancamento.module.css";

const VAZIO: Omit<TipoLancamento, "id"> = { nome: "", conta: "", subconta: "", departamento: "" };

export function TiposLancamento() {
  const { tipos, addTipo, updateTipo, deleteTipo } = useConfiguracao();
  const { state } = useAcerto();
  const departamentoCampanha = state.config.departamento;
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<TipoLancamento, "id">>(VAZIO);
  const [novoForm, setNovoForm] = useState<Omit<TipoLancamento, "id">>(VAZIO);
  const [confirmarId, setConfirmarId] = useState<string | null>(null);

  const iniciarEdicao = (t: TipoLancamento) => {
    setEditandoId(t.id);
    setEditForm({ nome: t.nome, conta: t.conta, subconta: t.subconta, departamento: t.departamento });
  };

  const salvarEdicao = () => {
    if (!editandoId) return;
    if (!editForm.nome.trim() || !editForm.conta.trim() || !editForm.departamento.trim()) return;
    updateTipo(editandoId, editForm);
    setEditandoId(null);
  };

  const handleAdd = () => {
    if (!novoForm.nome.trim() || !novoForm.conta.trim() || !novoForm.departamento.trim()) return;
    addTipo(novoForm);
    setNovoForm(VAZIO);
  };

  const tipoAlvo = tipos.find((t) => t.id === confirmarId);

  return (
    <div className={styles.container}>
      {confirmarId && tipoAlvo && (
        <ConfirmDialog
          mensagem={`Deseja excluir o tipo "${tipoAlvo.nome}"?`}
          onConfirmar={() => { deleteTipo(confirmarId); setConfirmarId(null); }}
          onCancelar={() => setConfirmarId(null)}
        />
      )}

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Conta</th>
              <th>Subconta</th>
              <th>Departamento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo) =>
              editandoId === tipo.id ? (
                <tr key={tipo.id} className={styles.linhaEditando}>
                  <td>
                    <input
                      className={styles.input}
                      value={editForm.nome}
                      onChange={(e) => setEditForm((p) => ({ ...p, nome: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      value={editForm.conta}
                      onChange={(e) => {
                        const conta = e.target.value;
                        setEditForm((p) => ({
                          ...p,
                          conta,
                          ...(conta.startsWith("4") && departamentoCampanha
                            ? { departamento: departamentoCampanha }
                            : {}),
                        }));
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      value={editForm.subconta}
                      onChange={(e) => setEditForm((p) => ({ ...p, subconta: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.input}
                      value={editForm.departamento}
                      onChange={(e) => setEditForm((p) => ({ ...p, departamento: e.target.value }))}
                    />
                  </td>
                  <td className={styles.acoes}>
                    <button className={styles.btnSalvar} onClick={salvarEdicao} type="button">Salvar</button>
                    <button className={styles.btnCancelar} onClick={() => setEditandoId(null)} type="button">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={tipo.id} className={styles.linha}>
                  <td className={styles.nomeCell}>{tipo.nome}</td>
                  <td>{tipo.conta || <span className={styles.nd}>—</span>}</td>
                  <td>{tipo.subconta || <span className={styles.nd}>—</span>}</td>
                  <td>{tipo.departamento || <span className={styles.nd}>—</span>}</td>
                  <td className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => iniciarEdicao(tipo)} type="button">Editar</button>
                    <button className={styles.btnExcluir} onClick={() => setConfirmarId(tipo.id)} type="button">Excluir</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.addForm}>
        <h3 className={styles.addTitulo}>Novo Tipo de Lançamento</h3>
        <div className={styles.addGrid}>
          <div className={styles.grupo}>
            <label className={styles.label}>Nome *</label>
            <input
              className={styles.input}
              placeholder="Nome do tipo"
              value={novoForm.nome}
              onChange={(e) => setNovoForm((p) => ({ ...p, nome: e.target.value }))}
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Conta *</label>
            <input
              className={styles.input}
              placeholder="Código da conta"
              value={novoForm.conta}
              onChange={(e) => {
                const conta = e.target.value;
                setNovoForm((p) => ({
                  ...p,
                  conta,
                  ...(conta.startsWith("4") && departamentoCampanha
                    ? { departamento: departamentoCampanha }
                    : {}),
                }));
              }}
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Subconta</label>
            <input
              className={styles.input}
              placeholder="Código da subconta (opcional)"
              value={novoForm.subconta}
              onChange={(e) => setNovoForm((p) => ({ ...p, subconta: e.target.value }))}
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Departamento *</label>
            <input
              className={styles.input}
              placeholder="Nome do departamento"
              value={novoForm.departamento}
              onChange={(e) => setNovoForm((p) => ({ ...p, departamento: e.target.value }))}
            />
          </div>
        </div>
        <button
          className={styles.btnAdicionar}
          onClick={handleAdd}
          disabled={!novoForm.nome.trim() || !novoForm.conta.trim() || !novoForm.departamento.trim()}
          type="button"
        >
          + Adicionar Tipo
        </button>
      </div>
    </div>
  );
}

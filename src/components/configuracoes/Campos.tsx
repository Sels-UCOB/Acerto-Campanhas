"use client";

import React, { useState } from "react";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { ConfirmDialog } from "./ConfirmDialog";
import type { Campo } from "@/types/configuracao";
import styles from "./Campos.module.css";

export function Campos() {
  const { campos, addCampo, updateCampo, deleteCampo } = useConfiguracao();
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nome: "", codigo: "" });
  const [novoForm, setNovoForm] = useState({ nome: "", codigo: "" });
  const [confirmarId, setConfirmarId] = useState<string | null>(null);

  const iniciarEdicao = (c: Campo) => {
    setEditandoId(c.id);
    setEditForm({ nome: c.nome, codigo: c.codigo });
  };

  const salvarEdicao = () => {
    if (!editandoId || !editForm.nome.trim() || !editForm.codigo.trim()) return;
    updateCampo(editandoId, editForm);
    setEditandoId(null);
  };

  const handleAdd = () => {
    if (!novoForm.nome.trim() || !novoForm.codigo.trim()) return;
    addCampo(novoForm);
    setNovoForm({ nome: "", codigo: "" });
  };

  const campoAlvo = campos.find((c) => c.id === confirmarId);

  return (
    <div className={styles.container}>
      {confirmarId && campoAlvo && (
        <ConfirmDialog
          mensagem={`Deseja excluir o campo "${campoAlvo.nome}"?`}
          onConfirmar={() => { deleteCampo(confirmarId); setConfirmarId(null); }}
          onCancelar={() => setConfirmarId(null)}
        />
      )}

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {campos.map((campo) =>
              editandoId === campo.id ? (
                <tr key={campo.id} className={styles.linhaEditando}>
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
                      value={editForm.codigo}
                      onChange={(e) => setEditForm((p) => ({ ...p, codigo: e.target.value }))}
                    />
                  </td>
                  <td className={styles.acoes}>
                    <button className={styles.btnSalvar} onClick={salvarEdicao} type="button">Salvar</button>
                    <button className={styles.btnCancelar} onClick={() => setEditandoId(null)} type="button">Cancelar</button>
                  </td>
                </tr>
              ) : (
                <tr key={campo.id} className={styles.linha}>
                  <td className={styles.nomeCell}>{campo.nome}</td>
                  <td>
                    {campo.codigo ? (
                      <code className={styles.codigo}>{campo.codigo}</code>
                    ) : (
                      <span className={styles.nd}>—</span>
                    )}
                  </td>
                  <td className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => iniciarEdicao(campo)} type="button">Editar</button>
                    <button className={styles.btnExcluir} onClick={() => setConfirmarId(campo.id)} type="button">Excluir</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.addForm}>
        <h3 className={styles.addTitulo}>Novo Campo</h3>
        <div className={styles.addGrid}>
          <div className={styles.grupo}>
            <label className={styles.label}>Nome *</label>
            <input
              className={styles.input}
              placeholder="Ex: ACN"
              value={novoForm.nome}
              onChange={(e) => setNovoForm((p) => ({ ...p, nome: e.target.value }))}
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Código *</label>
            <input
              className={styles.input}
              placeholder="Código do campo"
              value={novoForm.codigo}
              onChange={(e) => setNovoForm((p) => ({ ...p, codigo: e.target.value }))}
            />
          </div>
        </div>
        <button
          className={styles.btnAdicionar}
          onClick={handleAdd}
          disabled={!novoForm.nome.trim() || !novoForm.codigo.trim()}
          type="button"
        >
          + Adicionar Campo
        </button>
      </div>
    </div>
  );
}

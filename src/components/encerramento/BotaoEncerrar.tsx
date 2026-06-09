"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAcertosManagerOptional } from "@/context/AcertosManagerContext";

export function BotaoEncerrar() {
  const manager = useAcertosManagerOptional();
  const [flash, setFlash] = useState(false);

  if (!manager) return null;
  const { activeId, activeAcerto, closeAcerto } = manager;
  if (!activeId || !activeAcerto) return null;

  if (activeAcerto.status === "Encerrado") {
    const dt = activeAcerto.dataEncerramento
      ? new Date(activeAcerto.dataEncerramento).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "";
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>Encerrado em {dt}</span>
      </div>
    );
  }

  const handleEncerrar = () => {
    closeAcerto(activeId);
    setFlash(true);
    setTimeout(() => setFlash(false), 4000);
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500/15 text-green-400 hover:bg-green-500/25 border border-green-500/20 transition-colors" onClick={handleEncerrar}>
        Encerrar Acerto
      </button>
      {flash && <span className="text-sm text-green-400">✔ Acerto encerrado!</span>}
    </div>
  );
}

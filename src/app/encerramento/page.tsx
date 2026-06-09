"use client";

import React from "react";
import { ResumoCampanha } from "@/components/encerramento/ResumoCampanha";
import { ResumoLideresTabela } from "@/components/encerramento/ResumoLideresTabela";
import { DiferencaCaixa } from "@/components/encerramento/DiferencaCaixa";
import { BotaoGerarCSV } from "@/components/encerramento/BotaoGerarCSV";
import { BotoesExportarPDF } from "@/components/encerramento/BotoesExportarPDF";
import { BotaoEncerrar } from "@/components/encerramento/BotaoEncerrar";

export default function EncerramentoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl tracking-tight text-white">Encerramento</h1>
          <p className="text-sm text-[#8B8FA8] mt-1">Resumo final, exportação e fechamento da campanha.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BotaoEncerrar />
          <BotaoGerarCSV />
          <BotoesExportarPDF />
        </div>
      </div>

      <div className="space-y-6">
        <ResumoCampanha />
        <ResumoLideresTabela />
        <DiferencaCaixa />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  label?: string;
}

export function ReportExportButton({
  data,
  filename,
  label = "Exporter CSV",
}: ReportExportButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    // Extraire les en-têtes
    const headers = Object.keys(data[0]);

    // Créer les lignes CSV
    const csvRows = [
      headers.join(","), // En-tête
      ...data.map((row) =>
        headers
          .map((header) => {
            const val = row[header];
            // Gérer les virgules et les guillemets dans les valeurs
            const stringVal =
              val === null || val === undefined ? "" : String(val);
            return `"${stringVal.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      className="flex items-center gap-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
      disabled={!data || data.length === 0}
    >
      <Download className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
}

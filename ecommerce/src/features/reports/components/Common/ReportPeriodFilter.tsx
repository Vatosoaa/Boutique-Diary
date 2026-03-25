"use client";

import React from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Period = "7d" | "30d" | "90d" | "this_month" | "last_month" | "all";

interface ReportPeriodFilterProps {
  onPeriodChange: (startDate: Date, endDate: Date) => void;
  defaultPeriod?: Period;
}

export function ReportPeriodFilter({
  onPeriodChange,
  defaultPeriod = "30d",
}: ReportPeriodFilterProps) {
  const handleValueChange = (value: Period) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (value) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(endDate.getDate() - 90);
        break;
      case "this_month":
        startDate.setDate(1);
        break;
      case "last_month":
        startDate.setMonth(endDate.getMonth() - 1);
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth());
        endDate.setDate(0); // Dernier jour du mois précédent
        break;
      case "all":
        startDate.setFullYear(2000); // Date lointaine
        break;
    }

    onPeriodChange(startDate, endDate);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-gray-500" />
      <Select
        defaultValue={defaultPeriod}
        onValueChange={v => handleValueChange(v as Period)}
      >
        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <SelectValue placeholder="Sélectionner une période" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">7 derniers jours</SelectItem>
          <SelectItem value="30d">30 derniers jours</SelectItem>
          <SelectItem value="90d">90 derniers jours</SelectItem>
          <SelectItem value="this_month">Ce mois</SelectItem>
          <SelectItem value="last_month">Mois dernier</SelectItem>
          <SelectItem value="all">Tout</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

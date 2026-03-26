import React from "react";
import { CustomerMetric } from "../../types/customers";
import { KpiCard } from "../SalesReports/KpiCards";
import { Users, UserPlus, UserCheck, RefreshCw } from "lucide-react";

interface CustomerMetricsCardsProps {
  metrics: CustomerMetric;
  recentSignups?: { date: string; count: number }[];
}

export function CustomerMetricsCards({
  metrics,
  recentSignups = [],
}: CustomerMetricsCardsProps) {
  const newCustomersChartData = recentSignups.map(d => ({ value: d.count }));

  const customersChartData: { value: number }[] = [];
  const activeChartData: { value: number }[] = [];
  const retentionChartData: { value: number }[] = [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total Clients"
        value={metrics.totalCustomers.toLocaleString()}
        icon={Users}
        subValue="Base client totale"
        chartData={customersChartData}
        color="#3b82f6"
      />
      <KpiCard
        title="Nouveaux Clients"
        value={metrics.newCustomers.toLocaleString()}
        icon={UserPlus}
        trend="neutral"
        subValue="Période sélectionnée"
        chartData={newCustomersChartData}
        chartType="bar"
        color="#10b981"
      />
      <KpiCard
        title="Clients Actifs"
        value={metrics.activeCustomers.toLocaleString()}
        icon={UserCheck}
        trend="neutral"
        subValue="Compte non bloqué"
        chartData={activeChartData}
        color="#f59e0b"
      />
      <KpiCard
        title="Taux de Réachat"
        value={`${metrics.repeatPurchaseRate}%`}
        icon={RefreshCw}
        trend="neutral"
        subValue="Clients fidèles"
        chartData={retentionChartData}
        color="#8b5cf6"
      />
    </div>
  );
}

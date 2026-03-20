"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { useFetchSalesData } from "@/features/reports/hooks/use-fetch-sales-data";
import { KpiCard } from "@/features/reports/components/SalesReports/KpiCards";
import { RevenueChart } from "@/features/reports/components/SalesReports/RevenueChart";
import { ReportPeriodFilter } from "@/features/reports/components/Common/ReportPeriodFilter";
import { ReportExportButton } from "@/features/reports/components/Common/ReportExportButton";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesReportsPage() {
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  const { data, loading, error } = useFetchSalesData(
    dateRange.start,
    dateRange.end,
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Erreur
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  const { summary, chartData: rawChartData } = data || {
    summary: null,
    chartData: [],
  };

  const revenueChartData = (rawChartData || []).map((d) => ({
    value: d.amount,
  }));
  const ordersChartData = (rawChartData || []).map((d) => ({
    value: d.orders,
  }));
  const aovChartData = (rawChartData || []).map((d) => ({ value: d.aov }));
  const conversionChartData = (rawChartData || []).map((d) => ({
    value: d.conversionRate,
  }));

  const handlePeriodChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Rapports des Ventes"
          description="Analysez les performances financières et les tendances de vente."
        />
        <div className="flex items-center gap-3">
          <ReportExportButton
            data={rawChartData as unknown as Record<string, unknown>[]}
            filename="rapport_ventes"
          />
          <ReportPeriodFilter onPeriodChange={handlePeriodChange} />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Revenu Total"
          value={new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MGA",
            maximumFractionDigits: 0,
          }).format(summary?.totalRevenue || 0)}
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          subValue="vs. mois dernier"
          chartData={revenueChartData}
          color="#10b981"
        />
        <KpiCard
          title="Commandes"
          value={(summary?.totalOrders || 0).toString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="+5.2%"
          chartData={ordersChartData}
          chartType="bar"
          color="#3b82f6"
        />
        <KpiCard
          title="Panier Moyen"
          value={new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MGA",
            maximumFractionDigits: 0,
          }).format(summary?.averageOrderValue || 0)}
          icon={TrendingUp}
          trend="down"
          trendValue="-2.1%"
          chartData={aovChartData}
          color="#f59e0b"
        />
        <KpiCard
          title="Taux de Conversion"
          value={`${summary?.conversionRate || 0}%`}
          icon={TrendingUp}
          trend="neutral"
          subValue="Commandes Payées vs Total"
          chartData={conversionChartData}
          color="#8b5cf6"
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-100 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Évolution du Revenu</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <RevenueChart data={rawChartData} />
          </CardContent>
        </Card>

        {}
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-100 dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Statut des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(summary?.statusBreakdown || {}).map(
                ([status, count]) => {
                  const total = summary?.totalOrders || 1;
                  const percentage = Math.round(
                    ((count as number) / total) * 100,
                  );

                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {status}
                        </span>
                        <span className="text-gray-500">
                          {count as number} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                },
              )}
              {Object.keys(summary?.statusBreakdown || {}).length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <p>Aucune commande sur cette période.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

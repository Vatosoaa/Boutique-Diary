"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export interface MetricData {
  value: number;
  trend: number;
  sparkline: number[];
}

interface OrdersStatsProps {
  metrics: {
    total: MetricData;
    completed: MetricData;
    pending: MetricData;
    cancelled: MetricData;
  } | null;
  loading?: boolean;
}

export function OrdersStats({ metrics, loading }: OrdersStatsProps) {
  const statCards = [
    {
      label: "Commandes du mois",
      value: metrics?.total.value ?? 0,
      trend: metrics?.total.trend ?? 0,
      sparklineData: metrics?.total.sparkline ?? Array(14).fill(0),
      icon: ShoppingCart,
      color: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500/10 text-blue-500",
      chartColor: "#3b82f6",
    },
    {
      label: "Terminées (mois)",
      value: metrics?.completed.value ?? 0,
      trend: metrics?.completed.trend ?? 0,
      sparklineData: metrics?.completed.sparkline ?? Array(14).fill(0),
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-500",
      chartColor: "#10b981",
    },
    {
      label: "En attente",
      value: metrics?.pending.value ?? 0,
      trend: metrics?.pending.trend ?? 0,
      sparklineData: metrics?.pending.sparkline ?? Array(14).fill(0),
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10 text-amber-500",
      chartColor: "#f59e0b",
    },
    {
      label: "Annulées",
      value: metrics?.cancelled.value ?? 0,
      trend: metrics?.cancelled.trend ?? 0,
      sparklineData: metrics?.cancelled.sparkline ?? Array(14).fill(0),
      icon: XCircle,
      color: "from-rose-500 to-red-600",
      iconBg: "bg-rose-500/10 text-rose-500",
      chartColor: "#ef4444",
    },
  ];

  const Sparkline = ({ color, data }: { color: string; data: number[] }) => {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data, 1);
    const w = 80;
    const h = 20;

    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = 24 - (val / max) * h;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={w} height="24" className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const isPositiveTrend = stat.trend > 0;

        return (
          <Card
            key={index}
            className="relative overflow-hidden border-none shadow-sm bg-gray-100 dark:bg-gray-800 hover:translate-y-[-1px] transition-all duration-300 group border border-gray-100 dark:border-gray-700/50 py-6"
          >
            {}
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.06] dark:opacity-[0.10] blur-2xl rounded-bl-full -mr-5 -mt-5 transition-transform group-hover:scale-105`}
            />

            <CardContent className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex flex-col justify-between h-full space-y-2">
                  <div className="space-y-1">
                    <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate max-w-[120px]">
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {loading ? "..." : stat.value.toLocaleString()}
                      </h3>
                      <div
                        className={`flex items-center gap-0.5 text-[11px] font-bold ${
                          isPositiveTrend ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {isPositiveTrend ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(stat.trend)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                    Ce mois-ci
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Sparkline
                    color={stat.chartColor}
                    data={stat.sparklineData}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default OrdersStats;

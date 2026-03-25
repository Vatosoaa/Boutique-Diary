"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface RevenueChartProps {
  data?: { name: string; value: number }[];
}

const defaultData = [
  { name: "Jan", value: 100 },
  { name: "Feb", value: 120 },
  { name: "Mar", value: 90 },
  { name: "Apr", value: 180 },
  { name: "May", value: 150 },
  { name: "Jun", value: 160 },
  { name: "Jul", value: 140 },
  { name: "Aug", value: 130 },
  { name: "Sep", value: 200 },
];

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <Card className="border-none shadow-sm h-full bg-[#1e293b] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-white">
          Performance des ventes
        </CardTitle>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-pink-100 text-pink-600 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors dark:bg-pink-900/30 dark:text-pink-400">
          <Calendar className="w-4 h-4" />
          Cette semaine
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#334155"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={value =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderRadius: "8px",
                  border: "1px solid #334155",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  color: "#fff",
                }}
                itemStyle={{ color: "#ec4899" }}
                formatter={(value: number) => [
                  `${value.toLocaleString()} Ar`,
                  "Ventes",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ec4899"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

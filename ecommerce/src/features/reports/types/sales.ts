export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  statusBreakdown?: Record<string, number>;
}

export interface SalesChartDataPoint {
  date: string;
  amount: number;
  orders: number;
  aov: number;
  conversionRate?: number;
}

export interface SalesReportResponse {
  summary: SalesSummary;
  chartData: SalesChartDataPoint[];
}

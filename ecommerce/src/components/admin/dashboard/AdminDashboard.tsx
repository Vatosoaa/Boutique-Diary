import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import StatsCard from "./StatsCard";
import RevenueChart from "./RevenueChart";
import ProductDistributionChart from "./ProductDistributionChart";
import StockDistributionChart from "./StockDistributionChart";
import RecentPages from "./RecentPages";
import { PageHeader } from "@/components/admin/PageHeader";
import { CheckCircle, Package, TrendingUp, MessageSquare } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AdminDashboardProps {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
  };
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const { data: fetchedStats, isLoading: loading } = useSWR(
    "/api/admin/stats",
    fetcher,
  );

  const stats = fetchedStats || {
    totalProducts: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalOrders: 0,
    categoryDistribution: [],
    totalReviews: 0,
    salesPerformance: [],
  };

  return (
    <div className="min-h-screen font-sans">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>Bienvenue {user.username}</span>
            <span className="text-2xl">👋</span>
          </div>
        }
        description="Tableau de bord administrateur"
      />

      {}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-5 text-white shadow-sm flex flex-col justify-between h-[150px] border border-white/10">
          <div className="p-2.5 bg-gray-100/20 rounded-lg w-fit">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]">
              Valeur du Stock
            </p>
            <h3 className="text-xl sm:text-3xl font-bold mt-1 break-all">
              {loading ? "..." : formatPrice(stats.totalStockValue)}
            </h3>
          </div>
        </div>

        {}
        <div className="h-[150px]">
          <StatsCard
            title="Total Produits"
            value={loading ? "..." : stats.totalProducts.toString()}
            icon={Package}
            color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            percentage={0}
          />
        </div>

        {}
        <div className="h-[150px]">
          <StatsCard
            title="En Stock"
            value={
              loading
                ? "..."
                : (stats.totalProducts - stats.outOfStockCount).toString()
            }
            icon={CheckCircle}
            color="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
            percentage={0}
          />
        </div>

        {}
        <div className="h-[150px]">
          <StatsCard
            title="Avis Clients"
            value={loading ? "..." : stats.totalReviews.toString()}
            icon={MessageSquare}
            color="bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
            percentage={0}
          />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.salesPerformance} />
        </div>
        <div className="lg:col-span-1">
          <ProductDistributionChart data={stats.categoryDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <RecentPages />
        </div>
        <div className="lg:col-span-1 h-[400px]">
          <StockDistributionChart data={stats.categoryDistribution} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MousePointer, ExternalLink, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface PageStat {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
  status: "Published" | "Draft";
  type: string;
}

const RecentPages: React.FC = () => {
  const [pages, setPages] = useState<PageStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPages = async () => {
      try {
        const response = await fetch("/api/admin/recent-pages");
        if (response.ok) {
          const data = await response.json();
          setPages(data);
        }
      } catch (error) {
        console.error("Failed to fetch recent pages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPages();
  }, []);

  if (loading) {
    return (
      <Card className="border-none shadow-sm h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
            Pages récentes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
          Pages récentes
        </CardTitle>
        <Link
          href="/admin/products"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
        >
          Voir tout
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-y-auto custom-scrollbar">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {pages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune activité récente.
            </div>
          ) : (
            pages.map(page => (
              <Link
                key={page.id}
                href={page.url}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
              >
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <MousePointer className="w-5 h-5 text-indigo-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                      {page.title}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                      {page.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-[11px] text-gray-400 dark:text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      Modifier{" "}
                      {formatDistanceToNow(new Date(page.updatedAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          page.status === "Published"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span className="text-[11px] font-medium text-gray-500">
                        {page.status === "Published" ? "Publié" : "Brouillon"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <ExternalLink className="w-4 h-4 text-indigo-500" />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentPages;

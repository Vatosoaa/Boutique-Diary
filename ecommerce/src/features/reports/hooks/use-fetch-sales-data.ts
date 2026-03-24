import { useState, useEffect } from "react";
import { SalesReportResponse } from "../types/sales";

interface FetchState {
  data: SalesReportResponse | null;
  loading: boolean;
  error: string | null;
}

export function useFetchSalesData(startDate?: Date, endDate?: Date) {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams();
        if (startDate) params.set("startDate", startDate.toISOString());
        if (endDate) params.set("endDate", endDate.toISOString());

        const url = `/api/admin/reports/sales${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const jsonData = await res.json();
        setState({ data: jsonData, loading: false, error: null });
      } catch (err: unknown) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Une erreur est survenue",
        });
      }
    }

    fetchData();
  }, [startDate, endDate]);

  return state;
}

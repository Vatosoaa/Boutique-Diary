import { useState, useEffect } from "react";
import { CustomerReportResponse } from "../types/customers";

interface FetchState {
  data: CustomerReportResponse | null;
  loading: boolean;
  error: string | null;
}

export function useFetchCustomerReports(startDate?: Date, endDate?: Date) {
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

        const url = `/api/admin/reports/customers${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des données clients");
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

/**
 * Global fetcher util for SWR.
 * Automatically throws an error with response payload if status is not OK.
 */
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");

    try {
      // Attach extra info to the error object.
      const info = await res.json();
      Object.assign(error, { info });
    } catch {
      const info = await res.text();
      Object.assign(error, { info });
    }

    Object.assign(error, { status: res.status });
    throw error;
  }

  return res.json();
};

export const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url);

  if (!res.ok) {
    const error: Error & { info?: any; status?: number } = new Error(
      "An error occurred while fetching the data."
    );

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const getPostFunction = (url: string) => async (args: any[]) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  return response.json();
};

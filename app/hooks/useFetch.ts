import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

export default function useFetch<T>({
  url,
  requireToken,
  body,
  method,
  autoFetch,
  refetch,
  requireCache,
  cacheExpire,
}: {
  url: string;
  requireToken: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  method: "GET" | "PUT" | "POST" | "DELETE";
  autoFetch: boolean;
  refetch: boolean;
  requireCache: boolean;
  cacheExpire?: number;
}) {
  const { token, revoke, error: authErr } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const router = useRouter();
  const [revokeIsSuccess, setRevokeSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any | null>(null);

  const execute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async ({ body }: { body?: any }) => {
      if (requireToken && !token) {
        if (authErr) router.push("/SignUp");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const header: any =
        body instanceof FormData ? {} : { "Content-type": "application/json" };
      if (requireToken) header["Authorization"] = `Bearer ${token}`;
      try {
        const response = await fetch(url, {
          method,
          body,
          headers: header,
          cache: requireCache ? "force-cache" : "no-cache",
          next: { revalidate: cacheExpire ? cacheExpire : false },
        });
        if (response.ok) {
          const data = await response.json();
          setData(data);
          return data;
        }
        throw new Error(response.status.toString());
      } catch (err) {
        const error = err as Error;
        if (error.message === "401") {
          const response = await fetch(
            "http://localhost:3001/api/Auth/revokeToken",
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              credentials: "include",
            },
          );
          if (response.ok) {
            const body = await response.json();
            revoke({ accessToken: body.accessToken });

            setRevokeSuccess(true);
            return;
          }
          setError(response.status.toString());
        }
      }
    },
    [authErr, method, requireToken, revoke, router, token, url],
  );

  useEffect(() => {
    if (autoFetch) {
      execute({ body });
    }
  }, [autoFetch, body, execute]);

  useEffect(() => {
    if (revokeIsSuccess) {
      const executeBody = JSON.stringify({ Points: body });
      execute({ body: executeBody });
      setRevokeSuccess(false);
    }
  }, [body, execute, revokeIsSuccess]);

  return {
    data,
    error,
    execute,
    refetch: () => execute({ body }),
  };
}

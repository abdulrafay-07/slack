import { useCallback, useMemo, useState } from "react";

import { useMutation } from "convex/react";
import { FunctionReference } from "convex/server";

type MutationOptions<ResponseType> = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useMutationHelper<
  RequestType,
  ResponseType,
  Name extends FunctionReference<"mutation", "public", any, any, any>
>(mutationName: Name) {
  const mutation = useMutation(mutationName);

  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending" | null>(null);

  const isPending = useMemo(() => state === "pending", [state]);
  const hasSucceeded = useMemo(() => state === "success", [state]);
  const hasError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);

  const mutate = useCallback(
    async (values: RequestType, options?: MutationOptions<ResponseType>) => {
      try {
        setData(null);
        setError(null);
        setState("pending");

        const response = await mutation(values);
        setData(response);
        setState("success");
        options?.onSuccess?.(response);

        return response;
      } catch (error) {
        setError(error as Error);
        setState("error");
        options?.onError?.(error as Error);

        if (options?.throwError) throw error;
      } finally {
        setState("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    data,
    error,
    isPending,
    hasSucceeded,
    hasError,
    isSettled,
  };
}

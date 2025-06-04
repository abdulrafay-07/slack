import { useCallback, useMemo, useState } from "react";

import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type ResponseType = Id<"reactions"> | null;
type RequestType = {
  value: string;
  messageId: Id<"messages">;
};
type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useToggleReaction = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [state, setState] = useState<"success" | "error" | "settled" | "pending"| null>(null);

  const isPending = useMemo(() => state === "pending", [state]);
  const hasSucceeded = useMemo(() => state === "success", [state]);
  const hasError = useMemo(() => state === "error", [state]);
  const isSettled = useMemo(() => state === "settled", [state]);
  
  const mutation = useMutation(api.reactions.toggle);

  const mutate = useCallback(async (values: RequestType, options?: Options) => {
    try {
      // reset states
      setData(null);
      setError(null);

      setState("pending");

      const response = await mutation(values);
      setState("success");
      options?.onSuccess?.(response);

      return response;
    } catch (error) {
      setState("error");
      options?.onError?.(error as Error);

      if (options?.throwError) throw error;
    } finally {
      setState("settled");
      options?.onSettled?.();
    };
  }, [mutation]);

  return {
    mutate,
    data,
    error,
    isPending,
    hasSucceeded,
    hasError,
    isSettled,
  };
};

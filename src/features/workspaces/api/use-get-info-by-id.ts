import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetWorkspaceProps {
  id: Id<"workspaces">;
};

export const useGetInfoById = ({ id }: useGetWorkspaceProps) => {
  const data = useQuery(api.workspaces.getInfoById, { id });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};

"use client"

import { useEffect, useState } from "react";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { Conversation } from "@/app/workspace/[workspaceId]/member/[memberId]/conversation";

import { toast } from "sonner";
import { Loader, TriangleAlert } from "lucide-react";

import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

export default function MemberIdPage() {
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutationHelper(api.conversations.createOrGet);

  useEffect(() => {
    mutate({
      workspaceId,
      memberId,
    }, {
      onSuccess: (data) => {
        setConversationId(data as Id<"conversations">);
      },
      onError: (error) => {
        toast.error("Failed to load the conversation")
      },
    });
  }, [workspaceId, memberId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  };

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No conversation found</p>
      </div>
    )
  };

  return <Conversation id={conversationId} />
};

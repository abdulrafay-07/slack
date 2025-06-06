import { useMemberId } from "@/hooks/use-member-id";

import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

import { Header } from "@/app/workspace/[workspaceId]/member/[memberId]/header";
import { ChatInput } from "@/app/workspace/[workspaceId]/member/[memberId]/chat-input";

import { MessageList } from "@/components/message-list";
import { Loader } from "lucide-react";

import { Id } from "../../../../../../convex/_generated/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
};

export const Conversation = ({
  id,
}: ConversationProps) => {
  const memberId = useMemberId();

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  const isLoading = memberLoading;

  if (isLoading || status === "LoadingFirstPage") {
      return (
        <div className="h-full flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      )
    };

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
      <MessageList
        data={results}
        variant="conversation"
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        memberName={member?.user.name}
        memberImage={member?.user.image}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  )
};

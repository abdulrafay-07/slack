import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetMessage } from "@/features/messages/api/use-get-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, X } from "lucide-react";

import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
};

export const Thread = ({
  messageId,
  onClose
}: ThreadProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: currentMemberLoading } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: messageLoading } = useGetMessage({ id: messageId });

  const isLoading = messageLoading || currentMemberLoading;

  if (isLoading) {
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button
            size="iconSm"
            variant="ghost"
            onClick={onClose}
          >
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
  };

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button
            size="iconSm"
            variant="ghost"
            onClick={onClose}
          >
            <X className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No message found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-[49px] px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button
          size="iconSm"
          variant="ghost"
          onClick={onClose}
        >
          <X className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="mt-4">
        <Message
          hideThreadButton
          body={message.body}
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  )
};

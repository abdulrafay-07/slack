import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import Quill from "quill";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateMessage } from "@/features/messages/api/use-create-message";

import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
};

export const ChatInput = ({
  placeholder,
}: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: createMessage, isPending: creatingMessage } = useCreateMessage();

  const isPending = creatingMessage;

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      await createMessage({
        workspaceId,
        channelId,
        body,
      }, { throwError: true });
  
      // reset the input
      setEditorKey(prevKey => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send a message");
    };
  };

  return (
    <div className="px-4 w-full">
      <Editor
        key={editorKey}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  )
};

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import Quill from "quill";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { Id } from "../../../../../../convex/_generated/dataModel";

import { toast } from "sonner";

import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../../../../../convex/_generated/api";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage">;
};

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

  const { mutate: generateUploadurl, isPending: generatingUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage, isPending: creatingMessage } = useMutationHelper(api.messages.create);

  const isPending = creatingMessage || generatingUploadUrl;

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadurl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();

        values.image = storageId;
      };

      await createMessage(values, { throwError: true });
  
      // reset the input
      setEditorKey(prevKey => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send a message");
    } finally {
      editorRef?.current?.enable(true);
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

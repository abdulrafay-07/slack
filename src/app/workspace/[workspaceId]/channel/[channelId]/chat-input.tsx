import { useRef } from "react";
import dynamic from "next/dynamic";

import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
};

export const ChatInput = ({
  placeholder,
}: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-4 w-full">
      <Editor
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
        placeholder={placeholder}
      />
    </div>
  )
};

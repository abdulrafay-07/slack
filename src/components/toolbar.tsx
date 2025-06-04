import { Hint } from "@/components/hint";
import { EmojiPopover } from "@/components/emoji-popover";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
};

export const Toolbar = ({
  handleDelete,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
  isAuthor,
  isPending,
}: ToolbarProps) => {
  return (
    <div className="absolute -top-4 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reactions"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button
            size="iconSm"
            variant="ghost"
            disabled={isPending}
          >
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
            >
              <MessageSquareText className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              size="iconSm"
              variant="ghost"
              disabled={isPending}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  )
};

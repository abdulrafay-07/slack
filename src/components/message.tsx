import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

import { format, isToday, isYesterday } from "date-fns";

import { Doc, Id } from "../../convex/_generated/dataModel";

import { usePanel } from "@/hooks/use-panel";
import { useConfirm } from "@/hooks/use-confirm";

import { toast } from "sonner";
import { Hint } from "@/components/hint";
import { Toolbar } from "@/components/toolbar";
import { Thumbnail } from "@/components/thumbnail";
import { Reactions } from "@/components/reactions";
import { ThreadBar } from "@/components/thread-bar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../convex/_generated/api";

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
    count: number;
    memberIds: Id<"members">[];
  }>;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
};

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  body,
  createdAt,
  image,
  isEditing,
  reactions,
  setEditingId,
  updatedAt,
  hideThreadButton,
  isCompact,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onCloseMessage } = usePanel();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete the message permanently.",
  );

  const { mutate: updateMessage, isPending: updatingMessage } = useMutationHelper(api.messages.update);
  const { mutate: deleteMessage, isPending: deletingMessage } = useMutationHelper(api.messages.remove);
  const { mutate: toggleReaction, isPending: togglingReaction } = useMutationHelper(api.reactions.toggle);

  const isPending = updatingMessage || deletingMessage || togglingReaction;

  const avatarFallback = authorName.charAt(0).toUpperCase();

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage({ id, body }, {
      onSuccess: () => {
        toast.success("Message updated");
        setEditingId(null);
      },
      onError: () => {
        toast.error("Failed to update the message");
      },
    });
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteMessage({ id }, {
      onSuccess: () => {
        toast.success("Message deleted");

        if (parentMessageId === id) onCloseMessage();
      },
      onError: () => {
        toast.error("Failed to delete the message");
      },
    })
  };

  const handleReaction = (value: string) => {
    toggleReaction({ messageId: id, value }, {
      onError: () => {
        toast.error("Failed to toggle the reaction");
      },
    });
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            deletingMessage && "bg-[#B04A4A]/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="size-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
                <Reactions
                  data={reactions}
                  onChange={handleReaction}
                />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  name={threadName}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    )
  };

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          deletingMessage && "bg-[#B04A4A]/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar className="rounded-md">
              <AvatarImage src={authorImage} />
              <AvatarFallback className="rounded-md bg-teal-800 text-white">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="size-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  className="font-bold text-primary/90 hover:underline"
                  onClick={() => {}}
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
              <Reactions
                data={reactions}
                onChange={handleReaction}
              />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                name={threadName}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  )
};

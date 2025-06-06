import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useConfirm } from "@/hooks/use-confirm";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCurrentMember } from "@/features/members/api/use-current-member";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../../../../../convex/_generated/api";

interface HeaderProps {
  channelName: string;
};

export const Header = ({
  channelName,
}: HeaderProps) => {
  const [value, setValue] = useState(channelName);
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this channel. This action is irreversible and will delete all the messages"
  );

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updatingChannel } = useMutationHelper(api.channels.update);
  const { mutate: deleteChannel, isPending: deletingChannel } = useMutationHelper(api.channels.remove);

  const handleOpen = (value: boolean) => {
    if (member?.role !== "admin") return;

    setOpenEdit(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteChannel({ id: channelId }, {
      onSuccess: () => {
        toast.success("Channel deleted");
        router.push(`/workspace/${workspaceId}`);
      },
      onError: () => {
        toast.error("Failed to delete the channel");
      },
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel({ id: channelId, name: value }, {
      onSuccess: () => {
        toast.success("Channel name updated");
        setOpenEdit(false);
      },
      onError: () => {
        toast.error("Failed to update the channel name");
      },
    });
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
          >
            <span className="truncate">
              # {channelName}
            </span>
            <FaChevronDown className="size-2.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>
              # {channelName}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={openEdit} onOpenChange={handleOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Channel name
                    </p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm">
                    # {channelName}
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Rename this channel
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    disabled={updatingChannel}
                    value={value}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={60}
                    placeholder="e.g. announcements"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        disabled={updatingChannel}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={updatingChannel}>
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={deletingChannel}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-[#B04A4A]"
              >
                <Trash className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
};

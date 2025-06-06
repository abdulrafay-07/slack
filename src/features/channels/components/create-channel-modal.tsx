import { useState } from "react";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../../../convex/_generated/api";

export const CreateChannelModal = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [open, setOpen] = useCreateChannelModal();
  
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useMutationHelper(api.channels.create);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({ name, workspaceId }, {
      onSuccess: (id) => {
        toast.success("Channel created");
        router.push(`/workspace/${workspaceId}/channel/${id}`);
        handleClose();
      },
      onError: () => {
        toast.error("Failed to create a channel");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a channel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={isPending}
            value={name}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={60}
            placeholder="e.g. announcements"
          />
          <div className="flex justify-end">
            <Button
              disabled={isPending}

            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
};

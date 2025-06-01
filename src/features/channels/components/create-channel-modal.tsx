import { useState } from "react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateChannel } from "@/features/channels/api/use-create-channel";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateChannelModal = () => {
  const [name, setName] = useState("");
  const [open, setOpen] = useCreateChannelModal();
  
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useCreateChannel();

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
      onSuccess: () => {
        // TODO: redirect to new channel
        handleClose();
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

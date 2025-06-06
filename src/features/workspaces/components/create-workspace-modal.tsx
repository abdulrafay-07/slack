import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../../../convex/_generated/api";

export const CreateWorkspaceModal = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useMutationHelper(api.workspaces.create);

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({ name }, {
      onSuccess: (data) => {
        toast.success("Workspace created!");
        
        router.push(`/workspace/${data}`);
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a workspace
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            maxLength={50}
            placeholder="Workspace name e.g. 'Work'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
};

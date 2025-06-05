import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCcw } from "lucide-react";

import { useMutationHelper } from "@/lib/mutation";

import { api } from "../../../../convex/_generated/api";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
};

export const InviteModal = ({
  open,
  setOpen,
  joinCode,
  name,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will remove the current invite code and generate the new one.",
  );

  const { mutate, isPending } = useMutationHelper(api.workspaces.newJoinCode);

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ workspaceId }, {
      onSuccess: () => {
        toast.success("Invite code regenerated");
      },
      onError: () => {
        toast.error("Failed to regenerate invite code");
      },
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite people to {name}
            </DialogTitle>
            <DialogDescription>
              Use the code below to invite people to the workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
            >
              Copy link
              <Copy className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              variant="outline"
              onClick={handleNewCode}
            >
              New code
              <RefreshCcw className="size-4" />
            </Button>
            <DialogClose asChild>
              <Button>
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
};

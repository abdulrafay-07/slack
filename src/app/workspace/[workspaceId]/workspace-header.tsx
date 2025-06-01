import { useState } from "react";

import { Doc } from "../../../../convex/_generated/dataModel";

import { InviteModal } from "@/app/workspace/[workspaceId]/invite-modal";
import { PreferencesModal } from "@/app/workspace/[workspaceId]/preferences-modal";

import { Hint } from "@/components/hint";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
};

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [openPreferences, setOpenPreferences] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);

  return (
    <>
      <InviteModal
        open={openInvite}
        setOpen={setOpenInvite}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={openPreferences}
        setOpen={setOpenPreferences}
        initialValue={workspace.name}
      />
      <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="transparent"
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
            >
              <span className="truncate">
                {workspace.name}
              </span>
              <ChevronDown className="size-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">
                  {workspace.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpenInvite(true)}
                  className="cursor-pointer py-2"
                >
                  Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenPreferences(true)}
                  className="cursor-pointer py-2"
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter conversations" side="bottom">
            <Button
              size="iconSm"
              variant="transparent"
            >
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New Message" side="bottom">
            <Button
              size="iconSm"
              variant="transparent"
            >
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  )
};

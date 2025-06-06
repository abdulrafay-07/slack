"use client"

import { usePanel } from "@/hooks/use-panel";

import { Toolbar } from "@/app/workspace/[workspaceId]/toolbar";
import { Sidebar } from "@/app/workspace/[workspaceId]/sidebar";
import { WorkspaceSidebar } from "@/app/workspace/[workspaceId]/workspace-sidebar";

import { Thread } from "@/features/messages/components/thread";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Loader } from "lucide-react";

import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
};

export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  const { parentMessageId, onCloseMessage } = usePanel();
  
  const showPanel = !!parentMessageId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="leo-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={50}
          >
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                minSize={20}
                defaultSize={29}
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
};

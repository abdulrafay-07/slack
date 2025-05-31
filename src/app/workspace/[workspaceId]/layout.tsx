"use client"

import { Toolbar } from "@/app/workspace/[workspaceId]/toolbar";
import { Sidebar } from "@/app/workspace/[workspaceId]/sidebar";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
};

export default function WorkspaceIdLayout({
  children,
}: WorkspaceIdLayoutProps) {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        {children}
      </div>
    </div>
  )
};

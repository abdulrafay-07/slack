"use client"

import { useChannelId } from "@/hooks/use-channel-id";

import { useGetChannel } from "@/features/channels/api/use-get-channel";

import { Header } from "@/app/workspace/[workspaceId]/channel/[channelId]/header";

import { Loader, TriangleAlert } from "lucide-react";

export default function ChannelIdPage() {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  const isLoading = channelLoading;

  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  };

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Channel not found
        </span>
      </div>
    )
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        channelName={channel.name}
      />
    </div>
  )
};

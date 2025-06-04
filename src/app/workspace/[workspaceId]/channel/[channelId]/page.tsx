"use client"

import { useChannelId } from "@/hooks/use-channel-id";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

import { Header } from "@/app/workspace/[workspaceId]/channel/[channelId]/header";
import { ChatInput } from "@/app/workspace/[workspaceId]/channel/[channelId]/chat-input";

import { MessageList } from "@/components/message-list";
import { Loader, TriangleAlert } from "lucide-react";

export default function ChannelIdPage() {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

  const isLoading = channelLoading;

  if (isLoading || status === "LoadingFirstPage") {
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
      <Header channelName={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Send a message in # ${channel.name}.`} />
    </div>
  )
};

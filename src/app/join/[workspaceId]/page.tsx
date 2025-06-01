"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useGetInfoById } from "@/features/workspaces/api/use-get-info-by-id";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import VerificationInput from "react-verification-input";

import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

export default function JoinWorkspaceIdPage() {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useGetInfoById({ id: workspaceId });
  const { mutate, isPending } = useJoinWorkspace();

  const isMember = useMemo(() => data?.isMember,[data?.isMember]);
  useEffect(() => {
    if (isMember) router.push(`/workspace/${workspaceId}`);
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate({ joinCode: value, workspaceId }, {
      onSuccess: (id) => {
        router.replace(`/workspace/${id}`);
        toast.success("Workspace joined");
      },
      onError: (error) => {
        toast.error("Failed to join workspace");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  };

  return !isMember && (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={60}
        height={60}
      />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">
            Join {data?.name}
          </h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
            character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black"
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className="flex gap-x-4">
        <Button
          asChild
          variant="outline"
        >
          <Link href="/">
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
};

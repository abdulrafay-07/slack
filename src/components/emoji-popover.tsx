import { useState } from "react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
};

export const EmojiPopover = ({
  children,
  onEmojiSelect,
  hint = "Emoji",
}: EmojiPopoverProps) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setOpenPopover(false);

    setTimeout(() => {
      setOpenTooltip(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <Tooltip open={openTooltip} onOpenChange={setOpenTooltip} delayDuration={50}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker
            data={data}
            onEmojiSelect={onSelect}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
};

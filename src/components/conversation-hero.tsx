import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";

interface ConversationHeroProps {
  name: string;
  image?: string;
};

export const ConversationHero = ({
  name,
  image,
}: ConversationHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 rounded-md mr-1">
          <AvatarImage src={image} />
          <AvatarFallback className="size-14 rounded-md bg-teal-800 text-white text-xl">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">
          {name}
        </p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation is just between you and <strong>{name}</strong>.
      </p>
    </div>
  )
};

import { useState } from "react";

import { useAuthActions } from "@convex-dev/auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AlertTriangle } from "lucide-react";

import { SignInFlow } from "@/features/auth/types";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
};

export const SignUpCard = ({
  setState,
}: SignUpCardProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const { signIn } = useAuthActions();

  const onCredsSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password != confirmPassword) {
      setError("Passwords do not match");
      return;
    };
    setPending(true);

    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => setError("Something went wrong."))
      .finally(() => setPending(false));
  };

  const onProvider = (value: "google" | "github") => {
    setPending(true);
    signIn(value)
      .finally(() => setPending(false));
  };

  return (
    <Card className="size-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          Sign up to continue
        </CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {error && (
        <div className="bg-[#B04A4A]/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-[#B04A4A] mb-6">
          <AlertTriangle className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredsSignUp} className="space-y-4">
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={pending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-4">
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => onProvider("google")}
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Continue with Google
          </Button>
          <Button
            size="lg"
            variant="outline"
            disabled={pending}
            onClick={() => onProvider("github")}
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account? <span onClick={() => setState("signIn")} className="text-primary hover:underline cursor-pointer">Sign in</span>
        </p>
      </CardContent>
    </Card>
  )
};

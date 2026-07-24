import { AuthUI } from "@/components/ui/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({ component: AuthPage });

export default function AuthPage() {
  return (
    <AuthUI
      onGoogleSignIn={async () => {
        authClient.signIn.social({ provider: "google", callbackURL: "/" });
      }}
    />
  );
}

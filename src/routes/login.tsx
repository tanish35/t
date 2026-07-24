import { AuthUI } from "@/components/ui/auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (session) {
      throw redirect({ to: "/projects" });
    }
  },
  component: AuthPage,
});

export default function AuthPage() {
  return (
    <AuthUI
      onGoogleSignIn={async () => {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/projects",
        });
      }}
    />
  );
}

import { auth } from "@/lib/auth";
import { getRequest } from "@tanstack/react-start/server";

export async function requireUser(request = getRequest()) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return session.user;
}

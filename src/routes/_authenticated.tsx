import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconLogout,
  IconLoader2,
  IconFolders,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const data = await auth.api.getSession({ headers: getRequestHeaders() });
    return data;
  },
);

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const data = await getUserSession();
    if (!data) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
        replace: true,
      });
    }
    return { session: data.session, user: data.user };
  },
  component: AuthenticatedRouteComponent,
});

function AuthenticatedRouteComponent() {
  const navigate = useNavigate();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Projects",
      href: "/projects",
      icon: (
        <IconFolders className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user } = Route.useRouteContext();
  return (
    <div
      className={cn(
        "mx-auto flex w-full ",
        "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <SidebarLink
              link={{
                label: user?.name || "User",
                href: "#",
                icon: (
                  <img
                    src={user?.image || "/default-avatar.png"}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
            <SidebarLink
              className="rounded-lg text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 [&>span]:text-red-600 dark:[&>span]:text-red-400"
              onClick={async (e) => {
                e.preventDefault();
                if (isSigningOut) return;
                setIsSigningOut(true);
                try {
                  const { error } = await authClient.signOut();
                  if (error) {
                    console.error("Error signing out:", error.message);
                    return;
                  }
                  await navigate({
                    to: "/login",
                    replace: true,
                  });
                } finally {
                  setIsSigningOut(false);
                }
              }}
              link={{
                label: isSigningOut ? "Logging out..." : "Logout",
                href: "#",
                icon: isSigningOut ? (
                  <IconLoader2 className="h-7 w-7 shrink-0 animate-spin p-1" />
                ) : (
                  <IconLogout className="h-7 w-7 shrink-0 p-1" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Outlet />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        ReplayForge
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

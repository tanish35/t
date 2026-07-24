import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

interface AuthUIProps {
  illustrationSrc?: string;
  onGoogleSignIn: () => void | Promise<void>;
}

export function AuthUI({
  illustrationSrc = "/login.gif",
  onGoogleSignIn,
}: AuthUIProps) {
  const [loading, setLoading] = useState(false);
  const isVideo = /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(illustrationSrc);

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      await onGoogleSignIn();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-24 sm:px-12">
          <div className="w-full max-w-[480px]">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to your account
              </h1>
              <p className="mt-4 text-base text-white/55">
                Continue securely with your Google account
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-4 rounded-2xl border border-white/10 bg-black text-base font-semibold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <IconLoader2 className="size-5 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
              {loading ? "Redirecting..." : "Continue with Google"}
            </button>
          </div>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden bg-black lg:block">
          {isVideo ? (
            <video
              src={illustrationSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={illustrationSrc}
              alt="Astronaut illustration"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="absolute inset-x-0 bottom-8 z-10 px-8 text-center">
            <blockquote className="text-xl font-semibold text-white xl:text-2xl">
              “Damn, why is she so demonic?”
            </blockquote>
            <p className="mt-4 text-base text-white/55">— Juice WRLD</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.64-2.36l-3.24-2.54c-.9.6-2.05.96-3.4.96-2.6 0-4.8-1.76-5.6-4.12H3.06v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.94A6 6 0 0 1 6.08 12c0-.67.12-1.33.32-1.94V7.44H3.06A10 10 0 0 0 2 12c0 1.62.39 3.15 1.06 4.56l3.34-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.8.5 3.84 1.5l2.88-2.88A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.94 5.44l3.34 2.62C7.2 7.7 9.4 5.94 12 5.94Z"
      />
    </svg>
  );
}

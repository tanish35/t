import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ArrowRight, Clapperboard, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

export interface HeroLandingProps {
  src?: string;
  poster?: string;
  playbackRate?: number;
  className?: string;
}

const NAV_LINKS = [
  { label: "About", to: "/about" as const, hash: undefined },
  { label: "Features", to: "/" as const, hash: "features" },
  { label: "Pricing", to: "/" as const, hash: "pricing" },
];

export function HeroLanding({
  src = "/homepage.mp4",
  poster = "/homepage-poster.jpg",
  playbackRate = 0.6,
  className,
}: HeroLandingProps) {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    let animationId = 0;

    const tick = () => {
      animationId = requestAnimationFrame(tick);
      const video = videoRef.current;
      if (!video || !video.duration || !progressRef.current) return;
      progressRef.current.style.transform = `scaleX(${
        video.currentTime / video.duration
      })`;
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      const visible = { y: 0, opacity: 1 };

      if (navRef.current) {
        timeline.fromTo(
          navRef.current,
          { y: -32, opacity: 0 },
          { ...visible, duration: 0.7 },
        );
      }
      if (headlineRef.current) {
        timeline.fromTo(
          headlineRef.current.querySelectorAll("[data-headline-line]"),
          { y: 48, opacity: 0 },
          { ...visible, duration: 0.9, stagger: 0.09 },
          "-=0.35",
        );
      }
      if (bodyRef.current) {
        timeline.fromTo(
          bodyRef.current,
          { y: 24, opacity: 0 },
          { ...visible, duration: 0.7 },
          "-=0.5",
        );
      }
      if (formRef.current) {
        timeline.fromTo(
          formRef.current,
          { y: 24, opacity: 0 },
          { ...visible, duration: 0.7 },
          "-=0.45",
        );
      }
      if (controlsRef.current) {
        timeline.fromTo(
          controlsRef.current,
          { y: 24, opacity: 0 },
          { ...visible, duration: 0.7 },
          "-=0.5",
        );
      }
    });

    return () => {
      context.revert();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate({ to: "/projects/new" });
  };

  return (
    <section
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-[#f7f8f6]",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Wash the artwork out toward the left so the ink text always has a
          light field under it, whatever frame is on screen. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(247,248,246,0.97)_0%,rgba(247,248,246,0.94)_34%,rgba(247,248,246,0.74)_54%,rgba(247,248,246,0.24)_76%,rgba(247,248,246,0)_93%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#f7f8f6]/85 to-transparent" />

      <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-8 sm:pt-7">
        <nav
          ref={navRef}
          className="mx-auto flex w-[min(80rem,100%)] items-center justify-between gap-4 rounded-full border border-white/70 bg-white/92 px-4 py-3 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-18px_rgba(16,18,16,0.35)] backdrop-blur-md sm:px-6"
        >
          <Link
            to="/"
            className="text-[1.35rem] font-extrabold tracking-[-0.02em] text-[#101210]"
          >
            replay
            <span className="text-[#2f8f4e]">forge</span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={link.hash}
                className="text-[0.95rem] font-medium text-[#565b56] transition-colors hover:text-[#101210]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full px-5 py-2.5 text-[0.92rem] font-medium text-[#565b56] transition-colors hover:bg-[rgba(16,18,16,0.06)] hover:text-[#101210]"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-[#1c1c1b] px-5 py-2.5 text-[0.92rem] font-semibold text-[#f7f8f6] transition-transform hover:-translate-y-px"
            >
              Start recording
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative z-10 mx-auto flex min-h-screen w-[min(80rem,92vw)] flex-col justify-center pt-32 pb-40">
        <h1
          ref={headlineRef}
          className="max-w-[16ch] text-[clamp(2.75rem,6.4vw,5.25rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-[#101210]"
        >
          <span data-headline-line className="block">
            Replay the bug,
          </span>
          <span data-headline-line className="block">
            skip the guesswork.
          </span>
        </h1>

        <p
          ref={bodyRef}
          className="mt-7 max-w-[46ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[#565b56]"
        >
          ReplayForge captures every click, console error and network call, then
          hands your team a shareable replay of exactly what happened. No more
          "works on my machine".
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-10 flex w-[min(34rem,100%)] items-center gap-3 rounded-full border border-white/70 bg-white/95 p-2 pl-5 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_22px_44px_-20px_rgba(16,18,16,0.4)] backdrop-blur-md"
        >
          <span className="flex shrink-0 items-center gap-2 text-[0.95rem] font-semibold text-[#101210]">
            <Clapperboard
              className="size-[1.15rem] text-[#2f8f4e]"
              aria-hidden="true"
            />
            My project
          </span>
          <span
            aria-hidden="true"
            className="h-6 w-px bg-[rgba(16,18,16,0.12)]"
          />
          <label htmlFor="project-name" className="sr-only">
            Project name
          </label>
          <input
            id="project-name"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Enter your project name"
            className="min-w-0 flex-1 bg-transparent text-[0.98rem] text-[#101210] placeholder:text-[#878c86] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Create project"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[#2f8f4e] text-white transition-transform hover:scale-105"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>

      <div
        ref={controlsRef}
        className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-5 px-6 pb-7 sm:px-10 sm:pb-9"
      >
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={
            isPlaying ? "Pause background video" : "Play background video"
          }
          className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-[#101210] shadow-[0_18px_36px_-16px_rgba(16,18,16,0.5)] transition-transform hover:scale-105 sm:size-16"
        >
          {isPlaying ? (
            <Pause className="size-5 fill-current" aria-hidden="true" />
          ) : (
            <Play className="size-5 fill-current" aria-hidden="true" />
          )}
        </button>

        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70">
          <div
            ref={progressRef}
            className="h-full origin-left scale-x-0 rounded-full bg-[#2f8f4e]"
          />
        </div>
      </div>
    </section>
  );
}

export { HeroLanding as Component };

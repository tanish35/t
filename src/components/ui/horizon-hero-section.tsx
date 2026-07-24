import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { cn } from "#/lib/utils";

export interface HeroStanza {
  title: string;
  lines: string[];
}

export interface HorizonHeroSectionProps {
  src?: string;
  poster?: string;
  frameRate?: number;
  label?: string;
  stanzas?: HeroStanza[];
  scrollPerStanza?: number;
  className?: string;
}

const DEFAULT_STANZAS: HeroStanza[] = [
  {
    title: "HORIZON",
    lines: ["Where vision meets reality,", "we shape the future of tomorrow"],
  },
  {
    title: "COSMOS",
    lines: [
      "Beyond the boundaries of imagination,",
      "lies the universe of possibilities",
    ],
  },
  {
    title: "INFINITY",
    lines: [
      "In the space between thought and creation,",
      "we find the essence of true innovation",
    ],
  },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const GLASS =
  "border border-white/20 bg-black/30 backdrop-blur-xl backdrop-saturate-150 " +
  "shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_1px_24px_rgba(255,255,255,0.06)_inset,0_24px_60px_-20px_rgba(0,0,0,0.6)]";

export function HorizonHeroSection({
  src = "/homepage.mp4",
  poster = "/homepage-poster.jpg",
  frameRate = 40,
  label = "SPACE",
  stanzas = DEFAULT_STANZAS,
  scrollPerStanza = 1.5,
  className,
}: HorizonHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationId = 0;
    let target = 0;
    let eased = 0;
    let lastTime = performance.now();
    let lastFrame = -1;
    let lastIndex = -1;

    const readScroll = () => {
      const distance = container.offsetHeight - window.innerHeight;
      const offset = -container.getBoundingClientRect().top;
      target = distance > 0 ? clamp01(offset / distance) : 0;

      const index = Math.min(
        stanzas.length - 1,
        Math.floor(target * stanzas.length),
      );
      if (index !== lastIndex) {
        lastIndex = index;
        setActiveIndex(index);
      }
    };

    const tick = (now: number) => {
      animationId = requestAnimationFrame(tick);

      const delta = Math.min(64, now - lastTime) / 1000;
      lastTime = now;
      eased = reduceMotion
        ? target
        : eased + (target - eased) * (1 - Math.pow(0.001, delta));

      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${eased})`;
      }
      if (counterRef.current) {
        const index = Math.min(
          stanzas.length - 1,
          Math.floor(eased * stanzas.length),
        );
        counterRef.current.textContent = String(index + 1).padStart(2, "0");
      }

      const video = videoRef.current;
      if (!video || !video.duration || video.readyState < 2 || video.seeking) {
        return;
      }

      const totalFrames = Math.max(1, Math.round(video.duration * frameRate));
      const frame = Math.min(
        totalFrames - 1,
        Math.round(eased * (totalFrames - 1)),
      );
      if (frame !== lastFrame) {
        lastFrame = frame;
        video.currentTime = (frame + 0.5) / frameRate;
      }
    };

    readScroll();
    eased = target;
    animationId = requestAnimationFrame(tick);

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
    };
  }, [stanzas.length, frameRate]);

  useEffect(() => {
    if (!isReady) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = [
      railRef.current,
      titleRef.current,
      subtitleRef.current,
      indicatorRef.current,
    ].filter(Boolean);

    gsap.set(targets, { visibility: "visible" });

    if (reduceMotion) return;

    const timeline = gsap.timeline();

    if (railRef.current) {
      timeline.from(railRef.current, {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }

    if (titleRef.current) {
      timeline.from(
        titleRef.current.querySelectorAll("[data-title-char]"),
        {
          yPercent: 120,
          opacity: 0,
          duration: 1.4,
          stagger: 0.05,
          ease: "power4.out",
        },
        "-=0.5",
      );
    }

    if (subtitleRef.current) {
      timeline.from(
        subtitleRef.current.querySelectorAll("[data-subtitle-line]"),
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.8",
      );
    }

    if (indicatorRef.current) {
      timeline.from(
        indicatorRef.current,
        { y: 40, opacity: 0, duration: 0.9, ease: "power2.out" },
        "-=0.6",
      );
    }

    return () => {
      timeline.kill();
    };
  }, [isReady]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full bg-black", className)}
      style={{ height: `${stanzas.length * scrollPerStanza * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onLoadedMetadata={(event) => {
            event.currentTarget.pause();
            setIsReady(true);
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

        <div className="absolute inset-0 text-white">
          <div
            ref={railRef}
            style={{ visibility: "hidden" }}
            className={cn(
              "absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-6 rounded-full px-3 py-6 md:flex",
              GLASS,
            )}
          >
            <div className="flex flex-col gap-[5px]">
              <span className="block h-px w-5 bg-white/80" />
              <span className="block h-px w-5 bg-white/80" />
              <span className="block h-px w-5 bg-white/80" />
            </div>
            <span className="text-[0.66rem] font-bold tracking-[0.4em] [writing-mode:vertical-rl]">
              {label}
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div
              className={cn(
                "relative isolate flex w-[min(52rem,88vw)] items-center justify-center overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12 sm:py-16 min-h-[min(46vh,26rem)]",
                GLASS,
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.35),rgba(255,255,255,0.05)_32%,transparent_58%)]" />

              <div className="relative grid place-items-center">
                {stanzas.map((stanza, index) => {
                  const isActive = index === activeIndex;
                  const isFirst = index === 0;

                  return (
                    <div
                      key={stanza.title}
                      aria-hidden={!isActive}
                      className={cn(
                        "col-start-1 row-start-1 flex flex-col items-center text-center transition-all duration-700 ease-out",
                        isActive
                          ? "translate-y-0 opacity-100 blur-0"
                          : "pointer-events-none translate-y-4 opacity-0 blur-sm",
                      )}
                    >
                      <h1
                        ref={isFirst ? titleRef : undefined}
                        aria-label={stanza.title}
                        style={isFirst ? { visibility: "hidden" } : undefined}
                        className="display-title flex overflow-hidden text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.95] font-bold tracking-[0.06em] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]"
                      >
                        {stanza.title.split("").map((char, charIndex) => (
                          <span
                            key={`${char}-${charIndex}`}
                            data-title-char
                            aria-hidden="true"
                            className="inline-block"
                          >
                            {char}
                          </span>
                        ))}
                      </h1>

                      <div
                        ref={isFirst ? subtitleRef : undefined}
                        style={isFirst ? { visibility: "hidden" } : undefined}
                        className="mt-6 space-y-1 text-[clamp(0.8rem,1.5vw,1.05rem)] font-medium tracking-[0.14em] text-white/85 uppercase"
                      >
                        {stanza.lines.map((line) => (
                          <p key={line} data-subtitle-line>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            ref={indicatorRef}
            style={{ visibility: "hidden" }}
            className="absolute inset-x-0 bottom-8 flex justify-center px-6"
          >
            <div
              className={cn(
                "flex items-center gap-4 rounded-full px-5 py-3",
                GLASS,
              )}
            >
              <span className="text-[0.6rem] font-bold tracking-[0.34em]">
                SCROLL
              </span>
              <div className="h-px w-28 bg-white/30 sm:w-48">
                <div
                  ref={progressFillRef}
                  className="h-full origin-left scale-x-0 bg-white"
                />
              </div>
              <span className="text-[0.6rem] font-bold tracking-[0.34em] tabular-nums">
                <span ref={counterRef}>01</span> /{" "}
                {String(stanzas.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HorizonHeroSection as Component };

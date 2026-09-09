"use client";

import { useEffect, useRef, useState } from "react";
import { HeroVialCluster } from "@/components/sections/HeroVialCluster";

export function HeroMotion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showFallback, setShowFallback] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const container = containerRef.current;
    if (!frame || !container || failed) return;

    let visible = true;
    let fadeTimer: number | undefined;
    const sendVisibility = () => {
      frame.contentWindow?.postMessage(
        { type: "ruined-rx-hero", command: "visibility", visible },
        window.location.origin,
      );
    };
    const restoreFallback = () => {
      window.clearTimeout(fadeTimer);
      setShowFallback(true);
      setReady(false);
      setFailed(true);
    };
    const loadTimer = window.setTimeout(restoreFallback, 25_000);
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== frame.contentWindow ||
        event.data?.type !== "ruined-rx-hero"
      ) return;

      if (event.data.status === "ready") {
        window.clearTimeout(loadTimer);
        setReady(true);
        setPaused(Boolean(event.data.paused));
        sendVisibility();
        fadeTimer = window.setTimeout(() => setShowFallback(false), 500);
      } else if (event.data.status === "error") {
        restoreFallback();
      } else if (event.data.status === "state") {
        setPaused(Boolean(event.data.paused));
      }
    };

    window.addEventListener("message", onMessage);
    // Recover readiness if a cached iframe rendered before React hydrated.
    frame.contentWindow?.postMessage(
      { type: "ruined-rx-hero", command: "status" },
      window.location.origin,
    );
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sendVisibility();
    }, { rootMargin: "100px" });
    observer.observe(container);

    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
      window.clearTimeout(loadTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [failed]);

  const togglePlayback = () => {
    frameRef.current?.contentWindow?.postMessage(
      { type: "ruined-rx-hero", command: paused ? "play" : "pause" },
      window.location.origin,
    );
    setPaused(!paused);
  };

  return (
    <div ref={containerRef} className="relative mx-auto h-[390px] w-full sm:h-[480px] lg:h-[540px]">
      {showFallback && (
        <div
          aria-hidden={ready}
          className={`absolute inset-0 flex items-center transition-opacity duration-500 motion-reduce:transition-none ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <HeroVialCluster />
        </div>
      )}
      {!failed && (
        <iframe
          ref={frameRef}
          src="/hero-orbit/v1/index.html?embed=1"
          title="Ruined RX rotating vials and holographic glass rings"
          loading="lazy"
          tabIndex={-1}
          onError={() => {
            setReady(false);
            setFailed(true);
            setShowFallback(true);
          }}
          className={`pointer-events-none absolute -left-[10%] -top-[10%] h-[120%] w-[120%] border-0 bg-transparent transition-opacity duration-500 motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {ready && !failed && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={paused ? "Play animation" : "Pause animation"}
          aria-pressed={paused}
          title={paused ? "Play animation" : "Pause animation"}
          className="absolute bottom-0 right-2 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-sm transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d={paused ? "m7 4 9 6-9 6Z" : "M7 5v10M13 5v10"} />
          </svg>
        </button>
      )}
    </div>
  );
}

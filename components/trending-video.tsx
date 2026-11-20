"use client";

import { useEffect, useRef } from "react";

export default function TrendingVideo({ src, poster, label }: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let visible = false;
    const updatePlayback = () => {
      if (visible && !document.hidden) {
        if (video.getAttribute("src") !== src) video.src = src;
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.1;
      updatePlayback();
    }, { threshold: 0.1 });
    observer.observe(video);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [src]);

  return (
    <video ref={ref} poster={poster} aria-label={label} muted loop playsInline
      preload="none" className="h-full w-full object-cover" />
  );
}

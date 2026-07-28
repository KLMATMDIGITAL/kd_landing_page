"use client";

import { useEffect, useRef } from "react";

export default function LazyBackgroundVideo({
  src,
  className,
  preload = "none",
}: {
  src: string;
  className?: string;
  preload?: "none" | "metadata" | "auto";
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <video ref={ref} muted loop playsInline preload={preload} className={className}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

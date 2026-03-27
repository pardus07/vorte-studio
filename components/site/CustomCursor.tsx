"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    };

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    let raf: number;
    function loop() {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring!.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      raf = requestAnimationFrame(loop);
    }

    document.addEventListener("mousemove", onMove);
    loop();

    // Scale on interactive elements
    const grow = () => {
      dot.style.width = "25px";
      dot.style.height = "25px";
      dot.style.marginLeft = "-7.5px";
      dot.style.marginTop = "-7.5px";
    };
    const shrink = () => {
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.marginLeft = "0";
      dot.style.marginTop = "0";
    };

    const interactives = document.querySelectorAll("a, button, [data-cursor]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 rounded-full bg-accent transition-[width,height] duration-200 max-md:hidden"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 rounded-full border border-accent/40 max-md:hidden"
      />
    </>
  );
}

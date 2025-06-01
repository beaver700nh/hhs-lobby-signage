"use client";

import { useEffect, useRef, useState } from "react";
import BellSchedule from "./bell-schedule/bell-schedule";
import SlidePanel from "./slide-panel";

export default function InfoTabs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(x => (x + 1) % 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative grow *:w-full *:h-full *:border-2" ref={containerRef}>
      <SlidePanel
        direction="right"
        in={index === 0}
        container={containerRef.current}
      >
        <BellSchedule />
      </SlidePanel>
      <SlidePanel
        direction="left"
        in={index === 1}
        container={containerRef.current}
      >
        <p>Slide 2</p>
      </SlidePanel>
    </div>
  );
}
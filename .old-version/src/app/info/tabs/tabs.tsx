"use client";

import { useEffect, useRef, useState } from "react";
import BellSchedule from "./bell-schedule/bell-schedule";
import LunchMenu from "./lunch-menu/lunch-menu";
import SlidePanel from "./slide-panel";

const TAB_SWITCH_INTERVAL = 10000;

export default function InfoTabs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(x => (x + 1) % 2);
    }, TAB_SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [TAB_SWITCH_INTERVAL]);

  return (
    <div className="relative grow *:w-full *:h-full *:px-2" ref={containerRef}>
      <SlidePanel
        direction="right"
        in={index === 0}
        container={containerRef.current}
      >
        <div>
          <BellSchedule />
        </div>
      </SlidePanel>
      <SlidePanel
        direction="left"
        in={index === 1}
        container={containerRef.current}
      >
        <div>
          <LunchMenu />
        </div>
      </SlidePanel>
    </div>
  );
}
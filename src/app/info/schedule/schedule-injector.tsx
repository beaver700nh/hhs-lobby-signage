"use client";

import { useState, useEffect } from "react";
import { getSchedule } from "./get-schedule";
import { ScheduleContext } from "./schedule-context";
import ical from "node-ical";
import * as util from "@/app/util";

const REFRESH_INTERVAL = util.minToMs(1/6);

export default function ScheduleInjector({
  children,
  initial,
}: Readonly<{
  children: React.ReactNode;
  initial: Promise<any>;
}>) {
  const [schedule, setSchedule] = useState<Promise<ical.VEvent | null>>(initial);

  useEffect(() => {
    const interval = setInterval(() => {
      util.log(console.info, "Refreshing info panel on periodic interval.");
      setSchedule(getSchedule());
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScheduleContext value={schedule}>
      {children}
    </ScheduleContext>
  )
}
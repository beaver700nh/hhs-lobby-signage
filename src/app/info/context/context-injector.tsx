"use client";

import { useState, useEffect } from "react";
import { getSchedule } from "./schedule/get-schedule";
import { ScheduleContext } from "./schedule/schedule-context";
import { getLunchMenu } from "./lunch-menu/get-lunch-menu";
import { LunchMenuContext } from "./lunch-menu/lunch-menu-context";
import ical from "node-ical";
import * as util from "@/app/util";

const REFRESH_INTERVAL = util.minToMs(1/12);

const DEBUG_OVERRIDE_TIME = new Date("2024-09-27T16:00:00.000");
// const DEBUG_OVERRIDE_TIME = null;

export default function ContextInjector({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [schedule, setSchedule] = useState<Promise<ical.VEvent | null>>(new Promise(() => {}));
  const [lunchMenu, setLunchMenu] = useState<Promise<ical.VEvent | null>>(new Promise(() => {}));

  useEffect(() => {
    const interval = setInterval((function update() {
      util.log(console.info, "Refreshing info panel on periodic interval.");

      const refreshTime = DEBUG_OVERRIDE_TIME ?? new Date();
      setSchedule(getSchedule(refreshTime, refreshTime.getTimezoneOffset()));
      setLunchMenu(getLunchMenu(refreshTime, refreshTime.getTimezoneOffset()));

      return update;
    })(), REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [REFRESH_INTERVAL, DEBUG_OVERRIDE_TIME]);

  return (
    <ScheduleContext value={schedule}>
    <LunchMenuContext value={lunchMenu}>
      {children}
    </LunchMenuContext>
    </ScheduleContext>
  )
}
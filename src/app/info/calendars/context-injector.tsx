"use client";

import { useState, useEffect } from "react";
import { Calendars } from "./definitions";
import { ContextType, Contexts } from "./contexts";
import { fetchCalendar } from "./fetch";
import * as util from "@/app/util";

const REFRESH_INTERVAL = util.minToMs(1/12);

const DEBUG_OVERRIDE_TIME = new Date("2024-10-02T15:00:00.000");
// const DEBUG_OVERRIDE_TIME = null;

export default function ContextInjector({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const states = new Map(Calendars.map(
    calendar => [
      calendar.name,
      (() => {
        const [get, set] = useState<ContextType>(new Promise(() => {}));
        return { get, set };
      })(),
    ]
  ));

  useEffect(() => {
    const interval = setInterval((function update() {
      util.log(console.info, "Refetching calendars on periodic interval.");

      const refreshTime = DEBUG_OVERRIDE_TIME ?? new Date();
      const timeInfo = { refreshTime, tzOffset: refreshTime.getTimezoneOffset() };

      for (const calendar of Calendars) {
        states.get(calendar.name)!.set(fetchCalendar(calendar.name, timeInfo));
      }

      return update;
    })(), REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [REFRESH_INTERVAL, DEBUG_OVERRIDE_TIME]);

  return (
    Calendars.reduceRight((acc, calendar) => {
      const Context = Contexts.get(calendar.name)!;
      const state = states.get(calendar.name)!;

      return (
        <Context value={state.get}>
          {acc}
        </Context>
      );
    }, children)
  );
}
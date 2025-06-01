"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "../schedule-context";
import * as util from "@/app/util";

// import { test_calculateRelativeDate } from "./title-test";
// test_calculateRelativeDate();

const DATE_FORMAT = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

export function calculateRelativeDate(date: Date, _now?: Date) {
  date = util.reinterpretAsLocal(date);

  // disregard time info and only consider date
  const now = util.toMidnight(_now ?? new Date());
  const then = util.toMidnight(date);

  const diff = util.msToDay(then.getTime() - now.getTime());

  if (diff === 0) {
    return "today";
  }
  else if (diff === -1) {
    return "yesterday";
  }
  else if (diff === 1) {
    return "tomorrow";
  }

  const dist = Math.abs(diff);

  if (dist > 7) {
    return null; // too far for relative descriptions
  }

  /**
   *    |    Sun    |    Mon    |    Tue    |    Wed    |    Thu    |    Fri    |    Sat    |
   * ---+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
   *  S |   last    |           |           |           |           |           |           |
   *  M |   last    |   last    |           |           |           |           |           |
   *  T |   last    |   last    |   last    |           |           |           |           |
   *  W |   last    |   last    |   last    |   last    |           |           |           |
   *  T |   last    |   last    |   last    |   last    |   last    |           |           |
   *  F |   last    |   last    |   last    |   last    |   last    |   last    |           |
   *  S | yesterday |    OTW    |    OTW    |   last    |   last    |   last    |   last    |
   * ---+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
   *  S |   today   | yesterday |    OTW    |    LW     |    LW     |    LW     |    LW     |
   *  M | tomorrow  |   today   | yesterday |   this    |   this    |   this    |   this    |
   *  T |   this    | tomorrow  |   today   | yesterday |   this    |   this    |   this    |
   *  W |   this    |   this    | tomorrow  |   today   | yesterday |   this    |   this    |
   *  T |   this    |   this    |   this    | tomorrow  |   today   | yesterday |   this    |
   *  F |   this    |   this    |   this    |   this    | tomorrow  |   today   | yesterday |
   *  S |    NW     |    NW     |    NW     |    NW     |    TW     | tomorrow  |   today   |
   * ---+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
   *  S |   next    |   next    |   next    |   next    |    TW     |    TW     | tomorrow  |
   *  M |           |   next    |   next    |   next    |   next    |   next    |   next    |
   *  T |           |           |   next    |   next    |   next    |   next    |   next    |
   *  W |           |           |           |   next    |   next    |   next    |   next    |
   *  T |           |           |           |           |   next    |   next    |   next    |
   *  F |           |           |           |           |           |   next    |   next    |
   *  S |           |           |           |           |           |           |   next    |
   */

  const isSameWeek = util.isSameWeek(now, then);
  const dayOfWeekThen = then.toLocaleDateString(undefined, { weekday: "long" });

  // @ts-ignore: Bitwise hack to make multiple comparisons at once
  const areNearWeekend = !!(now.getDay() < 3) + !!(diff < 0);
  const weekendProximity = Math.abs(now.getDay() - 3);

  // now/then are near to each other and to the weekend
  if ((areNearWeekend & 1) === 0 && (false
    || weekendProximity === 2 && dist === 2
    || weekendProximity === 1 && dist <= 3)
  ) {
    return `${dayOfWeekThen} ${areNearWeekend & 2 ? "over the" : "this"} weekend`;
  }
  else if (!isSameWeek) {
    return `${diff < 0 ? "last" : "next"} ${dayOfWeekThen}`;
  }
  else if (then.getDay() === 0) {
    return `${dayOfWeekThen} last weekend`;
  }
  else if (then.getDay() === 6) {
    return `${dayOfWeekThen} next weekend`;
  }
  else {
    return `this ${dayOfWeekThen}`;
  }
}

export default function TitleContent() {
  const scheduleData = use(useContext(ScheduleContext));
  const absolute = scheduleData && util.reinterpretAsLocal(scheduleData.start);
  const relative = absolute && calculateRelativeDate(absolute);

  return (
    <>
      <p>{absolute?.toLocaleDateString(undefined, DATE_FORMAT) ?? "No schedule for today." }</p>
      <p>{relative}</p>
    </>
  );
}

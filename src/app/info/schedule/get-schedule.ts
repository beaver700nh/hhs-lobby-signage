"use server";

import ical from "node-ical";
import { SPECIAL_DAYS, VALID_DAYS } from "../header/big-letter/regex";
import * as util from "@/app/util";

const SCHEDULE_CALID = "sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com";
const SCHEDULE_URL = `https://calendar.google.com/calendar/ical/${SCHEDULE_CALID}/public/basic.ics`;

const LOOKAHEAD_TIME = util.dayToMs(14);

function isRelevantSchedule(component: ical.CalendarComponent, date: Date): component is ical.VEvent {
  if (component.type !== "VEVENT") return false;

  const t = util.reinterpretAsLocal(component.start);

  // two weeks should cover the length of all vacations except summer
  const later = new Date(date.getTime() + LOOKAHEAD_TIME);

  return date <= t && t <= later;
}

function calculateSortingWeight(event: ical.VEvent) {
  const foo = (0
    - 100 * new Date(event.start).getTime()
    + (event.summary.match(VALID_DAYS)?.length ? 10 : 0)
    + (event.summary.match(SPECIAL_DAYS)?.length ?? 0)
  );

  console.log("event", event.start.toISOString(), event.summary, "=", foo);
  return foo;
}

export async function getSchedule(refreshTime?: Date) {
  if (refreshTime == null) refreshTime = new Date();

  util.log(console.info, `Querying schedule from database (t = ${refreshTime.toISOString()}) ...`);

  const schedulePromise = ical.async.fromURL(SCHEDULE_URL)
    .then(schedule => {
      return Object.entries(schedule)
        .map(([, v]) => v)
        .filter(x => isRelevantSchedule(x, refreshTime))
        .sort((a, b) => calculateSortingWeight(b) - calculateSortingWeight(a));
    });

  return await schedulePromise
    .then(list => {
      const repr = JSON.stringify(
        list
          .map(({ start, summary }) => ({ start, summary }))
          .slice(0, 4),
        null, 2,
      );
      util.log(console.info, `Debug: showing first 4 of ${list.length} schedule entries:\n${repr}`);

      return list[0] ?? null;
    })
    .catch(error => {
      util.log(console.error, `Failed to get schedule! Message: ${error}`);

      return null;
    });
}

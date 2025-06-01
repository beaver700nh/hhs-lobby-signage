"use server";

import ical from "node-ical";
import { SPECIAL_DAYS, VALID_DAYS } from "../regex";
import * as util from "@/app/util";

const SCHEDULE_CALID = "sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com";
const SCHEDULE_URL = `https://calendar.google.com/calendar/ical/${SCHEDULE_CALID}/public/basic.ics`;

const LOOKAHEAD_TIME = util.dayToMs(14);
const ROLLOVER_TIME = util.minToMs(16 * 60);

function isRelevantSchedule(component: ical.CalendarComponent, date: Date): component is ical.VEvent {
  if (component.type !== "VEVENT") return false;

  // shift time to later so it doesn't roll over immediately
  const t = component.start.getTime() + ROLLOVER_TIME;

  // two weeks should cover the length of all vacations except summer
  const later = date.getTime() + LOOKAHEAD_TIME;

  return date.getTime() < t && t <= later;
}

function calculateSortingWeight(event: ical.VEvent) {
  return (0
    - 100 * new Date(event.start).getTime()
    + (event.summary.match(VALID_DAYS)?.length ? 10 : 0)
    + (event.summary.match(SPECIAL_DAYS)?.length ?? 0)
  );
}

export async function getSchedule(refreshTime: Date, timezoneOffset: number) {
  util.log(console.info, `Querying schedule from database (t = ${refreshTime.toISOString()}) ...`);

  // normalizes e.g. 4pm local to 4pm UTC, in order to be compatible with database which is in UTC
  const refreshTimeAsUtc = new Date(refreshTime.getTime() - util.minToMs(timezoneOffset));

  const schedulePromise = ical.async.fromURL(SCHEDULE_URL)
    .then(schedule => {
      return Object.entries(schedule)
        .map(([, v]) => v)
        .filter(x => isRelevantSchedule(x, refreshTimeAsUtc))
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
      // return null;
    })
    .catch(error => {
      util.log(console.error, `Failed to get schedule! Message: ${error}`);

      return null;
    });
}

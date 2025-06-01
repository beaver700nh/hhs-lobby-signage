"use server";

import ical from "node-ical";
import * as util from "@/app/util";

const LUNCH_MENU_CALID = "holliston.k12.ma.us_c2d4uic3gbsg7r9vv9qo8a949g@group.calendar.google.com";
const LUNCH_MENU_URL = `https://calendar.google.com/calendar/ical/${LUNCH_MENU_CALID}/public/basic.ics`;

const LOOKAHEAD_TIME =  util.dayToMs(14);
const ROLLOVER_TIME = util.minToMs(16 * 60);

function isRelevantLunchMenu(component: ical.CalendarComponent, date: Date): component is ical.VEvent {
  if (component.type !== "VEVENT") return false;

  // shift time to later so it doesn't roll over immediately
  const t = component.start.getTime() + ROLLOVER_TIME;

  // two weeks should cover the length of all vacations except summer
  const later = date.getTime() + LOOKAHEAD_TIME;

  return date.getTime() < t && t <= later;
}

function calculateSortingWeight(event: ical.VEvent) {
  return new Date(event.start).getTime();
}

export async function getLunchMenu(refreshTime: Date, timezoneOffset: number) {
  util.log(console.info, `Querying lunch menu from database (t = ${refreshTime.toISOString()}) ...`);

  // normalizes e.g. 4pm local to 4pm UTC, in order to be compatible with database which is in UTC
  const refreshTimeAsUtc = new Date(refreshTime.getTime() - util.minToMs(timezoneOffset));

  const lunchMenuPromise = ical.async.fromURL(LUNCH_MENU_URL)
    .then(schedule => {
      return Object.entries(schedule)
        .map(([, v]) => v)
        .filter(x => isRelevantLunchMenu(x, refreshTimeAsUtc))
        .sort((a, b) => calculateSortingWeight(a) - calculateSortingWeight(b));
    });

  return await lunchMenuPromise
    .then(list => {
      const repr = JSON.stringify(
        list
          .map(({ start, summary }) => ({ start, summary }))
          .slice(0, 4),
        null, 2,
      );
      util.log(console.info, `Debug: showing first 4 of ${list.length} lunch menu entries:\n${repr}`);

      return list[0] ?? null;
      // return null;
    })
    .catch(error => {
      util.log(console.error, `Failed to get lunch menu! Message: ${error}`);

      return null;
    });
}

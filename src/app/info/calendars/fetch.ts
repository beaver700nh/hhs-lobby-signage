"use server";

import ical from "node-ical";
import { Calendars } from "./definitions";
import * as util from "@/app/util";

const LOOKAHEAD_TIME = util.dayToMs(2 * 7);  // two weeks should cover the length of all vacations except summer
const ROLLOVER_TIME = util.minToMs(16 * 60); // 4pm is late enough after school to be unambiguous

function isRelevantEvent(component: ical.CalendarComponent, date: Date): component is ical.VEvent {
  if (component.type !== "VEVENT") return false;

  // shift time to later so it's still valid during the respective day
  const t = component.start.getTime() + ROLLOVER_TIME;

  // look ahead some interval in case it's before break or something
  const later = date.getTime() + LOOKAHEAD_TIME;

  return date.getTime() < t && t <= later;
}

export type RefreshTimeInfo = {
  refreshTime: Date,
  tzOffset: number,
};

const calendarFetchers = new Map(Calendars.map(
  calendar => [
    calendar.name,
    async ({ refreshTime, tzOffset }: RefreshTimeInfo) => {
      util.log(console.info, `Querying "${calendar.name}" calendar at t = ${refreshTime.toISOString()} ...`);

      // normalize X time local tz to same X time UTC to allow calculations purely in UTC, since calendar events seem to be in UTC
      const refreshTimeAsUtc = new Date(refreshTime.getTime() - util.minToMs(tzOffset));

      const calendarUrl = `https://calendar.google.com/calendar/ical/${calendar.calendarId}/public/basic.ics`;
      return await ical.async.fromURL(calendarUrl)
        .then(schedule => Object.entries(schedule)
          .map(([, component]) => component)
          .filter(component => isRelevantEvent(component, refreshTimeAsUtc))
          .sort((a, b) => calendar.weightingFunction(a) - calendar.weightingFunction(b))
        )
        .then(list => {
          const repr = JSON.stringify(
            list
              .map(({ start, summary }) => ({ start, summary }))
              .slice(0, 4),
            null, 2,
          );
          util.log(console.info, `Debug: Showing first 4 of ${list.length} entries for "${calendar.name}":\n${repr}`);

          return list[0] ?? null;
          // return null;
        })
        .catch(error => {
          util.log(console.error, `Failed to fetch "${calendar.name}" calendar! Message: ${error}`);

          return null;
        });
    },
  ]
));

export async function fetchCalendar(name: (typeof Calendars)[number]["name"], timeInfo: RefreshTimeInfo) {
  return await calendarFetchers.get(name)!(timeInfo);
}

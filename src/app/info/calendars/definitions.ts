import ical from "node-ical";
import { SPECIAL_DAYS, VALID_DAYS, NO_SCHOOL } from "../regex";

export type Calendar<T> = {
  name: string,
  calendarId: string,
  weightingFunction: (event: T) => number, // the smaller the better
};

function defineCalendars<C extends readonly Calendar<ical.VEvent>[]>(calendars: C) {
  return calendars;
}

export const Calendars = defineCalendars([
  {
    name: "schedule",
    calendarId: "sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com",
    weightingFunction: (event) => 0
      + 100 * event.start.getTime()
      - (event.summary.match(VALID_DAYS)?.length ? 10 : 0)
      - (event.summary.match(SPECIAL_DAYS)?.length ?? 0),
  },
  {
    name: "lunchMenu",
    calendarId: "holliston.k12.ma.us_c2d4uic3gbsg7r9vv9qo8a949g@group.calendar.google.com",
    weightingFunction: (event) => 0
      + event.start.getTime()
      + (event.summary.match(NO_SCHOOL)?.length ? Infinity : 0),
  },
] as const);

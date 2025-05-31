"use server";

import ical from "node-ical";

import * as util from "../util";

const SCHEDULE_CALID = "sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com";
const SCHEDULE_URL = `https://calendar.google.com/calendar/ical/${SCHEDULE_CALID}/public/basic.ics`;

function isRelevantSchedule(component: ical.CalendarComponent, date: Date): component is ical.VEvent {
  if (component.type !== "VEVENT") return false;

  const c = component as ical.VEvent;

  // date must between now and some lookahead duration
  // but make sure to reinterpret the event's timezone as local
  return new Date(c.start.toISOString().replace(/Z$/, "")) >= date;
}

export async function getSchedule(refreshTime?: Date) {
  if (refreshTime == null) refreshTime = new Date("2024-09-30"); // TODO temporary

  util.log(console.info, `Querying schedule from database (t = ${refreshTime.toISOString()}) ...`);

  const schedulePromise = ical.async.fromURL(SCHEDULE_URL)
    .then(schedule => {
      return Object.entries(schedule)
        .map(([, v]) => v)
        .filter(x => isRelevantSchedule(x, refreshTime))
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    });

  schedulePromise.then(list => {
    const repr = JSON.stringify(
      list
        .map(({ start, summary }) => ({ start, summary }))
        .slice(0, 4),
      null, 2,
    );
    util.log(console.info, `Got ${list.length} schedule entries:\n${repr}`);
  });

  return (await schedulePromise)[0];
}

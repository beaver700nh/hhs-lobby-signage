import ical from "node-ical";
import styles from "../styles.module.css";
import BigLetter from "./big-letter";
import { Suspense } from "react";

const SCHEDULE_CALID = "sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com";
const SCHEDULE_URL = `https://calendar.google.com/calendar/ical/${SCHEDULE_CALID}/public/basic.ics`;

export default function InfoPanel({
  date,
}: {
  date: Date,
}) {
  function predicate(component: ical.CalendarComponent): component is ical.VEvent {
    return component.type == "VEVENT"
      && (component as ical.VEvent).start.getTime() >= date.getTime();
  }

  const schedulePromise = ical.async.fromURL(SCHEDULE_URL)
    .then(schedule => {
      return Object.entries(schedule)
        .reverse()
        .map(([, v]) => v)
        .filter(predicate);
    });

  return (
    <section className={`${styles.panel} basis-0 grow`}>
      <Suspense fallback={<p>Loading...</p>}>
        <BigLetter schedule={schedulePromise} />
      </Suspense>
    </section>
  );
}

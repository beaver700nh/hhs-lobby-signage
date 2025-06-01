"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "../schedule-context";
import ical from "node-ical";

const VALID_DAYS = new Set(["A", "B", "C", "D"]);
const SPECIAL_DAYS = /\*|special|exam|transition|last|half|1\/2/i;

function parseLetter(schedule: ical.VEvent | null) {
  const candidate = schedule?.summary.trim().charAt(0);
  
  return candidate && VALID_DAYS.has(candidate)
    ? {
      letter: candidate,
      special: SPECIAL_DAYS.test(schedule!.summary),
    }
    : {
      letter: null,
      special: true,
    };
}

export default function BigLetterContent() {
  const scheduleData = use(useContext(ScheduleContext));
  const parsed = parseLetter(scheduleData);

  return (
    <p>
      {parsed.letter ?? <>&#x1f6a7;</>}
      {parsed.special && <>&#x2005;</>}
    </p>
  );
}
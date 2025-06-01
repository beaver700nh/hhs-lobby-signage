"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "../../schedule/schedule-context";
import { VALID_DAYS, SPECIAL_DAYS } from "./regex";
import ical from "node-ical";

function parseLetter(schedule: ical.VEvent | null) {
  const candidate = schedule?.summary.match(VALID_DAYS)?.[1];

  return candidate == null
    ? {
      letter: null,
      special: true,
    }
    : {
      letter: candidate,
      special: !!schedule!.summary.match(SPECIAL_DAYS),
    };
}

export default function BigLetterContent() {
  const scheduleData = use(useContext(ScheduleContext));
  const parsed = parseLetter(scheduleData);

  console.log("special", parsed);

  return (
    <svg viewBox="0 0 14 14">
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="100%"
        fill="currentColor"
        className="font-black text-(--fg-accent1)"
      >
        {parsed.letter ?? "?"}
      </text>
      <text
        x="100%" y="0%"
        textAnchor="end"
        dominantBaseline="hanging"
        fontSize="50%"
        fill="currentColor"
        className="text-(--fg-accent2)"
      >
        {parsed.special && <>&#x2605;</>}
      </text>
    </svg>
  );
}
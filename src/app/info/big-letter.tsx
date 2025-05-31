"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "./schedule-context";

export default function BigLetter() {
  const scheduleData = use(useContext(ScheduleContext));

  return (
    <>
      <p>{scheduleData.summary}</p>
      <p>{scheduleData.description}</p>
      {/* <pre className="whitespace-normal">{JSON.stringify(scheduleData)}</pre> */}
    </>
  );
}
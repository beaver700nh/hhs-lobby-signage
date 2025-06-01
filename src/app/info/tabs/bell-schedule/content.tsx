"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "../../schedule/schedule-context";

export default function BellScheduleContent() {
  const scheduleData = use(useContext(ScheduleContext));

  return (
    <p>{scheduleData?.description}</p>
  );
}
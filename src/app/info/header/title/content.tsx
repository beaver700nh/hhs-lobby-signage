"use client";

import { use, useContext } from "react";
import Typography from "@mui/material/Typography";
import { ScheduleContext } from "../../context/schedule/schedule-context";
import * as util from "@/app/util";

const DATE_FORMAT = {
  month: "short",
  day: "numeric",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

export default function TitleContent() {
  const scheduleData = use(useContext(ScheduleContext));
  const absolute = scheduleData && util.reinterpretAsLocal(scheduleData.start);
  const relative = absolute && util.calculateRelativeDate(absolute);

  return (
    <>
      <Typography variant="h4">
        {absolute?.toLocaleDateString(undefined, DATE_FORMAT) ?? "No schedule for today."}
      </Typography>
      <Typography variant="h4" className="capitalize">
        {relative}
      </Typography>
    </>
  );
}

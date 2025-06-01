"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "../../schedule/schedule-context";
import Typography from "@mui/material/Typography";
import * as Regex from "../../regex";
import * as util from "@/app/util";
import styles from "@/app/styles.module.css";

function decodePotentialHtml(description: string) {
  const matches = [...description.matchAll(Regex.SUSPECTED_HTML)];

  if (matches.length === 0) {
    return description;
  }

  util.log(console.info, "Attempting to decode HTML.");

  const doc = new DOMParser().parseFromString(description, "text/html");
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

  let node;
  let nodes = [];
  while ((node = walker.nextNode()) != null)
    nodes.push(node.nodeValue);

  return nodes.join("\n");
}

function parseBellScheduleToTable(description: string) {
  const matches = [...description.matchAll(Regex.BELL_SCHEDULE)];

  if (matches.length === 0) {
    throw new Error("Bell schedule format could not be parsed.");
  }

  return matches.map(match => {
    if (match.length !== 7)
      throw new Error(`Failed to detect any information from schedule entry: ${match[0]}`);

    const [, startA, endA, nameA, nameB, startB, endB] = match;

    if (nameA != null)
      return { name: nameA, start: startA, end: endA };
    else if (nameB != null)
      return { name: nameB, start: startB, end: endB };
    else
      throw new Error(`Failed to detect class name from schedule entry: ${match}`);
  });
}

function parseBellScheduleToText(description: string) {
  return description
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

export default function BellScheduleContent() {
  const scheduleData = use(useContext(ScheduleContext));

  return (
    scheduleData == null
      ? <Typography>Bell schedule not found.</Typography>
      : (() => {
        const sanitized = decodePotentialHtml(scheduleData.description);

        try {
          const data = parseBellScheduleToTable(sanitized);

          return (
            <table className="w-full table-fixed">
              <tbody>
                {data.map((entry, index) => (
                  <tr
                    key={index}
                    className={`${styles.bellScheduleEntry}`}
                    data-islunch={entry.name.match(Regex.LUNCH_BLOCK)}
                  >
                    <Typography component="td">{entry.start} &ndash; {entry.end}</Typography>
                    <Typography component="td">{entry.name}</Typography>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }
        catch (e: any) {
          util.log(console.error, `Couldn't format bell schedule as table, reason: ${(e as Error).message} - Falling back to plain text.`);

          return (
            <>
              {parseBellScheduleToText(sanitized).map(entry => (
                <Typography>{entry}</Typography>
              ))}
            </>
          );
        }
      })()
  );
}
"use client";

import { use, useContext } from "react";
import { ScheduleContext } from "../../schedule/schedule-context";
import Typography from "@mui/material/Typography";
import * as util from "@/app/util";
import styles from "@/app/styles.module.css";

/*
 * Regex to detect HTML tags in schedule.description
 * See https://regex101.com/r/WUMMda/1
 */
const SUSPECTED_HTML_REGEX = /<([^>]+)>.*?<\/\1>|<([^>]+)\/>/g;

/*
 * Regex to extract class times and names from schedule.description
 * /^\s*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)\s*-\s*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)[\s:]*(.*?)\s*$|^\s*(.*?)[\s:]*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)\s*-\s*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)\s*$/gmi
 *
 * >> Regex analyzer: https://regex101.com/r/hd7rpO/1 <<
 *
 * Two different cases
 * ===================
 * ^\s*{Time matcher}[\s:]*(.*?)\s*$  -- Time: Class
 * |                                  -- ... or ...
 * ^\s*(.*?)[\s:]*{Time matcher}\s*$  -- Class: Time
 *
 * Time matcher
 * ============
 * {Clock time}\s*-\s*{Clock time}  -- XX:XX - XX:XX
 *                                  -- two clock times separated by a dash
 *                                  -- and maybe whitespace around the dash
 *
 * Clock time
 * ==========
 * (
 *   \d?\d      -- hour (can be single-digit)
 *   (?:
 *     :?       -- colon is optional
 *     \d{2}    -- minute (always two digits)
 *   )?         -- minute is optional
 *   (?:
 *     \s*      -- whitespace is optional
 *     [ap]m    -- AM or PM
 *   )?
 * )
 *
 * Flags
 * =====
 * g  -- global (find all matches)
 * m  -- handle multiline
 * i  -- case-insensitive
 */
const BELL_SCHEDULE_REGEX = (() => {
  const clockTime   = String.raw`(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)`;
  const timeMatcher = String.raw`${clockTime}\s*-\s*${clockTime}`;
  const timeBefore  = String.raw`^\s*${timeMatcher}[\s:]*(.*?)\s*$`;
  const timeAfter   = String.raw`^\s*(.*?)[\s:]*${timeMatcher}\s*$`;
  const regex = String.raw`${timeBefore}|${timeAfter}`;

  return new RegExp(regex, "gmi");
})();

const LUNCH_BLOCK_REGEX = /lunch/i;

function decodePotentialHtml(description: string) {
  const matches = [...description.matchAll(SUSPECTED_HTML_REGEX)];

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
  const matches = [...description.matchAll(BELL_SCHEDULE_REGEX)];

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
                    data-islunch={entry.name.match(LUNCH_BLOCK_REGEX)}
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
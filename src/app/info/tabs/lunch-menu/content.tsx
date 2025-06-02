import { use, useContext } from "react";
import Typography from "@mui/material/Typography";
import { Contexts } from "../../calendars/contexts";
import { LUNCH_SUMMARY, LUNCH_SIDES_SEPARATOR } from "../../regex";
import * as util from "@/app/util";

function parseLunchMenuSummary(summary: string) {
  const match = summary.match(LUNCH_SUMMARY) ?? [];

  if (match.length === 0) {
    // if we fail to parse, it's better to just guess than error out
    util.log(console.warn, `Failed to parse lunch menu: "${summary}" - Assuming not vegan and skipping parsing.`);

    return {
      hasVegan: false,
      main: summary,
    };
  }

  const [, hasVegan, main] = match;

  return {
    hasVegan: !!hasVegan,
    main,
  };
}

function parseLunchMenuDescription(description?: string) {
  return (description ?? "")
    .split(LUNCH_SIDES_SEPARATOR)
    .map(side => side.trim())
    .filter(side => side.length > 0);
}

export default function LunchMenuContent() {
  const lunchMenuData = use(useContext(Contexts.get("lunchMenu")!));

  return (
    lunchMenuData == null
      ? <Typography>Lunch menu not found.</Typography>
      : (() => {
        const { hasVegan, main } = parseLunchMenuSummary(lunchMenuData.summary);
        const sides = parseLunchMenuDescription(lunchMenuData.description);

        return (
          <>
            <Typography className="font-bold! underline text-(--fg-accent1)">{main}</Typography>
            {sides.map((side, index) => (
              <Typography key={index}>{side}</Typography>
            ))}
            {hasVegan &&
              <Typography variant="body2" className="italic">
                &#x1f331; Vegetarian or vegan option available!
              </Typography>
            }
          </>
        );
      })()
  );
}
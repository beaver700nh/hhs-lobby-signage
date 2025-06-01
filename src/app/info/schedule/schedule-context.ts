import { createContext } from "react";

import ical from "node-ical";

export const ScheduleContext = createContext<Promise<ical.VEvent | null>>(new Promise(() => {}));

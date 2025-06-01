import { createContext } from "react";
import ical from "node-ical";

export const LunchMenuContext = createContext<Promise<ical.VEvent | null>>(new Promise(() => {}));

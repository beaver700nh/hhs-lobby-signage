import { createContext } from "react";
import ical from "node-ical";
import { Calendars } from "./definitions";

export type ContextType = Promise<ical.VEvent | null>;

export const Contexts = new Map(Calendars.map(
  ({ name }) => [ name, createContext<ContextType>(new Promise(() => {})) ]
));
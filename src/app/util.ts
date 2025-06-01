// import { test_calculateRelativeDate } from "./util_test";
// test_calculateRelativeDate();

export function log(method: (this: Console, ...args: string[]) => any, ...args: string[]) {
  method.call(console, "::", ...args);
}

export function minToMs(min: number) {
  return min * 60 * 1000;
}

export function dayToMs(day: number) {
  return minToMs(day * 24 * 60);
}

export function msToDay(ms: number) {
  return ms / 1000 / 3600 / 24;
}

export function reinterpretAsLocal(date: Date) {
  return new Date(date.toISOString().replace(/Z$/, ""));
}

export function toMidnight(date: Date) {
  const out = new Date(date);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function toMostRecentSunday(date: Date) {
  const dayOfWeek = date.getDay();

  const out = toMidnight(date);
  out.setDate(out.getDate() - dayOfWeek);
  return out;
}

export function isSameWeek(t1: Date, t2: Date) {
  return toMostRecentSunday(t1).getTime() === toMostRecentSunday(t2).getTime();
}

export function calculateRelativeDate(date: Date, _now?: Date) {
  // disregard time info and only consider date
  const now = toMidnight(_now ?? new Date());
  const then = toMidnight(date);

  const diff = msToDay(then.getTime() - now.getTime());

  if (diff === 0) {
    return "today";
  }
  else if (diff === -1) {
    return "yesterday";
  }
  else if (diff === 1) {
    return "tomorrow";
  }

  const dist = Math.abs(diff);

  if (dist > 7) {
    return null; // too far for relative descriptions
  }

  /**
   *    |    Sun    |    Mon    |    Tue    |    Wed    |    Thu    |    Fri    |    Sat    |
   * ---+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
   *  S |   last    |           |           |           |           |           |           |
   *  M |   last    |   last    |           |           |           |           |           |
   *  T |   last    |   last    |   last    |           |           |           |           |
   *  W |   last    |   last    |   last    |   last    |           |           |           |
   *  T |   last    |   last    |   last    |   last    |   last    |           |           |
   *  F |   last    |   last    |   last    |   last    |   last    |   last    |           |
   *  S | yesterday |    OTW    |    OTW    |   last    |   last    |   last    |   last    |
   * ---+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
   *  S |   today   | yesterday |    OTW    |    LW     |    LW     |    LW     |    LW     |
   *  M | tomorrow  |   today   | yesterday |   this    |   this    |   this    |   this    |
   *  T |   this    | tomorrow  |   today   | yesterday |   this    |   this    |   this    |
   *  W |   this    |   this    | tomorrow  |   today   | yesterday |   this    |   this    |
   *  T |   this    |   this    |   this    | tomorrow  |   today   | yesterday |   this    |
   *  F |   this    |   this    |   this    |   this    | tomorrow  |   today   | yesterday |
   *  S |    NW     |    NW     |    NW     |    NW     |    TW     | tomorrow  |   today   |
   * ---+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
   *  S |   next    |   next    |   next    |   next    |    TW     |    TW     | tomorrow  |
   *  M |           |   next    |   next    |   next    |   next    |   next    |   next    |
   *  T |           |           |   next    |   next    |   next    |   next    |   next    |
   *  W |           |           |           |   next    |   next    |   next    |   next    |
   *  T |           |           |           |           |   next    |   next    |   next    |
   *  F |           |           |           |           |           |   next    |   next    |
   *  S |           |           |           |           |           |           |   next    |
   */

  const dayOfWeekThen = then.toLocaleDateString(undefined, { weekday: "long" });

  // @ts-ignore: Bitwise hack to make multiple comparisons at once
  const areNearWeekend = !!(now.getDay() < 3) + !!(diff < 0);
  const weekendProximity = Math.abs(now.getDay() - 3);

  // now/then are near to each other and to the weekend
  if ((areNearWeekend & 1) === 0 && (false
    || weekendProximity === 2 && dist === 2
    || weekendProximity === 1 && dist <= 3)
  ) {
    return `${dayOfWeekThen} ${areNearWeekend & 2 ? "over the" : "this"} weekend`;
  }
  else if (!isSameWeek(now, then)) {
    return `${diff < 0 ? "last" : "next"} ${dayOfWeekThen}`;
  }
  else if (then.getDay() === 0) {
    return `${dayOfWeekThen} last weekend`;
  }
  else if (then.getDay() === 6) {
    return `${dayOfWeekThen} next weekend`;
  }
  else {
    return `this ${dayOfWeekThen}`;
  }
}

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

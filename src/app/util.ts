export function log(method: (this: Console, ...args: string[]) => any, ...args: string[]) {
  method.call(console, "::", ...args);
}

export function minToMs(min: number) {
  return min * 60 * 1000;
}

export function dayToMs(day: number) {
  return minToMs(day * 24 * 60);
}
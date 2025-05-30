export function log(method: (this: Console, ...args: string[]) => any, ...args: string[]) {
  method.call(console, "[ LOG ] ::", ...args);
}
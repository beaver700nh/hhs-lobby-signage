import moment from "moment";

export const Intervals = {
  FETCH: moment.duration(1, "h").as("ms"),
  SCROLL: moment.duration(10, "s").as("ms"),
};

import { use, useContext } from "react";
import { Contexts } from "../../calendars/contexts";

export default function LunchMenuContent() {
  const lunchMenuData = use(useContext(Contexts.get("lunchMenu")!));

  return (
    <p>Hi, {lunchMenuData?.summary ?? "error"}</p>
  );
}
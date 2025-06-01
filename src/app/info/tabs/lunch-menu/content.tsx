import { use, useContext } from "react";
import { LunchMenuContext } from "../../context/lunch-menu/lunch-menu-context";

export default function LunchMenuContent() {
  const lunchMenuData = use(useContext(LunchMenuContext));

  return (
    <p>Hi, {lunchMenuData?.summary ?? "error"}</p>
  );
}
import { Suspense } from "react";
import LunchMenuLoading from "./loading";
import LunchMenuContent from "./content";

export default function LunchMenu() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Suspense fallback={<LunchMenuLoading />}>
        <LunchMenuContent />
      </Suspense>
    </div>
  );
}

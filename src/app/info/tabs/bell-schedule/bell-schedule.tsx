import { Suspense } from "react";
import BellScheduleLoading from "./loading";
import BellScheduleContent from "./content";

export default function BellSchedule() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Suspense fallback={<BellScheduleLoading />}>
        <BellScheduleContent />
      </Suspense>
    </div>
  );
}

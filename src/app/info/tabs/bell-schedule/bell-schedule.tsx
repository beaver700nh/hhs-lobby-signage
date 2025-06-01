import { Suspense } from "react";
import BellScheduleLoading from "./loading";
import BellScheduleContent from "./content";

export default function BellSchedule() {
  return (
    <div>
      <Suspense fallback={<BellScheduleLoading />}>
        <BellScheduleContent />
      </Suspense>
    </div>
  )
}
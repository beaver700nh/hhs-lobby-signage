import { Suspense } from "react";
import TitleLoading from "./loading";
import TitleContent from "./content";

export default function Title() {
  return (
    <div className="h-full flex flex-col justify-between gap-2 *:basis-0 *:grow">
      <Suspense fallback={<TitleLoading />}>
        <TitleContent />
      </Suspense>
    </div>
  );
}

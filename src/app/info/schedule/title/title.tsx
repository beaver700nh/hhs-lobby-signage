import { Suspense } from "react";
import TitleLoading from "./loading";
import TitleContent from "./content";

export default function Title() {
  return (
    <div className="h-full flex flex-col justify-center gap-2 *:empty:hidden">
      <Suspense fallback={<TitleLoading />}>
        <TitleContent />
      </Suspense>
    </div>
  );
}

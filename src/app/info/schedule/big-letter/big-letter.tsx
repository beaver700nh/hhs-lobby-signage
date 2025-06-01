import { Suspense } from "react";
import BigLetterLoading from "./loading";
import BigLetterContent from "./content";

export default function BigLetter() {
  return (
    <div className="h-full aspect-square flex flex-row justify-center items-center">
      <Suspense fallback={<BigLetterLoading />}>
        <BigLetterContent />
      </Suspense>
    </div>
  );
}

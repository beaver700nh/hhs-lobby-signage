import { Suspense } from "react";
import BigLetterLoading from "./loading";
import BigLetterContent from "./content";

export default function BigLetter() {
  return (
    <div className="aspect-square">
      <Suspense fallback={<BigLetterLoading />}>
        <BigLetterContent />
      </Suspense>
    </div>
  );
}

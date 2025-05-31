import { Suspense } from "react";
import BigLetter from "./big-letter";
import BigLetterLoading from "./big-letter-loading";
import styles from "../styles.module.css";
import ScheduleInjector from "./schedule-injector";

import { getSchedule } from "./get-schedule";

export default function InfoPanel() {

  return (
    <section className={`${styles.panel} basis-0 min-w-0 grow`}>
      <ScheduleInjector initial={getSchedule()}>
        <Suspense fallback={<BigLetterLoading />}>
          <BigLetter />
        </Suspense>
      </ScheduleInjector>
    </section>
  );
}

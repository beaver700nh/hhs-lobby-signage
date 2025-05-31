"use client";

import { Suspense, useState, useEffect } from "react";
import BigLetter from "./big-letter";
import BigLetterLoading from "./big-letter-loading";
import styles from "../styles.module.css";
import { getSchedule } from "./get-schedule";
import * as util from "../util";

const REFRESH_INTERVAL = 1000 * 60 * 15; // every 15 minutes

export default function InfoPanel() {
  const [schedule, setSchedule] = useState<Promise<any>>();

  useEffect(() => {
    const interval = setInterval((function update() {
      util.log(console.info, "Refreshing info panel on periodic interval.");

      const refreshTime = new Date();
      setSchedule(getSchedule(refreshTime));

      return update;
    })(), REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${styles.panel} basis-0 grow`}>
      <Suspense fallback={<BigLetterLoading />}>
        <BigLetter schedule={schedule} />
      </Suspense>
    </section>
  );
}

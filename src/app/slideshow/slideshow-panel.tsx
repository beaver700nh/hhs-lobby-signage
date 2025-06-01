"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles.module.css";
import * as util from "@/app/util";

const REFRESH_INTERVAL = util.minToMs(60);

const SLIDESHOW_URL = "https://docs.google.com/presentation/d/e/2PACX-1vROO4Y7tVDDnf0iDH0U3CzeecQxCOctDw_MgXkCrpyKHVRqVSCz0lzpKlyL1LiA_LGWUEX7u585lF1A/embed";

export default function SlideshowPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      util.log(console.info, "Refreshing slideshow on periodic interval.");
      setRefreshKey(x => x + 1);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={`${styles.panel} basis-[fit-content]`}>
      <iframe
        key={refreshKey}
        className="border-none h-[calc(100%+4px)] m-[-2px] aspect-[4/3]"
        allowFullScreen={true}
        src={`${SLIDESHOW_URL}?start=true&loop=true&delayms=8000&rm=minimal`}
      ></iframe>
    </section>
  );
}

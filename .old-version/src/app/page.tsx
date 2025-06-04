import InfoPanel from "./info/info-panel";
import SlideshowPanel from "./slideshow/slideshow-panel";

import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={`${styles.mainContent} flex flex-row content-stretch p-6 gap-4 *:rounded-2xl *:overflow-clip`}>
      <InfoPanel />
      <SlideshowPanel />
    </div>
  );
}

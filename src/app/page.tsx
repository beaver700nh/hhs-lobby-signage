import InfoPanel from "./info/info-panel";
import SlideshowPanel from "./slideshow/slideshow-panel";

export default function Home() {
  return (
    <>
      <InfoPanel date={new Date()} />
      <SlideshowPanel />
    </>
  );
}

import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Intervals } from "@/config";
import "./SlideshowPanel.css"

const SLIDESHOW_URL = "https://docs.google.com/presentation/d/e/2PACX-1vROO4Y7tVDDnf0iDH0U3CzeecQxCOctDw_MgXkCrpyKHVRqVSCz0lzpKlyL1LiA_LGWUEX7u585lF1A";
const SLIDESHOW_EMBED = `${SLIDESHOW_URL}/embed?start=true&loop=true&delayms=${Intervals.SCROLL}&rm=minimal`;

export default function SlideshowPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.info("Refreshing slideshow on periodic interval.");
      setRefreshKey(x => x + 1);
    }, Intervals.FETCH);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper className="panel">
      <iframe key={refreshKey} allowFullScreen={true} src={SLIDESHOW_EMBED} sandbox="allow-scripts" />
    </Paper>
  );
}

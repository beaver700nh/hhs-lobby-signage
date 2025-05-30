import styles from "../styles.module.css";

const SLIDESHOW_URL = "https://docs.google.com/presentation/d/e/2PACX-1vROO4Y7tVDDnf0iDH0U3CzeecQxCOctDw_MgXkCrpyKHVRqVSCz0lzpKlyL1LiA_LGWUEX7u585lF1A/embed";

export default function SlideshowPanel() {
  return (
    <section className={`${styles.panel} basis-[fit-content] overflow-clip`}>
      <iframe
        className="border-none h-[calc(100%+4px)] m-[-2px] aspect-[4/3]"
        allowFullScreen={true}
        src={`${SLIDESHOW_URL}?start=true&loop=true&delayms=8000&rm=minimal`}
      ></iframe>
    </section>
  );
}

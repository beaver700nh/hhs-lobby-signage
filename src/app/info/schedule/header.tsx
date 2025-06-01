import { Suspense } from "react";
import BigLetter from "./big-letter/big-letter";
import Title from "./title/title";
import styles from "@/app/styles.module.css";

export default function InfoHeader() {
  return (
    <div className="bg-red-500 h-[25vh] flex flex-row p-4 gap-4">
      <div className={`${styles.headerSection} flex`}>
        <BigLetter />
      </div>
      <div className={`${styles.headerSection} grow`}>
        <Title />
      </div>
    </div>
  );
}

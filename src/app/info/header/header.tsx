import BigLetter from "./big-letter/big-letter";
import Title from "./title/title";
import styles from "@/app/styles.module.css";

export default function InfoHeader() {
  return (
    <div className="basis-[17vh] flex flex-row px-4 gap-2">
      <div>
        <BigLetter />
      </div>
      <div className="grow">
        <Title />
      </div>
    </div>
  );
}

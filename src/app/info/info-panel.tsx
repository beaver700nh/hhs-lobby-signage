import ScheduleInjector from "./schedule/schedule-injector";
import InfoHeader from "./header/header";
import InfoTabs from "./tabs/tabs";
import styles from "@/app/styles.module.css";

export default function InfoPanel() {
  return (
    <section className={`${styles.panel} basis-0 min-w-0 grow flex flex-col py-4 gap-4`}>
      <ScheduleInjector>
        <InfoHeader />
        <InfoTabs />
      </ScheduleInjector>
    </section>
  );
}

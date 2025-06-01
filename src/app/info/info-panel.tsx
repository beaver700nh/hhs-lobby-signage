import ScheduleInjector from "./schedule/schedule-injector";
import InfoHeader from "./schedule/header";
import { getSchedule } from "./schedule/get-schedule";
import styles from "@/app/styles.module.css";

export default function InfoPanel() {
  return (
    <section className={`${styles.panel} basis-0 min-w-0 grow`}>
      <ScheduleInjector initial={getSchedule()}>
        <InfoHeader />
      </ScheduleInjector>
    </section>
  );
}

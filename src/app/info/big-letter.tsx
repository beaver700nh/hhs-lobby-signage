import ical from "node-ical";

export default async function BigLetter({
  schedule,
}: {
  schedule: Promise<ical.VEvent[]>,
}) {
  const scheduleData = await schedule;
  console.log(scheduleData);

  return (
    <p>{scheduleData.length} entries</p>
  );
}
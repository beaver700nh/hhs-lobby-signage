import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import styles from "@/app/styles.module.css";

export default function BellScheduleLoading() {
  return (
    <table className="w-full table-fixed">
      <tbody>
        {Array.from({ length: 8 }, (_, i) => (
          <tr key={i} className={`${styles.bellScheduleEntry}`}>
            {Array.from({ length: 2 }, (_, j) => (
              <td key={j}>
                <Skeleton className="inline-block!" variant="rounded" width="75%">
                  <Typography>&zwsp;</Typography>
                </Skeleton>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
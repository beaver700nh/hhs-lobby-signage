import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

export default function LunchMenuLoading() {
  return (
    <>
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} variant="rounded" width={i === 0 ? "60%" : "40%"}>
          <Typography>&zwsp;</Typography>
        </Skeleton>
      ))}
      <Skeleton variant="rounded" width="70%">
        <Typography variant="body2">&zwsp;</Typography>
      </Skeleton>
    </>
  );
}

import { Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export default function TitleLoading() {
  return (
    <>
      <Skeleton variant="rounded" width="100%">
        <Typography variant="h4">&zwsp;</Typography>
      </Skeleton>
      <Skeleton variant="rounded" width="100%">
        <Typography variant="h4">&zwsp;</Typography>
      </Skeleton>
    </>
  );
}
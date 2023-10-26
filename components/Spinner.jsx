import { CircularProgress } from "@mui/material";

export { Spinner };

function Spinner() {
  return (
    <>
      <br />
      <CircularProgress className="loading-indicator" />
      <br />
    </>
  );
}

import { CircularProgress } from "@mui/material";
import React from "react";

export { Layout };

function Layout({ children, isLoading }) {
  return (
    <div id="content-layout">
      {isLoading && (
        <div className="loading-container">
          <CircularProgress className="loading-indicator-1" />
        </div>
      )}
      <div className="container">{children}</div>
    </div>
  );
}

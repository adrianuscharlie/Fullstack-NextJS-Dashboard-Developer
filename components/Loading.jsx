import React from "react";
import { ClipLoader } from "react-spinners";
export default function Loading() {
  return (
    <ClipLoader
        color={"#000000"}
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  );
}
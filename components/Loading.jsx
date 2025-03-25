import React from "react";
import { ClipLoader } from "react-spinners";
export default function Loading() {
  return (
    <div className="flex w-full min-w-max justify-center items-center">
      <ClipLoader
        color={"#000000"}
        loading={true}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
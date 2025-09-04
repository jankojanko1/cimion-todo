import React from "react";

export default function GlobalNotFound() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span className="font-array text-4xl">
        the {`'pathname'`} does not exist
      </span>
    </div>
  );
}

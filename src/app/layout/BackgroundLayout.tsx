import React from "react";
import dynamic from "next/dynamic";

const Background = dynamic(() => import("./background/Background"), {
  ssr: false,
  loading: () => (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-200" />
  ),
});

export default function BackgroundLayout() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Background />
    </div>
  );
}

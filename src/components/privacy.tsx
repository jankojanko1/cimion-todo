"use client";

import { useState } from "react";

export default function Privacy() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    isVisible && (
      <div className="w-full h-10 bg-white fixed bottom-0 left-0 flex items-center justify-between px-4 gap-10 z-50">
        <span className="text-black font-general md:text-sm max-md:text-xs">
          This is a fun project and all your data is safe. It was created to
          simply test things like docker, prisma and postgres. Enjoy {`:)`}
        </span>
        <button
          className="text-black font-general text-xl rotate-45 hover:scale-110 transition-all"
          onClick={() => setIsVisible(false)}
        >
          x
        </button>
      </div>
    )
  );
}

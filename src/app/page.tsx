import React from "react";
// import Privacy from "@/components/privacy";

export default function page() {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center text-black px-4">
        <div className="max-md:w-full md:w-3/4 h-screen flex justify-center flex-col gap-10">
          <div className="header-title font-general">
            A to-do app that&apos;s proudly{" "}
            <span className="font-array">unoriginal</span> — but exactly what
            you need.
          </div>
          <div className="flex gap-4 font-array">
            <a
              aria-label="dashboard"
              href="/dashboard"
              className="relative w-fit p-2 bg-transparent border-2 border-black hover:bg-black hover:text-white duration-300 ease-in-out transition-all rounded-xl"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

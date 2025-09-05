"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { registerUser } from "../actions/auth";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line react-hooks/rules-of-hooks

  return (
    <div className="w-full h-screen px-2 md:px-4 flex justify-center items-center font-general">
      <div className="max-md:w-full sm:w-3/5 lg:w-2/5 2xl:w-1/4 h-auto bg-black bg-opacity-10 text-black flex flex-col p-2">
        <div className="w-full flex justify-between text-xs">
          <span className="font-array text-sm">Register page</span>
          <Link href="/login">If you have acc you can sign in here.</Link>
        </div>
        <div className="form pt-2">
          <form
            action={(formData) =>
              startTransition(async () => {
                const res = await registerUser(formData);
                if (res?.error) {
                  setError(res.error);
                } else {
                  setError(null);
                }
              })
            }
            className="w-full h-full flex flex-col justify-center gap-4"
          >
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="w-full placeholder-black bg-transparent outline-none"
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full placeholder-black bg-transparent outline-none"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full p-2 font-array bg-transparent border border-black hover:bg-black hover:text-white duration-300 ease-in-out transition-all rounded-xl"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useTransition } from "react";
import { loginUser, getCurrentUser } from "../actions/auth";
import Link from "next/link";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full h-screen px-2 md:px-4 flex justify-center items-center font-general">
      <div className="max-md:w-full sm:w-3/5 lg:w-2/5 2xl:w-1/4 h-auto bg-black bg-opacity-10 text-black flex flex-col p-2">
        <div className="w-full flex justify-between text-xs">
          <span className="font-array text-sm">Sign in page</span>
          <Link href="/register">
            If you don&apos;t have acc you can create it here.
          </Link>
        </div>
        <div className="form pt-2">
          <form
            action={(formData) =>
              startTransition(async () => {
                const res = await loginUser(formData);
                if (res.error) {
                  setError(res.error);
                } else {
                  await getCurrentUser();
                  setTimeout(() => {
                    window.location.href = "/dashboard";
                  }, 200);
                }
              })
            }
            className="w-full h-full flex flex-col justify-center gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full placeholder-black bg-transparent outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full placeholder-black bg-transparent outline-none"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full p-2 bg-transparent border font-array border-black hover:bg-black hover:text-white duration-300 ease-in-out transition-all rounded-xl"
            >
              {isPending ? "Loguję..." : "Zaloguj"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

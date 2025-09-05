"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { logoutUser, getCurrentUser } from "@/app/actions/auth";

export default function Header() {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const u = await getCurrentUser();
      setUser(u);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="w-full absolute top-0 left-0 h-10 flex justify-between items-center px-2 md:px-4 font-light text-2xl font-array">
      <Link href="/">cimion</Link>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link href="/login">sign in</Link>
            <Link href="/register">register</Link>
          </>
        ) : (
          <>
            <span className="max-md:hidden">hi, {user.name}</span>
            <button onClick={handleLogout} className="text-red-600">
              sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

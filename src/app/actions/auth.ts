"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function isAuthenticated() {
  const token = cookies().get("session")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function registerUser(formData: FormData) {
  const existingToken = cookies().get("session")?.value;
  if (existingToken) {
    return { error: "Jesteś już zalogowany/register" };
  }

  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) return { error: "Wprowadź wszystkie pola" };

  if (name.length > 12) {
    return { error: "Nazwa użytkownika może mieć maksymalnie 12 liter" };
  }

  const existing = await prisma.user.findUnique({ where: { name } });
  if (existing) return { error: "Użytkownik o tej nazwie już istnieje" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, password: hashedPassword },
  });

  redirect("/login");

  return { success: true };
}
export async function loginUser(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    if (!name || !password) {
      return { error: "Wprowadź wszystkie pola" };
    }

    const user = await prisma.user.findUnique({ where: { name } });

    if (!user) {
      return { error: "Nieprawidłowy login lub hasło" };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return { error: "Nieprawidłowy login lub hasło" };
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Błąd serwera, spróbuj ponownie" };
  }
}

export async function logoutUser() {
  cookies().delete("session");
  revalidatePath("/");
}

export async function getCurrentUser() {
  const token = cookies().get("session")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return null;
    return { id: user.id, name: user.name };
  } catch {
    return null;
  }
}

"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../lib/db";
import { getCurrentUser } from "./auth";

export async function addTask(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;

  await prisma.task.create({
    data: {
      title,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function addSubtask(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const taskId = parseInt(formData.get("taskId") as string, 10);
  const title = formData.get("title") as string;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });
  if (!task || task.userId !== user.id) throw new Error("Unauthorized");

  await prisma.subtask.create({
    data: {
      title,
      taskId,
    },
  });

  revalidatePath("/dashboard");
}

export async function removeTask(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const id = parseInt(formData.get("id") as string, 10);
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== user.id) throw new Error("Unauthorized");

  await prisma.task.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export async function removeSubtask(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const id = parseInt(formData.get("id") as string, 10);
  const subtask = await prisma.subtask.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!subtask || subtask.task.userId !== user.id)
    throw new Error("Unauthorized");

  await prisma.subtask.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export async function updateTaskStatus(id: number, status: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task || task.userId !== user.id) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { completed: status as any },
  });
  revalidatePath("/dashboard");
}

export async function updateSubtaskStatus(id: number, status: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const subtask = await prisma.subtask.findUnique({
    where: { id },
    include: { task: true },
  });
  if (!subtask || subtask.task.userId !== user.id)
    throw new Error("Unauthorized");

  await prisma.subtask.update({
    where: { id },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { completed: status as any },
  });
  revalidatePath("/dashboard");
}

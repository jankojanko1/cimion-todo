import React from "react";
import prisma from "../../lib/db";
import AddTaskForm from "@/components/addFormTask";
import TaskList from "@/components/tasks";
import { isAuthenticated } from "../actions/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const userId = await isAuthenticated();
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    include: { subtasks: true },
  });

  return (
    <div className="w-full max-md:px-2 md:px-4">
      <div className="w-full flex min-h-screen justify-start md:justify-center items-center pt-40 pb-40">
        <div className="max-lg:w-full lg:w-2/3 2xl:w-[62.5%] bg-black bg-opacity-10 text-black flex flex-col">
          <div className="h-10 w-full border border-black flex items-center">
            <div className="w-1/6 h-full flex items-center pl-2">
              <span className="font-array">Status</span>
            </div>
            <div className="max-2xl:w-5/6 2xl:w-4/6 border-l-[1px] border-black h-full flex items-center pl-2">
              <span className="font-array">Name</span>
            </div>
            <div className="max-2xl:hidden 2xl:w-1/6 border-l-[1px] border-black h-full flex items-center pl-2">
              <span className="font-array">Date</span>
            </div>
          </div>
          <TaskList tasks={tasks} />
          <AddTaskForm />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { removeTask, removeSubtask, addSubtask } from "../app/actions/actions";
import TaskStatusUpdater from "@/components/TaskStatusUpdater";

interface Subtask {
  id: number;
  title: string;
  completed: string;
  createdAt: string | Date;
}

interface Task {
  id: number;
  title: string;
  completed: string;
  createdAt: string | Date;
  subtasks: Subtask[];
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);

  const toggleExpand = (taskId: number) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const formSubRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addSubtask(formData);
    formSubRef.current?.reset();
  };

  return (
    <>
      {tasks.map((task) => (
        <div key={task.id} className="border-b border-black">
          <div className="h-10 w-full border-r border-l border-black flex items-center relative">
            <div className="absolute left-1 lg:-left-6 text-xs">
              <button onClick={() => toggleExpand(task.id)}>
                {expandedTasks.includes(task.id) ? "↑" : "→"}
              </button>
            </div>
            <div className="w-1/6 h-full flex items-center pl-5 lg:pl-2">
              <TaskStatusUpdater
                taskId={task.id}
                currentStatus={task.completed}
                type="task"
              />
            </div>
            <div className="max-2xl:w-5/6 2xl:w-4/6 border-l border-black h-full flex items-center pl-4">
              <span className="max-md:text-sm text-nowrap overflow-hidden text-ellipsis pr-6">
                {task.title}
              </span>
            </div>
            <div className="max-2xl:hidden 2xl:w-1/6 border-l border-black h-full flex items-center pl-4 ">
              <span className="">
                {new Date(task.createdAt).toISOString().split("T")[0]}
              </span>
            </div>
            <div className="absolute max-2xl:right-2 2xl:-right-4 flex items-center h-full">
              <form action={removeTask}>
                <input type="hidden" name="id" value={task.id} />
                <button type="submit" className="text-red-600">
                  x
                </button>
              </form>
            </div>
          </div>

          {expandedTasks.includes(task.id) && (
            <div className="bg-gray-200 bg-opacity-30 border-t border-black">
              <div className="flex-col">
                {task.subtasks.map((sub) => (
                  <li
                    key={sub.id}
                    className="h-10 w-full border-r border-l border-b border-black flex items-center relative"
                  >
                    <div className="w-1/6 h-full flex items-center pl-5 md:pl-6">
                      <span className="font-general">
                        <TaskStatusUpdater
                          taskId={sub.id}
                          currentStatus={sub.completed}
                          type="subtask"
                        />
                      </span>
                    </div>
                    <div className="max-2xl:w-5/6 2xl:w-4/6 h-full flex items-center pl-6 md:pl-8 border-l-[1px] border-black">
                      <span className="font-general max-md:text-sm text-nowrap overflow-hidden text-ellipsis pr-6">
                        {sub.title}
                      </span>
                    </div>
                    <div className="max-2xl:hidden 2xl:w-1/6 h-full flex items-center pl-6 border-l-[1px] border-black">
                      <span className="font-general max-md:hidden">
                        {" "}
                        {new Date(sub.createdAt).toISOString().split("T")[0]}
                      </span>
                    </div>
                    <div className="absolute max-2xl:right-2 2xl:-right-4 flex items-center h-full">
                      <form action={removeSubtask}>
                        <input type="hidden" name="id" value={sub.id} />
                        <button type="submit" className="text-red-600">
                          x
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </div>

              <form ref={formSubRef} action={handleSubmit}>
                <div className="h-10 w-full border-r border-l border-black flex items-center relative">
                  <div className="w-1/6 h-full flex items-center pl-2 md:pl-6">
                    <span className="max-2xl:hidden font-array">
                      New sub-item
                    </span>
                    <span className="2xl:hidden font-array text-sm">
                      New sub
                    </span>
                  </div>
                  <div className="w-4/6 border-l-[1px] border-black h-full flex items-center pl-2 md:pl-4">
                    <input type="hidden" name="taskId" value={task.id} />
                    <input
                      type="text"
                      name="title"
                      placeholder="..."
                      className="font-general bg-transparent user-select-none outline-none w-full placeholder-gray-500 pl-4"
                      required
                    />
                  </div>
                  <div className="max-2xl:hidden 2xl:w-1/6 border-l-[1px] border-black h-full flex items-center"></div>
                  <div className="absolute max-2xl:right-2 2xl:-right-4 flex items-center h-full">
                    <button
                      type="submit"
                      className="font-array text-base text-green-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

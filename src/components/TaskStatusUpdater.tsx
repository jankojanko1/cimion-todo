"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { updateTaskStatus, updateSubtaskStatus } from "../app/actions/actions";

interface TaskStatusUpdaterProps {
  taskId: number;
  currentStatus: string;
  type: "task" | "subtask";
}

const statusOptions = [
  { label: "Not completed", value: "NOT_COMPLETED", bg: "bg-gray-500" },
  { label: "In progress", value: "IN_PROGRESS", bg: "bg-blue-500" },
  { label: "Done", value: "DONE", bg: "bg-green-500" },
];

export default function TaskStatusUpdater({
  taskId,
  currentStatus,
  type,
}: TaskStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    statusOptions.find((o) => o.value === status) || statusOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newStatus: string) => {
    setStatus(newStatus);
    setIsOpen(false);
    startTransition(async () => {
      if (type === "task") {
        await updateTaskStatus(taskId, newStatus);
      } else {
        await updateSubtaskStatus(taskId, newStatus);
      }
    });
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-white">
      <div
        onClick={() => !isPending && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 cursor-pointer max-md:py-1 rounded-full px-2 ${currentOption.bg} bg-opacity-50`}
      >
        <div className={`w-3 h-3 rounded-full ${currentOption.bg}`}></div>
        <span className="max-2xl:hidden text-sm">{currentOption.label}</span>
      </div>

      {isOpen && (
        <ul className="absolute left-0 mt-1 w-max bg-gray-300 bg-opacity-30 z-10 pl-2 py-1 flex flex-col backdrop-blur-md gap-1">
          {statusOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={` cursor-pointer text-black flex items-center gap-1 pr-2 text-sm`}
            >
              <div className={`${option.bg} w-2 h-2 rounded-full`}></div>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

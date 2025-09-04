"use client";

import React, { useRef } from "react";
import { addTask } from "../app/actions/actions";

export default function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addTask(formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit}>
      <div className="h-10 w-full border-r border-l border-b border-black flex items-center relative">
        <div className="w-1/6 h-full flex items-center pl-2">
          <span className="font-array text-sm">New item</span>
        </div>
        <div className="w-4/6 border-l-[1px] border-black h-full flex items-center px-4">
          <input
            type="text"
            name="title"
            placeholder="..."
            className="font-general bg-transparent user-select-none outline-none w-full placeholder-gray-500"
            required
          />
        </div>
        <div className="max-2xl:hidden 2xl:w-1/6 border-l-[1px] border-black h-full flex items-center"></div>
        <div className="absolute max-2xl:right-2 2xl:-right-4 flex items-center h-full">
          <button type="submit" className="font-array text-base text-green-600">
            +
          </button>
        </div>
      </div>
    </form>
  );
}

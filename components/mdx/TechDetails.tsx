"use client";

import { useId, useState } from "react";

export function TechDetails({ title = "Technical Details", children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="my-swiss-6 border border-swiss-gray-200">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="w-full flex justify-between items-center p-swiss-4 text-left font-semibold text-[0.875rem] uppercase tracking-[0.1em] cursor-pointer hover:bg-swiss-gray-50 transition-colors duration-100"
      >
        {title}
        <span className="text-swiss-gray-400">{open ? "\u2212" : "+"}</span>
      </button>
      {open && (
        <div id={contentId} className="p-swiss-6 pt-0 border-t border-swiss-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

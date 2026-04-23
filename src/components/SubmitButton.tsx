"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  variant?: "primary" | "danger" | "secondary";
}

export function SubmitButton({
  children,
  loadingText = "Processing...",
  className,
  variant = "primary",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand text-white hover:bg-brand-800 shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button type="submit" disabled={pending} className={cn(base, variants[variant], className)}>
      {pending ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface ConfirmButtonProps {
  action: () => Promise<void>;
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
}

export function ConfirmButton({ action, confirmMessage, children, className }: ConfirmButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (confirm(confirmMessage)) {
      startTransition(() => action());
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors disabled:opacity-60",
        className
      )}
    >
      {pending ? "Deleting..." : children}
    </button>
  );
}

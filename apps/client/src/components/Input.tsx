import { cn } from "@/utils/ui/cn";
import { cva } from "class-variance-authority";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
};

export const inputVariants = cva(
  "border-input shadow-xs bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
);

export function Input({ className, type, ref, ...props }: InputProps) {
  return <input type={type} className={cn(inputVariants(), className)} ref={ref} {...props} />;
}

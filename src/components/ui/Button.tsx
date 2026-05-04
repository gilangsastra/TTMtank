import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-[var(--color-paper)] " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-accent)]",
  secondary:
    "bg-transparent text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-ink)]",
  ghost: "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-accent-soft)]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm rounded-[var(--radius-md)]",
  lg: "h-12 px-7 text-[15px] rounded-[var(--radius-md)]",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

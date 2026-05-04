import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: Props) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}
      {...props}
    />
  );
}

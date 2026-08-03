import { cn } from "@/lib/utils";
import type { FC, ReactNode } from "react";

interface ProgressRingProps {
  className?: string;
  paused?: boolean;
  percent: number;
  size?: number;
  strokeWidth?: number;
  center?: ReactNode;
}

export const ProgressRing: FC<ProgressRingProps> = ({
  className,
  percent,
  size = 40,
  strokeWidth = 4,
  center,
  paused,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-foreground/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-300 ease-out",
            paused ? "stroke-foreground group-hover:stroke-primary" : "stroke-primary",
          )}
        />
      </svg>
      {center && (
        <span className="absolute inset-0 flex items-center justify-center text-base font-bold tabular-nums *:fill-foreground group-hover:*:fill-primary [&_svg]:size-5 *:transition-colors">
          {center}
        </span>
      )}
    </div>
  );
};

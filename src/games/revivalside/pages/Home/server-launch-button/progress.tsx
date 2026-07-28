import { cn, formatHms } from "@/lib/utils";
import { ClockIcon, DownloadIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

interface ProgressRingProps {
  paused?: boolean;
  percent: number;
  size?: number;
  strokeWidth?: number;
  center: ReactNode;
}

export const ProgressRing: FC<ProgressRingProps> = ({ percent, size = 40, strokeWidth = 4, center, paused }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
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
      <span className="absolute inset-0 flex items-center justify-center text-base font-bold tabular-nums *:fill-foreground group-hover:*:fill-primary [&_svg]:size-5 *:transition-colors">
        {center}
      </span>
    </div>
  );
};

export interface ProgressButtonState {
  mode: "progress";
  percent: number;
  secondsLeft?: number;
  paused?: boolean;
  label?: ReactNode;
  pausedLabel?: ReactNode;
  hoverLabel?: ReactNode;
  resumeHoverLabel?: ReactNode;
}

export const ProgressContent: FC<ProgressButtonState & { hovered: boolean }> = ({
  percent,
  secondsLeft = 0,
  paused,
  label = "Downloading...",
  pausedLabel = "Paused",
  hoverLabel = "Pause",
  resumeHoverLabel = "Resume",
  hovered,
}) => {
  const center = paused ? (
    <PlayIcon color="relative" />
  ) : hovered ? (
    <PauseIcon color="relative" />
  ) : (
    Math.floor(percent)
  );

  return (
    <>
      <ProgressRing percent={percent} center={center} paused={paused} />
      {!paused && !hovered ? (
        <span className="flex flex-col items-start leading-tight text-left">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <DownloadIcon className="size-3.5" />
            {label}
          </span>
          <span className="flex items-center gap-1.5 text-xs opacity-80 tabular-nums">
            <ClockIcon className="size-3.5" />
            {formatHms(secondsLeft)}
          </span>
        </span>
      ) : (
        <span className="text-lg font-extrabold">
          {paused ? (hovered ? resumeHoverLabel : pausedLabel) : hovered ? hoverLabel : label}
        </span>
      )}
    </>
  );
};

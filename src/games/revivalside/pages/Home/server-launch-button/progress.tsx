import { ProgressRing } from "@/components/progress-ring";
import { formatHms } from "@/lib/utils";
import { ClockIcon, DownloadIcon, PauseIcon, PlayIcon } from "lucide-react";
import type { FC, ReactNode } from "react";

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
      <div className="flex-1">
        {!paused && !hovered ? (
          <div className="flex flex-col leading-tight text-left w-fit">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <DownloadIcon className="size-3.5" />
              {label}
            </span>
            <span className="flex items-center gap-1.5 text-xs opacity-80 tabular-nums">
              <ClockIcon className="size-3.5" />
              {formatHms(secondsLeft)}
            </span>
          </div>
        ) : (
          <span className="text-lg font-extrabold">
            {paused ? (hovered ? resumeHoverLabel : pausedLabel) : hovered ? hoverLabel : label}
          </span>
        )}
      </div>
    </>
  );
};

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ActionContent, type ActionButtonState } from "@/games/revivalside/pages/Home/server-launch-button/action";
import {
  ProgressContent,
  type ProgressButtonState,
} from "@/games/revivalside/pages/Home/server-launch-button/progress";
import { cn } from "@/lib/utils";
import { useState, type FC, type ReactNode } from "react";

export type ServerLaunchButtonState = ActionButtonState | ProgressButtonState;

interface ServerLaunchButtonProps {
  onClick: () => void;
  disabled?: boolean;
  tooltip?: ReactNode;
  state: ServerLaunchButtonState;
}

export const ServerLaunchButton: FC<ServerLaunchButtonProps> = ({ onClick, disabled, tooltip, state }) => {
  const [hovered, setHovered] = useState(true);

  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        " group h-14 min-w-56 border-none gap-4 flex px-4 justify-center items-center rounded-full",
        "bg-primary text-primary-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors",
        !disabled && "hover:bg-primary-foreground hover:text-primary",
        state.mode === "progress" && "bg-primary-foreground text-foreground",
      )}
    >
      {state.mode === "progress" ? (
        <ProgressContent {...state} hovered={hovered} />
      ) : (
        <ActionContent {...state} hovered={hovered} disabled={disabled} />
      )}
    </button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
};

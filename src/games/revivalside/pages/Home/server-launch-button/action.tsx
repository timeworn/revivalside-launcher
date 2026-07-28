import { cn } from "@/lib/utils";
import type { ReactNode, FC } from "react";

export interface ActionButtonState {
  mode: "action";
  icon: ReactNode;
  text: ReactNode;
  hoverIcon?: ReactNode;
  hoverText?: ReactNode;
}

export const ActionContent: FC<ActionButtonState & { hovered: boolean; disabled?: boolean }> = ({
  icon,
  text,
  hoverIcon,
  hoverText,
  hovered,
  disabled,
}) => {
  const useHover = hovered && !disabled && (hoverIcon !== undefined || hoverText !== undefined);

  return (
    <>
      <span
        className={cn(
          "*:size-5!",
          !disabled ? "*:fill-primary-foreground *:group-hover:fill-primary *:transition-colors" : "",
        )}
      >
        {useHover && hoverIcon !== undefined ? hoverIcon : icon}
      </span>
      <span className="text-lg font-extrabold">{useHover && hoverText !== undefined ? hoverText : text}</span>
    </>
  );
};

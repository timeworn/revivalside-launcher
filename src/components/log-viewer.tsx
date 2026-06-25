import { useEffect, useRef, useState, useCallback, type FC, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  id: number;
  timestamp: Date;
  level: LogLevel;
  message: string;
}

const loggingLevels = cva("", {
  variants: {
    level: {
      info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      warn: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
      debug: "bg-muted text-muted-foreground border border-border",
    },
  },
});

let _id = 0;
const makeId = () => ++_id;

export const LogViewer: FC<ComponentProps<"div">> = ({ className, ...props }) => {
  const [lines, setLines] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const pausedRef = useRef(paused);

  const append = useCallback((level: LogLevel, message: string) => {
    if (pausedRef.current) return;
    setLines((prev) => [...prev, { id: makeId(), timestamp: new Date(), level, message }]);
  }, []);

  const onScroll = () => {
    const current = bodyRef.current;
    if (!current) return;
    atBottomRef.current = current.scrollHeight - current.scrollTop - current.clientHeight < 8;
  };

  useEffect(() => {
    if (atBottomRef.current) {
      const current = bodyRef.current;
      if (current) current.scrollTop = current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const levels: LogLevel[] = ["info", "warn", "error", "debug"];
    const interval = setInterval(() => {
      const level = levels[Math.floor(Math.random() * levels.length)];
      append(level, `This is a ${level} message`);
    }, 1000);
    return () => clearInterval(interval);
  }, [append]);

  return (
    <div
      className={cn("font-mono text-[10px] rounded-lg border border-border overflow-hidden bg-muted/40", className)}
      {...props}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <span className="size-2 flex items-center justify-center relative">
          <span
            className={cn(
              "absolute h-full w-full rounded-full opacity-75",
              paused ? "bg-amber-400" : "bg-green-500 animate-ping",
            )}
          ></span>
          <span className={cn("w-full h-full rounded-full", paused ? "bg-amber-500" : "bg-green-600")} />
        </span>
        <span className="text-muted-foreground">{paused ? "Paused" : "Live"}</span>
        <div className="flex-1" />
        <Button variant="outline" size="xs" onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button variant="outline" size="xs" onClick={() => setLines([])}>
          Clear
        </Button>
      </div>
      <div ref={bodyRef} onScroll={onScroll} className="h-64 overflow-y-auto p-2.5 space-y-0.5">
        {lines.map((line) => (
          <div key={line.id} className="flex gap-2 hover:bg-foreground/10 rounded px-1 py-px">
            <span className="text-muted-foreground/60 shrink-0 tabular-nums select-none">
              {line.timestamp.toISOString().replace("T", " ").slice(0, 19)}
            </span>
            <span
              className={cn(
                "shrink-0 px-1 rounded text-[10px] font-medium self-start mt-px uppercase",
                loggingLevels({ level: line.level }),
              )}
            >
              {line.level}
            </span>
            <span className="text-foreground break-all whitespace-pre-wrap flex-1">{line.message}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 border-t">
        <span className="text-muted-foreground">{lines.length} lines</span>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
          }}
        >
          Jump to bottom
        </Button>
      </div>
    </div>
  );
};

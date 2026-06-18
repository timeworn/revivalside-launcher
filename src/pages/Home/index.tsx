import { ActionButton } from "@/pages/Home/ActionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  BookOpenIcon,
  ChevronDownIcon,
  FolderOpenIcon,
  GlobeIcon,
  GlobeOffIcon,
  MenuIcon,
  PauseIcon,
  PlayIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useState } from "react";

export const Home = () => {
  const [startState, setStartState] = useState<"started" | "starting" | "stopped" | "stopping">("stopped");
  const isLoading = startState === "starting" || startState === "stopping";
  const buttonText = () => {
    switch (startState) {
      case "started":
        return "Stop Server";
      case "stopped":
        return "Start Server";
      case "starting":
        return "Starting...";
      case "stopping":
        return "Stopping...";
    }
  };
  const buttonIcon = () => {
    switch (startState) {
      case "started":
        return <PauseIcon color="relative" />;
      case "stopped":
        return <PlayIcon color="relative" />;
      case "starting":
      case "stopping":
        return <Spinner />;
    }
  };

  const toggleServer = async () => {
    setStartState((prev) => (prev === "started" ? "stopping" : "starting"));

    setTimeout(() => {
      setStartState((prev) => (prev === "stopping" ? "stopped" : "started"));
    }, 1000);
  };

  return (
    <div className="flex flex-1 flex-col h-full p-14">
      <img src="/logo.webp" alt="Logo" className="w-sm" />
      <div className="flex flex-1">
        <div className="flex flex-1 mt-auto gap-12">
          <div className="flex flex-col gap-2 max-w-md w-full">
            <div className="flex gap-2">
              <ActionButton tooltip="User Manager">
                <UsersRoundIcon />
              </ActionButton>
              <ActionButton tooltip="Wiki">
                <BookOpenIcon />
              </ActionButton>
              <ActionButton tooltip="Patch Hosts">
                <GlobeIcon />
              </ActionButton>
              <ActionButton tooltip="Unpatch Hosts">
                <GlobeOffIcon />
              </ActionButton>
            </div>
            <Card className="bg-card/70 backdrop-blur-md">
              <CardContent>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button className="group w-full uppercase flex items-stretch transition-colors hover:bg-foreground/10 px-(--card-spacing)">
                      <span className="font-semibold uppercase tracking-widest">Logs</span>
                      <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm px-(--card-spacing)">
                    <div>This panel can be expanded or collapsed to reveal additional content.</div>
                    <Button size="xs">Learn More</Button>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 gap-2 justify-end items-end">
            <Button
              className="h-14 group border-none hover:bg-main-foreground hover:text-main gap-4 flex px-7 justify-center items-center rounded-full bg-main text-main-foreground"
              onClick={toggleServer}
              disabled={isLoading}
            >
              <span
                className={cn(
                  "*:size-5!",
                  !isLoading ? "*:fill-main-foreground *:group-hover:fill-main *:transition-colors" : "",
                )}
              >
                {buttonIcon()}
              </span>
              <span className="text-lg font-extrabold">{buttonText()}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ActionButton size="action-icon">
                  <MenuIcon />
                </ActionButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit" side="top" align="end">
                <DropdownMenuItem>
                  <FolderOpenIcon />
                  Browse Local Files
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

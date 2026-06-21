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
import { useAsyncToggle } from "@/hooks/useAsyncToggle";

export const Home = () => {
  const { state, isLoading, toggle, text } = useAsyncToggle(
    () => new Promise((res) => setTimeout(res, 1000)),
    () => new Promise((res) => setTimeout(res, 1000)),
    {
      on: "Stop Server",
      off: "Start Server",
    },
  );

  const buttonIcon = () => {
    switch (state) {
      case "on":
        return <PauseIcon color="relative" />;
      case "off":
        return <PlayIcon color="relative" />;
      case "starting":
      case "stopping":
        return <Spinner />;
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full">
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
            <Card className="bg-card/50 backdrop-blur-3xl">
              <CardContent>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button className="group w-full uppercase flex items-stretch transition-colors">
                      <span className="font-semibold uppercase tracking-widest">Logs</span>
                      <ChevronDownIcon className="ml-auto rotate-0 group-data-[state=open]:rotate-180 transition-transform" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 text-sm">
                    <div>This panel can be expanded or collapsed to reveal additional content.</div>
                    <Button size="xs">Learn More</Button>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 gap-2 justify-end items-end">
            <Button
              className="h-14 group border-none gap-4 flex px-7 justify-center items-center rounded-full"
              onClick={toggle}
              disabled={isLoading}
            >
              <span
                className={cn(
                  "*:size-5!",
                  !isLoading ? "*:fill-primary-foreground *:group-hover:fill-primary *:transition-colors" : "",
                )}
              >
                {buttonIcon()}
              </span>
              <span className="text-lg font-extrabold">{text}</span>
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

import { LogViewer } from "@/components/log-viewer";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { useLauncherState } from "@/components/providers/launcher-state-provider";
import { openPath } from "@tauri-apps/plugin-opener";
import { FolderOpenIcon } from "lucide-react";

export const Logs = () => {
  const { snapshot } = useLauncherState();

  return (
    <FieldGroup className="max-w-4xl">
      <FieldSet>
        <FieldLegend>Launcher and service logs</FieldLegend>
        <Field>
          <FieldDescription>
            Live output from the listener, wiki, asset tools, client patcher, and Cross Save capture.
          </FieldDescription>
          <LogViewer className="w-full bg-card/30 backdrop-blur-3xl" bodyClassName="h-[28rem]" />
          <Button
            variant="secondary"
            size="lg"
            disabled={!snapshot}
            onClick={() => snapshot && openPath(`${snapshot.appRoot}\\logs`)}
          >
            <FolderOpenIcon />
            Open log files
          </Button>
        </Field>
      </FieldSet>
    </FieldGroup>
  );
};

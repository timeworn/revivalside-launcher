import { useLauncherState } from "@/components/providers/launcher-state-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FieldGroup, Field, FieldSet, FieldDescription, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRevivalSideSettings } from "@/games/revivalside/config";
import { useAsyncButton } from "@/hooks/useAsyncButton";
import { open } from "@tauri-apps/plugin-dialog";
import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { LOBBY_ACK_OPTIONS, revivalSideSettingsSchema } from "@/lib/schema";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComponentProps, FC } from "react";

export const GameSettings: FC<ComponentProps<typeof Dialog>> = ({ ...props }) => {
  const { isServerRunning } = useLauncherState();
  const { settings, setSetting, resetSettings } = useRevivalSideSettings();
  const { activate, text, isSubmitting } = useAsyncButton(() => new Promise((res) => setTimeout(res, 1000)), {
    idle: "Detect",
    submitting: "Detecting...",
  });

  const browseForClient = async () => {
    const selected = await open({
      title: "Select Game Client",
      filters: [{ name: "Assembly-CSharp", extensions: ["dll"] }],
      multiple: false,
    });

    if (selected) {
      setSetting("clientPath", selected || "");
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-3xl" showCloseButton={false}>
        <Tabs className="gap-6" defaultValue="general" orientation="vertical">
          <TabsList variant="clear">
            <TabsTrigger size="xl" value="general">
              General
            </TabsTrigger>
            <TabsTrigger size="xl" value="listener">
              Listener
            </TabsTrigger>
            <TabsTrigger size="xl" value="advanced">
              Advanced
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="h-120 w-full">
            <TabsContent value="general">
              <FieldSet>
                <FieldLegend>General</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Game Client</FieldLabel>
                    <div className="flex gap-2 items-center">
                      <Input value={settings.clientPath} readOnly placeholder="No file selected..." />
                      <div className="flex gap-1">
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={browseForClient}
                          disabled={isSubmitting || isServerRunning}
                        >
                          Browse
                        </Button>
                        <Button size="lg" onClick={activate} disabled={isSubmitting || isServerRunning}>
                          <Spinner hidden={!isSubmitting} />
                          <span>{text}</span>
                        </Button>
                      </div>
                    </div>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </TabsContent>
            <TabsContent value="listener">
              <FieldSet>
                <FieldLegend>Listener</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="tcp-port">TCP</FieldLabel>
                    <Input
                      id="tcp-port"
                      type="number"
                      min={revivalSideSettingsSchema.shape.tcpPort.unwrap().minValue!}
                      max={revivalSideSettingsSchema.shape.tcpPort.unwrap().maxValue!}
                      value={settings.tcpPort}
                      onChange={(e) => setSetting("tcpPort", Number(e.target.value))}
                      disabled={isServerRunning}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="http-port">HTTP</FieldLabel>
                    <Input
                      id="http-port"
                      type="number"
                      min={revivalSideSettingsSchema.shape.httpPort.unwrap().minValue!}
                      max={revivalSideSettingsSchema.shape.httpPort.unwrap().maxValue!}
                      value={settings.httpPort}
                      onChange={(e) => setSetting("httpPort", Number(e.target.value))}
                      disabled={isServerRunning}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="wiki-port">Wiki</FieldLabel>
                    <Input
                      id="wiki-port"
                      type="number"
                      min={revivalSideSettingsSchema.shape.wikiPort.unwrap().minValue!}
                      max={revivalSideSettingsSchema.shape.wikiPort.unwrap().maxValue!}
                      value={settings.wikiPort}
                      onChange={(e) => setSetting("wikiPort", Number(e.target.value))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="event-date">Event Date</FieldLabel>
                    <DatePicker selected={settings.eventDate} onSelect={(date) => setSetting("eventDate", date)} />
                  </Field>
                  <Field>
                    <FieldLabel>Lobby ACK</FieldLabel>
                    <Select
                      value={settings.lobbyAck}
                      onValueChange={(value) => setSetting("lobbyAck", value as typeof settings.lobbyAck)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {LOBBY_ACK_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Switch
                      id="lan-access"
                      checked={settings.allowLanAccess}
                      onCheckedChange={(checked) => setSetting("allowLanAccess", checked)}
                    />
                    <FieldLabel htmlFor="lan-access">Allow LAN User Manager access</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Switch
                      id="verbose-logs"
                      checked={settings.verboseLogging}
                      onCheckedChange={(checked) => setSetting("verboseLogging", checked)}
                    />
                    <FieldLabel htmlFor="verbose-logs">Verbose listener logs</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Switch
                      id="replay-capture"
                      checked={settings.replayCapturedGameFlow}
                      onCheckedChange={(checked) => setSetting("replayCapturedGameFlow", checked)}
                    />
                    <FieldLabel htmlFor="replay-capture">Replay captured game flow</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Switch
                      id="skip-tutorial"
                      checked={settings.skipTutorial}
                      onCheckedChange={(checked) => setSetting("skipTutorial", checked)}
                    />
                    <FieldLabel htmlFor="skip-tutorial">Skip tutorial to win</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Switch
                      id="reset-tutorial"
                      checked={settings.resetTutorialOnLogin}
                      onCheckedChange={(checked) => setSetting("resetTutorialOnLogin", checked)}
                    />
                    <FieldLabel htmlFor="reset-tutorial">Reset tutorial on login</FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </TabsContent>
            <TabsContent value="advanced">
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Other</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="server-time">Server Time</FieldLabel>
                      <DatePicker
                        id="server-time"
                        type="datetime-local"
                        selected={settings.serverTime}
                        onSelect={(date) => setSetting("serverTime", date)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Cache</FieldLabel>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="lg">
                          Verify Assets
                        </Button>
                        <Button size="lg">Build Cache</Button>
                      </div>
                    </Field>
                    <Field>
                      <FieldLabel>Reset</FieldLabel>
                      <div className="flex gap-2">
                        <Button size="lg" onClick={resetSettings}>
                          Reset Settings
                        </Button>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSet>
                  <Field className="uppercase">
                    <FieldDescription>Assets x/x</FieldDescription>
                  </Field>
                </FieldSet>
              </FieldGroup>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

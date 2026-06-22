import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useAsyncButton } from "@/hooks/useAsyncButton";
import { useSettings } from "@/components/SettingsProvider";
import { CLOSE_WINDOW_OPTIONS, LOBBY_ACK_OPTIONS } from "@/lib/schema";
import { open } from "@tauri-apps/plugin-dialog";

export const Settings = () => {
  const { settings, setSetting } = useSettings();
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
    <FieldGroup>
      <FieldSet>
        <FieldLegend>General</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Game Client</FieldLabel>
            <div className="flex gap-2 items-center">
              <Input value={settings.clientPath} readOnly placeholder="No file selected..." />
              <div className="flex gap-1">
                <Button variant="secondary" size="lg" onClick={browseForClient} disabled={isSubmitting}>
                  Browse
                </Button>
                <Button size="lg" onClick={activate} disabled={isSubmitting}>
                  <Spinner hidden={!isSubmitting} />
                  <span>{text}</span>
                </Button>
              </div>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Close Window</FieldLegend>
        <RadioGroup
          value={settings.closeWindow}
          onValueChange={(value) => setSetting("closeWindow", value as typeof settings.closeWindow)}
        >
          {CLOSE_WINDOW_OPTIONS.map((option) => (
            <Field key={option} orientation="horizontal">
              <RadioGroupItem id={`close-windows-${option}`} value={option} />
              <FieldLabel htmlFor={`close-windows-${option}`} className="capitalize">
                {option.replace(/_/g, " ")}
              </FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Listener</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="tcp-port">TCP</FieldLabel>
            <Input
              id="tcp-port"
              type="number"
              min={1}
              max={65535}
              value={settings.tcpPort}
              onChange={(e) => setSetting("tcpPort", Number(e.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="http-port">HTTP</FieldLabel>
            <Input
              id="http-port"
              type="number"
              min={1}
              max={65535}
              value={settings.httpPort}
              onChange={(e) => setSetting("httpPort", Number(e.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="wiki-port">Wiki</FieldLabel>
            <Input
              id="wiki-port"
              type="number"
              min={1}
              max={65535}
              value={settings.wikiPort}
              onChange={(e) => setSetting("wikiPort", Number(e.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="event-date">Event Date</FieldLabel>
            <Input
              id="event-date"
              type="date"
              value={settings.eventDate}
              onChange={(e) => setSetting("eventDate", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lobby-ack">Lobby ACK</FieldLabel>
            <NativeSelect
              id="lobby-ack"
              value={settings.lobbyAck}
              onChange={(e) => setSetting("lobbyAck", e.target.value as typeof settings.lobbyAck)}
            >
              {LOBBY_ACK_OPTIONS.map((option) => (
                <NativeSelectOption key={option} className="capitalize" value={option}>
                  {option}
                </NativeSelectOption>
              ))}
            </NativeSelect>
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
      <FieldSet>
        <FieldLegend>Other</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="server-time">Server Time</FieldLabel>
            <Input
              id="server-time"
              type="datetime-local"
              value={settings.serverTime}
              onChange={(e) => setSetting("serverTime", e.target.value)}
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
        </FieldGroup>
        <Field className="uppercase">
          <FieldDescription>Assets x/x</FieldDescription>
        </Field>
      </FieldSet>
    </FieldGroup>
  );
};

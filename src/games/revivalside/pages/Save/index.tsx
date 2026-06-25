import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useRevivalSideSettings } from "@/games/revivalside/config";
import { useAsyncButton } from "@/hooks/useAsyncButton";
import { useAsyncToggle } from "@/hooks/useAsyncToggle";

export const Save = () => {
  const { settings, setSetting } = useRevivalSideSettings();

  const {
    isLoading: listenerLoading,
    toggle: toggleListener,
    text: listenerText,
  } = useAsyncToggle(
    () => new Promise((res) => setTimeout(res, 1000)),
    () => new Promise((res) => setTimeout(res, 1000)),
    {
      on: "Stop Listening",
      off: "Start Listening",
    },
  );

  const {
    activate: extractAndCopy,
    text: extractAndCopyText,
    isSubmitting,
  } = useAsyncButton(() => new Promise((res) => setTimeout(res, 1000)), {
    idle: "Extract and Copy",
    submitting: "Extracting and Copying...",
  });

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Capture Folder</FieldLegend>
        <FieldGroup>
          <Field>
            <Input id="capture-folder" value={settings.capturePath} placeholder="No capture folder..." readOnly />
            <div className="flex gap-2">
              <Button variant="secondary" size="lg" onClick={toggleListener} disabled={listenerLoading}>
                <Spinner hidden={!listenerLoading} />
                <span>{listenerText}</span>
              </Button>
              <Button size="lg" onClick={extractAndCopy} disabled={isSubmitting}>
                <Spinner hidden={!isSubmitting} />
                <span>{extractAndCopyText}</span>
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Options</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <Switch
              id="switch-imported-save"
              checked={settings.switchToImportedSave}
              onCheckedChange={(checked) => setSetting("switchToImportedSave", checked)}
              disabled={isSubmitting}
            />
            <FieldLabel htmlFor="switch-imported-save">Switch to imported save</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="update-matching-import"
              checked={settings.updateMatchingImport}
              onCheckedChange={(checked) => setSetting("updateMatchingImport", checked)}
              disabled={isSubmitting}
            />
            <FieldLabel htmlFor="update-matching-import">Update matching import</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="keep-uid"
              checked={settings.keepOfficialUid}
              onCheckedChange={(checked) => setSetting("keepOfficialUid", checked)}
              disabled={isSubmitting}
            />
            <FieldLabel htmlFor="keep-uid">Keep official UID</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="keep-fc"
              checked={settings.keepOfficialFriendCode}
              onCheckedChange={(checked) => setSetting("keepOfficialFriendCode", checked)}
              disabled={isSubmitting}
            />
            <FieldLabel htmlFor="keep-fc">Keep official friend code</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Result</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="result-text">Idle</FieldLabel>
            <FieldDescription>C:\path\to\imported\save</FieldDescription>
            <Textarea id="result-text" className="min-h-36" value="" readOnly />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
};

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAsyncButton } from "@/hooks/useAsyncButton";
import { useAsyncToggle } from "@/hooks/useAsyncToggle";

export const Settings = () => {
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
            <Input id="capture-folder" value="/path/to/capture/folder" readOnly />
            <div className="flex gap-2">
              <Button variant="clear" size="lg" onClick={toggleListener} disabled={listenerLoading}>
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
            <Switch disabled={isSubmitting} />
            <FieldLabel>Switch to imported save</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch disabled={isSubmitting} />
            <FieldLabel>Update matching import</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch disabled={isSubmitting} />
            <FieldLabel>Keep official UID</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch disabled={isSubmitting} />
            <FieldLabel>Keep official friend code</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Result</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Idle</FieldLabel>
            <FieldDescription>C:\path\to\imported\save</FieldDescription>
            <Textarea className="min-h-36" value="" readOnly />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  );
};

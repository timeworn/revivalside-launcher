import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useAsyncButton } from "@/hooks/useAsyncButton";

export const Settings = () => {
  const { activate, text, isSubmitting } = useAsyncButton(() => new Promise((res) => setTimeout(res, 1000)), {
    idle: "Detect",
    submitting: "Detecting...",
  });

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Official Client</FieldLegend>
        <FieldGroup>
          <Field>
            <div className="flex flex-row-reverse gap-2 items-center">
              <div className="flex gap-1">
                <input type="file" id="client-assembly" accept="Assembly-CSharp.dll" disabled={isSubmitting} hidden />
                <Button className="hover:cursor-pointer" disabled={isSubmitting} variant="secondary" size="lg" asChild>
                  <label htmlFor="client-assembly">Browse</label>
                </Button>
                <Button variant="secondary" size="lg" onClick={activate} disabled={isSubmitting}>
                  <Spinner hidden={!isSubmitting} />
                  <span>{text}</span>
                </Button>
              </div>
              <Input id="capture-folder" value="/path/to/capture/folder" readOnly />
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Listener</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>TCP</FieldLabel>
            <Input type="number" min={1} max={65535} />
          </Field>
          <Field>
            <FieldLabel>HTTP</FieldLabel>
            <Input type="number" min={1} max={65535} />
          </Field>
          <Field>
            <FieldLabel>Wiki</FieldLabel>
            <Input type="number" min={1} max={65535} />
          </Field>
          <Field>
            <FieldLabel>Event Date</FieldLabel>
            <Input type="date" />
          </Field>
          <Field>
            <FieldLabel>Event Date</FieldLabel>
            <NativeSelect>
              <NativeSelectOption value="auto">Auto</NativeSelectOption>
              <NativeSelectOption value="on">On</NativeSelectOption>
              <NativeSelectOption value="off">Off</NativeSelectOption>
            </NativeSelect>
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field orientation="horizontal">
            <Switch />
            <FieldLabel>Allow LAN User Manager access</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch />
            <FieldLabel>Verbose listener logs</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch />
            <FieldLabel>Replay captured game flow</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch />
            <FieldLabel>Skip tutorial to win</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Switch />
            <FieldLabel>Reset tutorial on login</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Other</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Server Time</FieldLabel>
            <Input type="datetime-local" />
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

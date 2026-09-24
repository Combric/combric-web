import { Label, Radio, RadioGroup } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <RadioGroup
      name="playground-plan"
      defaultValue={String(props.value)}
      aria-label="Plan"
      disabled={Boolean(props.disabled)}
    >
      <Label>
        <Radio value="starter" /> Starter
      </Label>
      <Label>
        <Radio value="pro" /> Pro
      </Label>
    </RadioGroup>
  );
}

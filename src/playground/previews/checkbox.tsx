import { Checkbox, Label } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Label>
      <Checkbox
        defaultChecked={Boolean(props.checked)}
        disabled={Boolean(props.disabled)}
      />{" "}
      {String(props.label)}
    </Label>
  );
}

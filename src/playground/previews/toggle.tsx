import { Toggle } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Toggle defaultPressed={Boolean(props.pressed)}>
      {String(props.label)}
    </Toggle>
  );
}

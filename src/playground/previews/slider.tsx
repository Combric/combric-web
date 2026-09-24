import { Slider } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Slider
      aria-label="Volume"
      defaultValue={String(props.value)}
      min="0"
      max="100"
      disabled={Boolean(props.disabled)}
    />
  );
}

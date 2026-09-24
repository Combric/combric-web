import { Select } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Select
      aria-label="Region"
      defaultValue={String(props.value)}
      disabled={Boolean(props.disabled)}
    >
      <option value="eu">Europe</option>
      <option value="us">United States</option>
    </Select>
  );
}

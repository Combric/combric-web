import { Popover, PopoverContent, PopoverTrigger } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Popover defaultOpen={Boolean(props.open)}>
      <PopoverTrigger>Details</PopoverTrigger>
      <PopoverContent side={props.side as "top" | "right" | "bottom" | "left"}>
        {String(props.content)}
      </PopoverContent>
    </Popover>
  );
}

import { Tooltip, TooltipContent, TooltipTrigger } from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>Help</TooltipTrigger>
      <TooltipContent side={props.side as "top" | "right" | "bottom" | "left"}>
        {String(props.content)}
      </TooltipContent>
    </Tooltip>
  );
}

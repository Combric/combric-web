import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{String(props.trigger)}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={Boolean(props.disabledArchive)}>
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

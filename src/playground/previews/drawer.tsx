import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Drawer defaultOpen={Boolean(props.open)}>
      <DrawerTrigger>Filters</DrawerTrigger>
      <DrawerContent side={props.side as "left" | "right"}>
        <DrawerTitle>Filters</DrawerTitle>
        <DrawerDescription>{String(props.description)}</DrawerDescription>
        <DrawerClose>Done</DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}

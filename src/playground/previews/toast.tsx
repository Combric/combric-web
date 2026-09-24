import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <ToastViewport aria-label="Notifications">
      <Toast defaultOpen={Boolean(props.open)} duration={0}>
        <ToastTitle>{String(props.title)}</ToastTitle>
        <ToastDescription>{String(props.description)}</ToastDescription>
        <ToastClose>Dismiss</ToastClose>
      </Toast>
    </ToastViewport>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@combric/react";
import type { PlaygroundProps } from "../registry";

export default function Preview({
  props,
}: {
  readonly props: PlaygroundProps;
}) {
  return (
    <Accordion {...(Boolean(props.open) ? { defaultValue: "details" } : {})}>
      <AccordionItem value="details">
        <AccordionTrigger>Details</AccordionTrigger>
        <AccordionContent>{String(props.content)}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

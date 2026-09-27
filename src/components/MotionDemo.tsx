import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@combric/react";

type MotionMode = "default" | "reduced" | "none" | "custom";

const modes: readonly { id: MotionMode; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "reduced", label: "Reduced-motion preview" },
  { id: "none", label: "No motion" },
  { id: "custom", label: "Custom CSS" },
];

export default function MotionDemo() {
  const [mode, setMode] = useState<MotionMode>("default");

  useEffect(() => {
    document
      .querySelectorAll("main .expressive-code pre")
      .forEach((codeBlock, index) => {
        codeBlock.setAttribute(
          "aria-label",
          `Motion code example ${index + 1}`,
        );
      });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const previousMotion = root.getAttribute("data-combric-motion");
    const previousPreview = root.getAttribute("data-combric-motion-preview");

    if (mode === "none") root.setAttribute("data-combric-motion", "off");
    else root.removeAttribute("data-combric-motion");

    if (mode === "reduced" || mode === "custom")
      root.setAttribute("data-combric-motion-preview", mode);
    else root.removeAttribute("data-combric-motion-preview");

    return () => {
      if (previousMotion === null) root.removeAttribute("data-combric-motion");
      else root.setAttribute("data-combric-motion", previousMotion);
      if (previousPreview === null)
        root.removeAttribute("data-combric-motion-preview");
      else root.setAttribute("data-combric-motion-preview", previousPreview);
    };
  }, [mode]);

  return (
    <section
      className="combric-motion-demo"
      aria-label="Interactive Motion demo"
    >
      <div
        className="combric-motion-demo__modes"
        role="group"
        aria-label="Motion mode"
      >
        {modes.map(({ id, label }) => (
          <button
            aria-pressed={mode === id}
            key={id}
            onClick={() => setMode(id)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="combric-motion-demo__description">
        {mode === "reduced"
          ? "Preview only: reduced motion removes the optional transitions. The real system follows your operating-system preference."
          : mode === "none"
            ? "The demo set the documented root opt-out; component behavior and keyboard access remain available."
            : mode === "custom"
              ? "Consumer CSS replaces the Dropdown and right Drawer presentation; Combric still owns presence and interaction."
              : "Default token-driven motion; no animation library or JavaScript setup is required."}
      </p>
      <div className="combric-motion-demo__controls">
        <DropdownMenu>
          <DropdownMenuTrigger>Motion actions</DropdownMenuTrigger>
          <DropdownMenuContent className="combric-motion-demo__menu">
            <DropdownMenuItem>Rename item</DropdownMenuItem>
            <DropdownMenuItem>Duplicate item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Drawer>
          <DrawerTrigger>Open right Drawer</DrawerTrigger>
          <DrawerContent className="combric-motion-demo__drawer" side="right">
            <DrawerTitle>Motion settings</DrawerTitle>
            <DrawerDescription>
              This Drawer keeps its focus and dismissal lifecycle in every mode.
            </DrawerDescription>
            <DrawerClose>Close Drawer</DrawerClose>
          </DrawerContent>
        </Drawer>
      </div>
    </section>
  );
}

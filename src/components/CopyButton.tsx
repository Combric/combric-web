import { useState } from "react";
import { copyToClipboard } from "../lib/copyToClipboard";

export interface CopyButtonProps {
  readonly text: string;
  readonly label?: string;
}

export function CopyButton({ text, label = "Copy code" }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await copyToClipboard(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        className="combric-button"
        data-size="sm"
        onClick={copy}
        aria-label={label}
      >
        {label}
      </button>{" "}
      <span role="status" aria-live="polite">
        {status === "copied"
          ? "Copied."
          : status === "error"
            ? "Copy failed. Select the code manually."
            : ""}
      </span>
    </div>
  );
}

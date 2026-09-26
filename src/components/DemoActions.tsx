import { useState } from "react";
import { copyToClipboard } from "../lib/copyToClipboard";

export interface DemoActionsProps {
  readonly demoId: string;
  readonly source: string;
}

export function DemoActions({ demoId, source }: DemoActionsProps) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const sourceId = `demo-code-${demoId.replaceAll(/[^a-zA-Z0-9_-]/g, "-")}`;

  async function copy() {
    try {
      await copyToClipboard(source);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="combric-demo-actions">
      <div className="combric-demo-actions__buttons">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={sourceId}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Hide code" : "View code"}
        </button>
        <button
          type="button"
          className="combric-demo-actions__copy"
          onClick={copy}
        >
          Copy code
        </button>
      </div>
      <span
        className="combric-demo-actions__status"
        role="status"
        aria-live="polite"
      >
        {status === "copied"
          ? "Code copied."
          : status === "error"
            ? "Copy failed. Select the code manually."
            : ""}
      </span>
      <pre
        id={sourceId}
        className="combric-demo-actions__source"
        tabIndex={0}
        hidden={!expanded}
      >
        <code>{source}</code>
      </pre>
    </div>
  );
}

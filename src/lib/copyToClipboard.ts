export async function copyToClipboard(text: string): Promise<void> {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back to the selection-based copy path when permission is denied.
    }
  }

  const activeElement = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.setAttribute("aria-hidden", "true");
  area.style.position = "fixed";
  area.style.insetInlineStart = "-9999px";
  area.style.top = "0";
  area.style.opacity = "0";
  document.body.append(area);

  let copied = false;
  try {
    area.focus();
    area.select();
    copied = document.execCommand("copy");
  } finally {
    area.remove();
    if (activeElement instanceof HTMLElement && activeElement.isConnected)
      activeElement.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
    }
  }

  if (!copied) throw new Error("Copy command was unavailable");
}

import { iconCatalog, type IconStyle } from "@combric/icons/metadata";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { copyToClipboard } from "../lib/copyToClipboard";
import "../styles/icons-catalogue.css";

const iconTileMinimumWidth = 128;
const iconTileGap = 12;
const iconTileHeight = 100;
const iconRowHeight = iconTileHeight + iconTileGap;
const virtualGridOverscanRows = 3;
const initialGridViewport = { inlineSize: 720, blockSize: 560 };
const drawerCloseFallbackDuration = 240;

type CatalogueStyle = Extract<IconStyle, "regular" | "solid">;
type CatalogueIcon = (typeof iconCatalog)[number];

export interface IconsCatalogueProps {
  readonly regularHref: string;
  readonly solidHref: string;
  readonly style: CatalogueStyle;
}

function importSnippet(componentName: string, style: CatalogueStyle) {
  const entryPoint =
    style === "regular" ? "@combric/icons" : "@combric/icons/solid";
  return `import { ${componentName} } from "${entryPoint}";`;
}

function reactSnippet(icon: CatalogueIcon, style: CatalogueStyle) {
  return `${importSnippet(icon.componentName, style)}\n\n<${icon.componentName} aria-label="${icon.componentName.replace(/Icon$/, "")}" />`;
}

function cssSnippet(icon: CatalogueIcon, style: CatalogueStyle) {
  const entryPoint =
    style === "regular"
      ? "@combric/icons/css/regular"
      : "@combric/icons/css/solid";
  return `@import "${entryPoint}";\n\n<span className="combric-icon combric-icon-${icon.name}" aria-hidden="true" />`;
}

export function IconsCatalogue({
  regularHref,
  solidHref,
  style,
}: IconsCatalogueProps) {
  const [query, setQuery] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<CatalogueIcon | null>(null);
  const [isDrawerClosing, setIsDrawerClosing] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [gridViewport, setGridViewport] = useState(initialGridViewport);
  const gridRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();
  const styleLabel = style === "regular" ? "Regular" : "Solid";
  const fieldId = `combric-icons-${style}-search`;
  const drawerHeadingId = `combric-icons-${style}-detail-heading`;

  const matches = useMemo(
    () =>
      iconCatalog.filter((icon) => {
        if (!icon.styles.includes(style)) return false;
        if (!normalizedQuery) return true;
        return `${icon.name} ${icon.componentName}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      }),
    [normalizedQuery, style],
  );
  const columnCount = Math.max(
    1,
    Math.floor(
      (gridViewport.inlineSize + iconTileGap) /
        (iconTileMinimumWidth + iconTileGap),
    ),
  );
  const totalRows = Math.ceil(matches.length / columnCount);
  const totalGridHeight =
    totalRows === 0 ? 0 : totalRows * iconRowHeight + iconTileGap;
  const maximumScrollTop = Math.max(
    0,
    totalGridHeight - gridViewport.blockSize,
  );
  const boundedScrollTop = Math.min(scrollTop, maximumScrollTop);
  const firstVisibleRow = Math.max(
    0,
    Math.floor(boundedScrollTop / iconRowHeight) - virtualGridOverscanRows,
  );
  const lastVisibleRow = Math.min(
    totalRows,
    Math.ceil((boundedScrollTop + gridViewport.blockSize) / iconRowHeight) +
      virtualGridOverscanRows,
  );
  const firstVisibleIcon = firstVisibleRow * columnCount;
  const visibleIcons = matches.slice(
    firstVisibleIcon,
    lastVisibleRow * columnCount,
  );
  const resultSummary =
    matches.length === 0
      ? `No ${styleLabel.toLocaleLowerCase()} icons match “${query.trim()}”.`
      : matches.length === 1
        ? `1 ${styleLabel.toLocaleLowerCase()} icon available. Select it to view its implementation.`
        : `${matches.length} ${styleLabel.toLocaleLowerCase()} icons available. Scroll to browse all and select one to view its implementation.`;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const gridElement = grid;

    function updateGridViewport() {
      const nextViewport = {
        inlineSize: gridElement.clientWidth,
        blockSize: gridElement.clientHeight,
      };
      setGridViewport((currentViewport) =>
        currentViewport.inlineSize === nextViewport.inlineSize &&
        currentViewport.blockSize === nextViewport.blockSize
          ? currentViewport
          : nextViewport,
      );
    }

    updateGridViewport();
    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(updateGridViewport);
    resizeObserver.observe(gridElement);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setScrollTop(0);
    gridRef.current?.scrollTo({ top: 0 });
  }, [normalizedQuery, style]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    if (selectedIcon) {
      if (!drawer.open) drawer.showModal();
    }
  }, [selectedIcon]);

  useEffect(() => {
    if (!isDrawerClosing) return;

    const drawer = drawerRef.current;
    if (!drawer?.open) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawer.close();
      return;
    }

    const fallback = window.setTimeout(() => {
      if (drawer.open) drawer.close();
    }, drawerCloseFallbackDuration);
    return () => window.clearTimeout(fallback);
  }, [isDrawerClosing]);

  async function copySnippet(snippet: string, description: string) {
    try {
      await copyToClipboard(snippet);
      setCopyStatus(`Copied ${description}.`);
    } catch {
      setCopyStatus("Copy failed. Select the code manually.");
    }
  }

  function openDetails(icon: CatalogueIcon) {
    previouslyFocusedElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setCopyStatus("");
    setIsDrawerClosing(false);
    setSelectedIcon(icon);
  }

  function closeDetails() {
    if (!drawerRef.current?.open || isDrawerClosing) return;
    setIsDrawerClosing(true);
  }

  function restoreFocusAfterClose() {
    setIsDrawerClosing(false);
    setSelectedIcon(null);
    const previousElement = previouslyFocusedElement.current;
    previouslyFocusedElement.current = null;
    if (previousElement?.isConnected)
      previousElement.focus({ preventScroll: true });
  }

  return (
    <section
      className="combric-icons-catalogue"
      aria-labelledby={`${style}-catalogue-heading`}
      data-pagefind-ignore
    >
      <div className="combric-icons-catalogue__header">
        <div>
          <p className="combric-icons-catalogue__eyebrow">
            Source-backed catalogue
          </p>
          <h2 id={`${style}-catalogue-heading`}>{styleLabel} icons</h2>
          <p>
            Search the typed metadata shipped by <code>@combric/icons</code>.
            The catalogue never imports a namespace of React SVG components.
          </p>
        </div>
        <nav className="combric-icons-catalogue__tabs" aria-label="Icon styles">
          <a
            href={regularHref}
            aria-current={style === "regular" ? "page" : undefined}
          >
            Regular
          </a>
          <a
            href={solidHref}
            aria-current={style === "solid" ? "page" : undefined}
          >
            Solid
          </a>
        </nav>
      </div>

      <div className="combric-icons-catalogue__controls">
        <label htmlFor={fieldId}>
          Search {styleLabel.toLocaleLowerCase()} icons
        </label>
        <input
          id={fieldId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name or component, for example activity"
          autoComplete="off"
          aria-describedby={`${fieldId}-results`}
        />
      </div>

      <p
        id={`${fieldId}-results`}
        className="combric-icons-catalogue__status"
        role="status"
      >
        {resultSummary}
      </p>

      <div
        ref={gridRef}
        className="combric-icons-catalogue__scrollport"
        role="region"
        aria-label={`${styleLabel} icon results`}
        tabIndex={0}
        data-icon-grid
        data-total-icons={matches.length}
        data-virtualized="true"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div
          className="combric-icons-catalogue__canvas"
          style={{ height: `${totalGridHeight}px` }}
        >
          {visibleIcons.length > 0 && (
            <ul
              className="combric-icons-catalogue__grid"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                transform: `translateY(${firstVisibleRow * iconRowHeight}px)`,
              }}
            >
              {visibleIcons.map((icon, visibleIndex) => (
                <li
                  key={icon.name}
                  className="combric-icons-catalogue__card"
                  aria-posinset={firstVisibleIcon + visibleIndex + 1}
                  aria-setsize={matches.length}
                  data-icon-card
                >
                  <button
                    type="button"
                    className="combric-icons-catalogue__tile"
                    onClick={() => openDetails(icon)}
                    aria-label={`Open ${icon.componentName} implementation details`}
                  >
                    <span
                      className="combric-icons-catalogue__preview"
                      aria-hidden="true"
                    >
                      <span
                        className={`combric-icon combric-icon-${icon.name}`}
                      />
                    </span>
                    <span className="combric-icons-catalogue__details">
                      <code>{icon.componentName}</code>
                      <span>{icon.name}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <dialog
        ref={drawerRef}
        className="combric-icons-catalogue__drawer"
        aria-labelledby={drawerHeadingId}
        data-closing={isDrawerClosing ? "true" : undefined}
        onCancel={(event) => {
          event.preventDefault();
          closeDetails();
        }}
        onClose={restoreFocusAfterClose}
        onAnimationEnd={(event) => {
          if (!isDrawerClosing || event.target !== event.currentTarget) return;
          drawerRef.current?.close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDetails();
        }}
      >
        {selectedIcon && (
          <div className="combric-icons-catalogue__drawer-content">
            <header className="combric-icons-catalogue__drawer-header">
              <span
                className="combric-icons-catalogue__drawer-preview"
                aria-hidden="true"
              >
                <span
                  className={`combric-icon combric-icon-${selectedIcon.name}`}
                />
              </span>
              <div>
                <p>{styleLabel} icon</p>
                <h2 id={drawerHeadingId}>{selectedIcon.componentName}</h2>
                <code>{selectedIcon.name}</code>
              </div>
              <button
                type="button"
                className="combric-icons-catalogue__drawer-close"
                onClick={closeDetails}
                aria-label={`Close ${selectedIcon.componentName} details`}
              >
                Close
              </button>
            </header>

            <section className="combric-icons-catalogue__implementation">
              <div>
                <h3>React component</h3>
                <pre>
                  <code>{reactSnippet(selectedIcon, style)}</code>
                </pre>
                <button
                  type="button"
                  className="combric-icons-catalogue__copy"
                  onClick={() =>
                    copySnippet(
                      reactSnippet(selectedIcon, style),
                      `${selectedIcon.componentName} React implementation`,
                    )
                  }
                  aria-label={`Copy ${selectedIcon.componentName} React implementation`}
                >
                  Copy React code
                </button>
              </div>

              <div>
                <h3>CSS icon class</h3>
                <pre>
                  <code>{cssSnippet(selectedIcon, style)}</code>
                </pre>
                <button
                  type="button"
                  className="combric-icons-catalogue__copy"
                  onClick={() =>
                    copySnippet(
                      cssSnippet(selectedIcon, style),
                      `${selectedIcon.componentName} CSS implementation`,
                    )
                  }
                  aria-label={`Copy ${selectedIcon.componentName} CSS implementation`}
                >
                  Copy CSS code
                </button>
              </div>
            </section>

            <p className="combric-icons-catalogue__drawer-status" role="status">
              {copyStatus}
            </p>
          </div>
        )}
      </dialog>
    </section>
  );
}

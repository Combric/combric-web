import { useState } from "react";
import {
  ActionMenu,
  ActionMenuCheckboxItem,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuRadioGroup,
  ActionMenuRadioItem,
  ActionMenuSeparator,
  ActionMenuTrigger,
  BottomNavigation,
  BottomNavigationLink,
  BottomNavigationList,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  MegaMenu,
  MegaMenuContent,
  MegaMenuItem,
  MegaMenuLink,
  MegaMenuList,
  MegaMenuTrigger,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  Navigation,
  NavigationItem,
  NavigationLink,
  NavigationList,
  SideNav,
  SideNavContent,
  SideNavFooter,
  SideNavGroup,
  SideNavGroupContent,
  SideNavGroupTrigger,
  SideNavHeader,
  SideNavItem,
  SideNavLink,
  SideNavList,
  SideNavNavigation,
} from "@combric/menu";

const megaCards = [
  {
    alt: "Colleagues collaborating in a modern office",
    href: "#collaboration",
    image:
      "https://images.unsplash.com/photo-1758691737212-3eebbc8f84ed?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    source:
      "https://unsplash.com/photos/colleagues-collaborating-in-a-modern-office-environment-pVyb2zYnl1c",
    title: "Collaboration systems",
    description: "Shared patterns for teams that need clear ownership.",
  },
  {
    alt: "Modern desk setup with a computer and plant",
    href: "#workspaces",
    image:
      "https://images.unsplash.com/photo-1760278041762-7af48822d63a?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    source:
      "https://unsplash.com/photos/modern-desk-setup-with-computer-and-plant-SCTJju9DFNQ",
    title: "Product workspaces",
    description: "Responsive controls for focused, everyday workflows.",
  },
  {
    alt: "Modern architectural interior with curved white walls",
    href: "#foundations",
    image:
      "https://images.unsplash.com/photo-1766230976347-c5badd3f76c9?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    source:
      "https://unsplash.com/photos/modern-architectural-interior-with-curved-white-walls-wDgzO5XLZT8",
    title: "Design foundations",
    description: "Tokens and composition rules that keep products coherent.",
  },
] as const;

export function MenuShowcase() {
  const [actionOpen, setActionOpen] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(true);
  const [sortOrder, setSortOrder] = useState("recent");
  const [megaValue, setMegaValue] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const [menubarValue, setMenubarValue] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Choose an example to inspect its state.",
  );

  return (
    <section className="menu-showcase" aria-label="Interactive Menu examples">
      <header className="menu-showcase__intro">
        <p className="menu-showcase__eyebrow">Published package reference</p>
        <h2>Composable menu systems</h2>
        <p>
          Each example below imports real components from{" "}
          <code>@combric/menu</code>
          and keeps website navigation distinct from application-menu patterns.
        </p>
      </header>

      <section
        className="menu-showcase__section"
        aria-labelledby="action-menu-heading"
      >
        <div className="menu-showcase__section-heading">
          <p className="menu-showcase__number">01</p>
          <div>
            <h3 id="action-menu-heading">Action Menu</h3>
            <p>
              Actions, checked settings, radio choices, typeahead, and
              dismissal.
            </p>
          </div>
        </div>
        <ActionMenu open={actionOpen} onOpenChange={setActionOpen}>
          <ActionMenuTrigger leading={<span aria-hidden="true">✦</span>}>
            Project actions
          </ActionMenuTrigger>
          <ActionMenuContent
            align="start"
            className="menu-showcase__floating-menu"
            collisionPadding={12}
            offset={8}
            side="bottom"
          >
            <ActionMenuLabel>Current project</ActionMenuLabel>
            <ActionMenuItem
              onSelect={() =>
                setMessage("Project link copied to the clipboard.")
              }
            >
              Copy link
            </ActionMenuItem>
            <ActionMenuItem
              closeOnSelect={false}
              onSelect={() =>
                setMessage("The project remains open for review.")
              }
              trailing={<span aria-hidden="true">↗</span>}
            >
              Open in a new tab
            </ActionMenuItem>
            <ActionMenuSeparator />
            <ActionMenuCheckboxItem
              checked={includeArchived}
              onCheckedChange={setIncludeArchived}
            >
              Include archived work
            </ActionMenuCheckboxItem>
            <ActionMenuSeparator />
            <ActionMenuLabel>Sort by</ActionMenuLabel>
            <ActionMenuRadioGroup
              onValueChange={setSortOrder}
              value={sortOrder}
            >
              <ActionMenuRadioItem value="recent">
                Most recent
              </ActionMenuRadioItem>
              <ActionMenuRadioItem value="name">Name</ActionMenuRadioItem>
            </ActionMenuRadioGroup>
          </ActionMenuContent>
        </ActionMenu>
      </section>

      <section
        className="menu-showcase__section"
        aria-labelledby="navigation-heading"
      >
        <div className="menu-showcase__section-heading">
          <p className="menu-showcase__number">02</p>
          <div>
            <h3 id="navigation-heading">Navigation and Side Navigation</h3>
            <p>
              Native landmark, list, and link semantics for website and product
              routes.
            </p>
          </div>
        </div>
        <div className="menu-showcase__navigation-grid">
          <Navigation aria-label="Project navigation">
            <NavigationList orientation="horizontal">
              <NavigationItem>
                <NavigationLink
                  active
                  href="#overview"
                  leading={<span aria-hidden="true">◈</span>}
                >
                  Overview
                </NavigationLink>
              </NavigationItem>
              <NavigationItem>
                <NavigationLink href="#activity">Activity</NavigationLink>
              </NavigationItem>
              <NavigationItem>
                <NavigationLink
                  href="#members"
                  trailing={<span aria-hidden="true">→</span>}
                >
                  Members
                </NavigationLink>
              </NavigationItem>
            </NavigationList>
          </Navigation>

          <SideNav aria-label="Workspace navigation">
            <SideNavHeader>
              <strong>Atlas workspace</strong>
              <span>Product design</span>
            </SideNavHeader>
            <SideNavContent>
              <SideNavNavigation aria-label="Workspace sections">
                <SideNavList>
                  <SideNavItem>
                    <SideNavLink active href="#home">
                      Home
                    </SideNavLink>
                  </SideNavItem>
                  <SideNavGroup defaultOpen>
                    <SideNavGroupTrigger
                      leading={<span aria-hidden="true">⌘</span>}
                      trailing={<span aria-hidden="true">⌄</span>}
                    >
                      Library
                    </SideNavGroupTrigger>
                    <SideNavGroupContent>
                      <SideNavItem>
                        <SideNavLink href="#components">Components</SideNavLink>
                      </SideNavItem>
                      <SideNavItem>
                        <SideNavLink href="#templates">Templates</SideNavLink>
                      </SideNavItem>
                    </SideNavGroupContent>
                  </SideNavGroup>
                </SideNavList>
              </SideNavNavigation>
            </SideNavContent>
            <SideNavFooter>
              <SideNavLink href="#settings">Workspace settings</SideNavLink>
            </SideNavFooter>
          </SideNav>
        </div>
      </section>

      <section
        className="menu-showcase__section"
        aria-labelledby="mega-menu-heading"
      >
        <div className="menu-showcase__section-heading">
          <p className="menu-showcase__number">03</p>
          <div>
            <h3 id="mega-menu-heading">Mega Menu</h3>
            <p>
              One rich disclosure panel at a time, with click and keyboard paths
              always available.
            </p>
          </div>
        </div>
        <MegaMenu
          aria-label="Product areas"
          onValueChange={setMegaValue}
          openOnHover
          value={megaValue}
        >
          <MegaMenuList>
            <MegaMenuItem value="solutions">
              <MegaMenuTrigger leading={<span aria-hidden="true">✦</span>}>
                Solutions
              </MegaMenuTrigger>
              <span aria-hidden="true" className="menu-showcase__mega-bridge" />
              <MegaMenuContent className="menu-showcase__mega-content">
                <div className="menu-showcase__mega-panel">
                  <div className="menu-showcase__mega-heading">
                    <p className="menu-showcase__eyebrow">Explore the system</p>
                    <h4>Build a product surface with one visual language.</h4>
                  </div>
                  <ul className="menu-showcase__mega-grid">
                    {megaCards.map((card) => (
                      <MegaMenuLink
                        className="menu-showcase__mega-card"
                        href={card.href}
                        key={card.title}
                      >
                        <img
                          alt={card.alt}
                          className="menu-showcase__mega-image"
                          loading="lazy"
                          src={card.image}
                        />
                        <span className="menu-showcase__mega-card-body">
                          <strong>{card.title}</strong>
                          <span>{card.description}</span>
                          <span className="menu-showcase__mega-cta">
                            Explore pattern →
                          </span>
                        </span>
                      </MegaMenuLink>
                    ))}
                    <MegaMenuLink
                      className="menu-showcase__mega-all-link"
                      href="#all-solutions"
                    >
                      See every solution <span aria-hidden="true">→</span>
                    </MegaMenuLink>
                  </ul>
                </div>
              </MegaMenuContent>
            </MegaMenuItem>
            <MegaMenuItem value="resources">
              <MegaMenuTrigger>Resources</MegaMenuTrigger>
              <span aria-hidden="true" className="menu-showcase__mega-bridge" />
              <MegaMenuContent className="menu-showcase__mega-content">
                <ul className="menu-showcase__resource-panel">
                  <MegaMenuLink href="#guides">
                    Implementation guides
                  </MegaMenuLink>
                  <MegaMenuLink href="#accessibility">
                    Accessibility patterns
                  </MegaMenuLink>
                  <MegaMenuLink href="#release-notes">
                    Release notes
                  </MegaMenuLink>
                </ul>
              </MegaMenuContent>
            </MegaMenuItem>
          </MegaMenuList>
        </MegaMenu>
        <p className="menu-showcase__credits">
          Demo imagery:{" "}
          {megaCards.map((card, index) => (
            <span key={card.source}>
              {index > 0 ? " · " : ""}
              <a href={card.source} rel="noreferrer" target="_blank">
                Unsplash image {index + 1}
              </a>
            </span>
          ))}
        </p>
      </section>

      <section
        className="menu-showcase__section"
        aria-labelledby="context-heading"
      >
        <div className="menu-showcase__section-heading">
          <p className="menu-showcase__number">04</p>
          <div>
            <h3 id="context-heading">Context Menu</h3>
            <p>
              A pointer-anchored application menu, also available from the
              keyboard.
            </p>
          </div>
        </div>
        <ContextMenu open={contextOpen} onOpenChange={setContextOpen}>
          <ContextMenuTrigger
            className="menu-showcase__context-target"
            tabIndex={0}
          >
            Right-click this canvas card, or focus it and press Shift+F10.
          </ContextMenuTrigger>
          <ContextMenuContent
            align="start"
            className="menu-showcase__floating-menu"
            collisionPadding={12}
            offset={8}
          >
            <ContextMenuLabel>Canvas card</ContextMenuLabel>
            <ContextMenuItem onSelect={() => setMessage("Card duplicated.")}>
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => setMessage("Card moved to archive.")}
            >
              Archive
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>

      <section
        className="menu-showcase__section"
        aria-labelledby="menubar-heading"
      >
        <div className="menu-showcase__section-heading">
          <p className="menu-showcase__number">05</p>
          <div>
            <h3 id="menubar-heading">Menubar</h3>
            <p>
              An application-command pattern with roving trigger focus and one
              open menu.
            </p>
          </div>
        </div>
        <Menubar
          aria-label="Editor commands"
          onValueChange={setMenubarValue}
          value={menubarValue}
        >
          <MenubarMenu value="file">
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent className="menu-showcase__floating-menu">
              <MenubarLabel>Document</MenubarLabel>
              <MenubarItem onSelect={() => setMessage("New document created.")}>
                New
              </MenubarItem>
              <MenubarItem onSelect={() => setMessage("Document saved.")}>
                Save
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem disabled>Export</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu value="edit">
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent className="menu-showcase__floating-menu">
              <MenubarItem onSelect={() => setMessage("Undo applied.")}>
                Undo
              </MenubarItem>
              <MenubarItem onSelect={() => setMessage("Redo applied.")}>
                Redo
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </section>

      <section
        className="menu-showcase__section"
        aria-labelledby="bottom-navigation-heading"
      >
        <div className="menu-showcase__section-heading">
          <p className="menu-showcase__number">06</p>
          <div>
            <h3 id="bottom-navigation-heading">Bottom Navigation</h3>
            <p>
              Ordinary link navigation with explicit surface, list, link, and
              label spacing.
            </p>
          </div>
        </div>
        <BottomNavigation
          aria-label="Mobile navigation"
          className="menu-showcase__bottom-navigation"
          margin="0"
          padding="0.5rem"
        >
          <BottomNavigationList gap="0.25rem" padding="0">
            <BottomNavigationLink
              active
              href="#home"
              label="Home"
              labelStyle={{ fontWeight: 700 }}
              leading={<span aria-hidden="true">⌂</span>}
              padding="0.5rem 0.75rem"
            />
            <BottomNavigationLink
              href="#search"
              leading={<span aria-hidden="true">⌕</span>}
              padding="0.5rem 0.75rem"
            >
              Search
            </BottomNavigationLink>
            <BottomNavigationLink
              href="#saved"
              label="Saved"
              labelClassName="menu-showcase__saved-label"
              leading={<span aria-hidden="true">☆</span>}
              padding="0.5rem 0.75rem"
            />
          </BottomNavigationList>
        </BottomNavigation>
      </section>

      <p aria-live="polite" className="menu-showcase__status" role="status">
        {message}
      </p>
    </section>
  );
}

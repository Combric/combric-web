import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
  Field,
  FieldDescription,
  FieldLegend,
  FieldMessage,
  Fieldset,
  Input,
  InputGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@combric/react";
import { useState, type ComponentType, type CSSProperties } from "react";
import { Cluster, Container, Grid, Inline, Stack } from "@combric/react";
import { catalogue } from "../data/catalogue";
import { catalogueDemoMetadata } from "../data/catalogue-demos";
import { documentationVersions } from "../data/versions";

export interface ExampleDefinition {
  readonly Component: ComponentType;
  readonly source: string;
}

const define = (Component: ComponentType, source: string): ExampleDefinition =>
  Object.freeze({ Component, source: source.trim() });

function AssertiveToastExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Show urgent notification
      </button>
      <ToastViewport aria-label="Urgent notifications">
        <Toast
          open={open}
          onOpenChange={setOpen}
          duration={0}
          priority="assertive"
        >
          <ToastTitle>Connection lost</ToastTitle>
          <ToastDescription>Changes have not been saved.</ToastDescription>
          <ToastClose>Dismiss</ToastClose>
        </Toast>
      </ToastViewport>
    </>
  );
}

const componentExamples: Readonly<Record<string, ExampleDefinition>> = {
  button: define(
    () => <Button>Save changes</Button>,
    `import { Button } from "@combric/react";

export function Example() {
  return <Button>Save changes</Button>;
}`,
  ),
  "button-disabled": define(
    () => <Button disabled>Save changes</Button>,
    `import { Button } from "@combric/react";

export function Example() {
  return <Button disabled>Save changes</Button>;
}`,
  ),
  "button-variants": define(
    () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    ),
    `import { Button } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}`,
  ),
  "button-sizes": define(
    () => (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "0.75rem",
        }}
      >
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    ),
    `import { Button } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "0.75rem" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}`,
  ),
  "button-new-variants": define(
    () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Button variant="accent">Accent</Button>
        <Button variant="danger">Danger</Button>
      </div>
    ),
    `import { Button } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      <Button variant="accent">Accent</Button>
      <Button variant="danger">Danger</Button>
    </div>
  );
}`,
  ),
  "button-radius-presets": define(
    () => (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Button>Default</Button>
        <Button radius="none">None</Button>
        <Button radius="sm">Small</Button>
        <Button radius="md">Medium</Button>
        <Button radius="lg">Large</Button>
        <Button radius="full">Full</Button>
      </div>
    ),
    `import { Button } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
      <Button>Default</Button>
      <Button radius="none">None</Button>
      <Button radius="sm">Small</Button>
      <Button radius="md">Medium</Button>
      <Button radius="lg">Large</Button>
      <Button radius="full">Full</Button>
    </div>
  );
}`,
  ),
  toggle: define(
    () => <Toggle defaultPressed>Pin project</Toggle>,
    `import { Toggle } from "@combric/react";

export function Example() {
  return <Toggle defaultPressed>Pin project</Toggle>;
}`,
  ),
  "toggle-unpressed": define(
    () => <Toggle>Pin project</Toggle>,
    `import { Toggle } from "@combric/react";

export function Example() {
  return <Toggle>Pin project</Toggle>;
}`,
  ),
  "toggle-disabled": define(
    () => (
      <Toggle defaultPressed disabled>
        Pin project
      </Toggle>
    ),
    `import { Toggle } from "@combric/react";

export function Example() {
  return <Toggle defaultPressed disabled>Pin project</Toggle>;
}`,
  ),
  "toggle-group": define(
    () => (
      <ToggleGroup type="single" defaultValue="list" aria-label="View">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>
    ),
    `import { ToggleGroup, ToggleGroupItem } from "@combric/react";

export function Example() {
  return (
    <ToggleGroup type="single" defaultValue="list" aria-label="View">
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
  ),
  "toggle-group-multiple": define(
    () => (
      <ToggleGroup
        type="multiple"
        defaultValue={["bold"]}
        aria-label="Text style"
      >
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    ),
    `import { ToggleGroup, ToggleGroupItem } from "@combric/react";

export function Example() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style">
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
  ),
  "toggle-group-vertical": define(
    () => (
      <ToggleGroup
        type="single"
        orientation="vertical"
        defaultValue="list"
        aria-label="View"
      >
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>
    ),
    `import { ToggleGroup, ToggleGroupItem } from "@combric/react";

export function Example() {
  return (
    <ToggleGroup type="single" orientation="vertical" defaultValue="list" aria-label="View">
      <ToggleGroupItem value="list">List</ToggleGroupItem>
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
    </ToggleGroup>
  );
}`,
  ),
  label: define(
    () => <Label htmlFor="label-example">Project name</Label>,
    `import { Label } from "@combric/react";

export function Example() {
  return <Label htmlFor="label-example">Project name</Label>;
}`,
  ),
  input: define(
    () => <Input aria-label="Project name" placeholder="Combric docs" />,
    `import { Input } from "@combric/react";

export function Example() {
  return <Input aria-label="Project name" placeholder="Combric docs" />;
}`,
  ),
  "input-disabled": define(
    () => (
      <Input aria-label="Project name" value="Combric docs" disabled readOnly />
    ),
    `import { Input } from "@combric/react";

export function Example() {
  return <Input aria-label="Project name" value="Combric docs" disabled readOnly />;
}`,
  ),
  "input-invalid": define(
    () => <Input aria-label="Project name" aria-invalid="true" required />,
    `import { Input } from "@combric/react";

export function Example() {
  return <Input aria-label="Project name" aria-invalid="true" required />;
}`,
  ),
  textarea: define(
    () => <Textarea aria-label="Notes" defaultValue="Package-first UI." />,
    `import { Textarea } from "@combric/react";

export function Example() {
  return <Textarea aria-label="Notes" defaultValue="Package-first UI." />;
}`,
  ),
  "textarea-disabled": define(
    () => (
      <Textarea aria-label="Notes" defaultValue="Read only notes." disabled />
    ),
    `import { Textarea } from "@combric/react";

export function Example() {
  return <Textarea aria-label="Notes" defaultValue="Read only notes." disabled />;
}`,
  ),
  "textarea-invalid": define(
    () => <Textarea aria-label="Notes" aria-invalid="true" required />,
    `import { Textarea } from "@combric/react";

export function Example() {
  return <Textarea aria-label="Notes" aria-invalid="true" required />;
}`,
  ),
  checkbox: define(
    () => (
      <Label>
        <Checkbox defaultChecked /> Include archived projects
      </Label>
    ),
    `import { Checkbox, Label } from "@combric/react";

export function Example() {
  return <Label><Checkbox defaultChecked /> Include archived projects</Label>;
}`,
  ),
  "checkbox-unchecked": define(
    () => (
      <Label>
        <Checkbox /> Include archived projects
      </Label>
    ),
    `import { Checkbox, Label } from "@combric/react";

export function Example() {
  return <Label><Checkbox /> Include archived projects</Label>;
}`,
  ),
  "checkbox-disabled": define(
    () => (
      <Label>
        <Checkbox checked disabled readOnly /> Archived projects are included
      </Label>
    ),
    `import { Checkbox, Label } from "@combric/react";

export function Example() {
  return <Label><Checkbox checked disabled readOnly /> Archived projects are included</Label>;
}`,
  ),
  "radio-group": define(
    () => (
      <RadioGroup name="plan" defaultValue="starter" aria-label="Plan">
        <Label>
          <Radio value="starter" /> Starter
        </Label>
        <Label>
          <Radio value="pro" /> Pro
        </Label>
      </RadioGroup>
    ),
    `import { Label, Radio, RadioGroup } from "@combric/react";

export function Example() {
  return (
    <RadioGroup name="plan" defaultValue="starter" aria-label="Plan">
      <Label><Radio value="starter" /> Starter</Label>
      <Label><Radio value="pro" /> Pro</Label>
    </RadioGroup>
  );
}`,
  ),
  "radio-group-disabled": define(
    () => (
      <RadioGroup
        name="plan-disabled"
        defaultValue="starter"
        disabled
        aria-label="Plan"
      >
        <Label>
          <Radio value="starter" /> Starter
        </Label>
        <Label>
          <Radio value="pro" /> Pro
        </Label>
      </RadioGroup>
    ),
    `import { Label, Radio, RadioGroup } from "@combric/react";

export function Example() {
  return (
    <RadioGroup name="plan-disabled" defaultValue="starter" disabled aria-label="Plan">
      <Label><Radio value="starter" /> Starter</Label>
      <Label><Radio value="pro" /> Pro</Label>
    </RadioGroup>
  );
}`,
  ),
  "radio-group-required": define(
    () => (
      <RadioGroup
        name="required-plan"
        defaultValue="starter"
        required
        aria-label="Plan"
      >
        <Label>
          <Radio value="starter" /> Starter
        </Label>
        <Label>
          <Radio value="pro" /> Pro
        </Label>
      </RadioGroup>
    ),
    `import { Label, Radio, RadioGroup } from "@combric/react";

export function Example() {
  return <RadioGroup name="required-plan" defaultValue="starter" required aria-label="Plan"><Label><Radio value="starter" /> Starter</Label><Label><Radio value="pro" /> Pro</Label></RadioGroup>;
}`,
  ),
  switch: define(
    () => (
      <Label>
        <Switch defaultChecked /> Notifications
      </Label>
    ),
    `import { Label, Switch } from "@combric/react";

export function Example() {
  return <Label><Switch defaultChecked /> Notifications</Label>;
}`,
  ),
  "switch-off": define(
    () => (
      <Label>
        <Switch /> Notifications
      </Label>
    ),
    `import { Label, Switch } from "@combric/react";

export function Example() {
  return <Label><Switch /> Notifications</Label>;
}`,
  ),
  "switch-disabled": define(
    () => (
      <Label>
        <Switch defaultChecked disabled /> Notifications are on
      </Label>
    ),
    `import { Label, Switch } from "@combric/react";

export function Example() {
  return <Label><Switch defaultChecked disabled /> Notifications are on</Label>;
}`,
  ),
  select: define(
    () => (
      <Select aria-label="Region" defaultValue="eu">
        <option value="eu">Europe</option>
        <option value="us">United States</option>
      </Select>
    ),
    `import { Select } from "@combric/react";

export function Example() {
  return <Select aria-label="Region" defaultValue="eu"><option value="eu">Europe</option><option value="us">United States</option></Select>;
}`,
  ),
  "select-disabled": define(
    () => (
      <Select aria-label="Region" defaultValue="eu" disabled>
        <option value="eu">Europe</option>
        <option value="us">United States</option>
      </Select>
    ),
    `import { Select } from "@combric/react";

export function Example() {
  return <Select aria-label="Region" defaultValue="eu" disabled><option value="eu">Europe</option><option value="us">United States</option></Select>;
}`,
  ),
  "select-invalid": define(
    () => (
      <Select aria-label="Region" aria-invalid="true" required defaultValue="">
        <option value="" disabled>
          Choose a region
        </option>
        <option value="eu">Europe</option>
        <option value="us">United States</option>
      </Select>
    ),
    `import { Select } from "@combric/react";

export function Example() {
  return <Select aria-label="Region" aria-invalid="true" required defaultValue=""><option value="" disabled>Choose a region</option><option value="eu">Europe</option><option value="us">United States</option></Select>;
}`,
  ),
  slider: define(
    () => <Slider aria-label="Volume" defaultValue="50" min="0" max="100" />,
    `import { Slider } from "@combric/react";

export function Example() {
  return <Slider aria-label="Volume" defaultValue="50" min="0" max="100" />;
}`,
  ),
  "slider-disabled": define(
    () => (
      <Slider
        aria-label="Volume"
        defaultValue="50"
        min="0"
        max="100"
        disabled
      />
    ),
    `import { Slider } from "@combric/react";

export function Example() {
  return <Slider aria-label="Volume" defaultValue="50" min="0" max="100" disabled />;
}`,
  ),
  "slider-fill-ranges": define(
    () => (
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <span>0 of 100</span>
          <Slider aria-label="0 percent" min="0" max="100" defaultValue="0" />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <span>25 of 100</span>
          <Slider aria-label="25 percent" min="0" max="100" defaultValue="25" />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <span>50 of 100</span>
          <Slider aria-label="50 percent" min="0" max="100" defaultValue="50" />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <span>75 of 100</span>
          <Slider aria-label="75 percent" min="0" max="100" defaultValue="75" />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <span>100 of 100</span>
          <Slider
            aria-label="100 percent"
            min="0"
            max="100"
            defaultValue="100"
          />
        </div>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <span>50 of 20 to 80</span>
          <Slider
            aria-label="50 percent in offset range"
            min="20"
            max="80"
            defaultValue="50"
          />
        </div>
      </div>
    ),
    `import { Slider } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "grid", gap: "0.25rem" }}><span>0 of 100</span><Slider aria-label="0 percent" min="0" max="100" defaultValue="0" /></div>
      <div style={{ display: "grid", gap: "0.25rem" }}><span>25 of 100</span><Slider aria-label="25 percent" min="0" max="100" defaultValue="25" /></div>
      <div style={{ display: "grid", gap: "0.25rem" }}><span>50 of 100</span><Slider aria-label="50 percent" min="0" max="100" defaultValue="50" /></div>
      <div style={{ display: "grid", gap: "0.25rem" }}><span>75 of 100</span><Slider aria-label="75 percent" min="0" max="100" defaultValue="75" /></div>
      <div style={{ display: "grid", gap: "0.25rem" }}><span>100 of 100</span><Slider aria-label="100 percent" min="0" max="100" defaultValue="100" /></div>
      <div style={{ display: "grid", gap: "0.25rem" }}><span>50 of 20 to 80</span><Slider aria-label="50 percent in offset range" min="20" max="80" defaultValue="50" /></div>
    </div>
  );
}`,
  ),
  field: define(
    () => (
      <Field invalid>
        <Label>Email</Label>
        <Input defaultValue="invalid" aria-invalid="true" />
        <FieldDescription>Use your work address.</FieldDescription>
        <FieldMessage>Enter a valid email.</FieldMessage>
      </Field>
    ),
    `import { Field, FieldDescription, FieldMessage, Input, Label } from "@combric/react";

export function Example() {
  return <Field invalid><Label>Email</Label><Input defaultValue="invalid" aria-invalid="true" /><FieldDescription>Use your work address.</FieldDescription><FieldMessage>Enter a valid email.</FieldMessage></Field>;
}`,
  ),
  "field-valid": define(
    () => (
      <Field>
        <Label htmlFor="work-email">Work email</Label>
        <Input id="work-email" type="email" required />
        <FieldDescription>Use your work address.</FieldDescription>
      </Field>
    ),
    `import { Field, FieldDescription, Input, Label } from "@combric/react";

export function Example() {
  return <Field><Label htmlFor="work-email">Work email</Label><Input id="work-email" type="email" required /><FieldDescription>Use your work address.</FieldDescription></Field>;
}`,
  ),
  fieldset: define(
    () => (
      <Fieldset>
        <FieldLegend>Preferences</FieldLegend>
        <Label>
          <Checkbox /> Weekly summary
        </Label>
      </Fieldset>
    ),
    `import { Checkbox, FieldLegend, Fieldset, Label } from "@combric/react";

export function Example() {
  return <Fieldset><FieldLegend>Preferences</FieldLegend><Label><Checkbox /> Weekly summary</Label></Fieldset>;
}`,
  ),
  "fieldset-disabled": define(
    () => (
      <Fieldset disabled>
        <FieldLegend>Preferences</FieldLegend>
        <Label>
          <Checkbox defaultChecked /> Weekly summary
        </Label>
      </Fieldset>
    ),
    `import { Checkbox, FieldLegend, Fieldset, Label } from "@combric/react";

export function Example() {
  return <Fieldset disabled><FieldLegend>Preferences</FieldLegend><Label><Checkbox defaultChecked /> Weekly summary</Label></Fieldset>;
}`,
  ),
  "input-group": define(
    () => (
      <InputGroup>
        <span aria-hidden="true">https://</span>
        <Input aria-label="Project domain" defaultValue="combric.dev" />
      </InputGroup>
    ),
    `import { Input, InputGroup } from "@combric/react";

export function Example() {
  return <InputGroup><span aria-hidden="true">https://</span><Input aria-label="Project domain" defaultValue="combric.dev" /></InputGroup>;
}`,
  ),
  "input-group-action": define(
    () => (
      <InputGroup>
        <Input aria-label="Project domain" defaultValue="combric.dev" />
        <Button type="button" variant="secondary">
          Check
        </Button>
      </InputGroup>
    ),
    `import { Button, Input, InputGroup } from "@combric/react";

export function Example() {
  return <InputGroup><Input aria-label="Project domain" defaultValue="combric.dev" /><Button type="button" variant="secondary">Check</Button></InputGroup>;
}`,
  ),
  breadcrumb: define(
    () => (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/latest/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
    `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@combric/react";

export function Example() {
  return <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Docs</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>;
}`,
  ),
  pagination: define(
    () => (
      <Pagination>
        <PaginationList>
          <PaginationItem>
            <PaginationPrevious disabled />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink current href="?page=1">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="?page=2" />
          </PaginationItem>
        </PaginationList>
      </Pagination>
    ),
    `import { Pagination, PaginationItem, PaginationLink, PaginationList, PaginationNext, PaginationPrevious } from "@combric/react";

export function Example() {
  return <Pagination><PaginationList><PaginationItem><PaginationPrevious disabled /></PaginationItem><PaginationItem><PaginationLink current href="?page=1">1</PaginationLink></PaginationItem><PaginationItem><PaginationNext href="?page=2" /></PaginationItem></PaginationList></Pagination>;
}`,
  ),
  tabs: define(
    () => (
      <Tabs defaultValue="overview">
        <TabsList
          aria-label="Project sections"
          style={{ "--combric-radius-control": "0" } as CSSProperties}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings" disabled>
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity">Activity panel</TabsContent>
      </Tabs>
    ),
    `import type { CSSProperties } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@combric/react";

export function Example() {
  return <Tabs defaultValue="overview"><TabsList aria-label="Project sections" style={{ "--combric-radius-control": "0" } as CSSProperties}><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="settings" disabled>Settings</TabsTrigger></TabsList><TabsContent value="overview">Overview panel</TabsContent><TabsContent value="activity">Activity panel</TabsContent></Tabs>;
}`,
  ),
  avatar: define(
    () => (
      <Avatar size="md">
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    ),
    `import { Avatar, AvatarFallback } from "@combric/react";

export function Example() {
  return <Avatar size="md"><AvatarFallback>AD</AvatarFallback></Avatar>;
}`,
  ),
  "avatar-sizes": define(
    () => (
      <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      </div>
    ),
    `import { Avatar, AvatarFallback } from "@combric/react";

export function Example() {
  return <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}><Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar><Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar><Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar></div>;
}`,
  ),
  "avatar-image": define(
    () => (
      <Avatar size="lg">
        <AvatarImage
          src="/images/combric-avatar-example.png"
          alt="Portrait of a person"
        />
        <AvatarFallback>DA</AvatarFallback>
      </Avatar>
    ),
    `import { Avatar, AvatarFallback, AvatarImage } from "@combric/react";

export function Example() {
  return (
    <Avatar size="lg">
      <AvatarImage
        src="/images/combric-avatar-example.png"
        alt="Portrait of a person"
      />
      <AvatarFallback>DA</AvatarFallback>
    </Avatar>
  );
}`,
  ),
  badge: define(
    () => <Badge variant="accent">Active</Badge>,
    `import { Badge } from "@combric/react";

export function Example() {
  return <Badge variant="accent">Active</Badge>;
}`,
  ),
  "badge-variants": define(
    () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="accent">Accent</Badge>
      </div>
    ),
    `import { Badge } from "@combric/react";

export function Example() {
  return <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}><Badge variant="neutral">Neutral</Badge><Badge variant="accent">Accent</Badge></div>;
}`,
  ),
  card: define(
    () => (
      <Card>
        <CardHeader>
          <CardTitle>Project</CardTitle>
          <CardDescription>Current status</CardDescription>
        </CardHeader>
        <CardContent>Ready</CardContent>
      </Card>
    ),
    `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@combric/react";

export function Example() {
  return <Card><CardHeader><CardTitle>Project</CardTitle><CardDescription>Current status</CardDescription></CardHeader><CardContent>Ready</CardContent></Card>;
}`,
  ),
  "card-tones": define(
    () => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))",
          gap: "0.75rem",
        }}
      >
        <Card tone="surface">
          <CardContent>Surface</CardContent>
        </Card>
        <Card tone="muted">
          <CardContent>Muted</CardContent>
        </Card>
        <Card tone="elevated">
          <CardContent>Elevated</CardContent>
        </Card>
      </div>
    ),
    `import { Card, CardContent } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))", gap: "0.75rem" }}>
      <Card tone="surface"><CardContent>Surface</CardContent></Card>
      <Card tone="muted"><CardContent>Muted</CardContent></Card>
      <Card tone="elevated"><CardContent>Elevated</CardContent></Card>
    </div>
  );
}`,
  ),
  "card-radius-presets": define(
    () => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))",
          gap: "0.75rem",
        }}
      >
        <Card>
          <CardContent>Default</CardContent>
        </Card>
        <Card radius="none">
          <CardContent>None</CardContent>
        </Card>
        <Card radius="sm">
          <CardContent>Small</CardContent>
        </Card>
        <Card radius="md">
          <CardContent>Medium</CardContent>
        </Card>
        <Card radius="lg">
          <CardContent>Large</CardContent>
        </Card>
        <Card radius="full">
          <CardContent>Full</CardContent>
        </Card>
      </div>
    ),
    `import { Card, CardContent } from "@combric/react";

export function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))", gap: "0.75rem" }}>
      <Card><CardContent>Default</CardContent></Card>
      <Card radius="none"><CardContent>None</CardContent></Card>
      <Card radius="sm"><CardContent>Small</CardContent></Card>
      <Card radius="md"><CardContent>Medium</CardContent></Card>
      <Card radius="lg"><CardContent>Large</CardContent></Card>
      <Card radius="full"><CardContent>Full</CardContent></Card>
    </div>
  );
}`,
  ),
  separator: define(
    () => (
      <div>
        First
        <Separator />
        Second
      </div>
    ),
    `import { Separator } from "@combric/react";

export function Example() {
  return <div>First<Separator />Second</div>;
}`,
  ),
  "separator-decorative": define(
    () => (
      <div>
        <span>Summary</span>
        <Separator decorative />
        <span>Details</span>
      </div>
    ),
    `import { Separator } from "@combric/react";

export function Example() {
  return <div><span>Summary</span><Separator decorative /><span>Details</span></div>;
}`,
  ),
  table: define(
    () => (
      <TableContainer aria-label="Project inventory">
        <Table>
          <TableCaption>Projects</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Docs</TableCell>
              <TableCell>Ready</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    ),
    `import { Table, TableBody, TableCaption, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@combric/react";

export function Example() {
  return <TableContainer aria-label="Project inventory"><Table><TableCaption>Projects</TableCaption><TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Docs</TableCell><TableCell>Ready</TableCell></TableRow></TableBody></Table></TableContainer>;
}`,
  ),
  "description-list": define(
    () => (
      <DescriptionList>
        <DescriptionTerm>Runtime</DescriptionTerm>
        <DescriptionDetails>React 19</DescriptionDetails>
        <DescriptionTerm>Styling</DescriptionTerm>
        <DescriptionDetails>Standard CSS</DescriptionDetails>
      </DescriptionList>
    ),
    `import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@combric/react";

export function Example() {
  return <DescriptionList><DescriptionTerm>Runtime</DescriptionTerm><DescriptionDetails>React 19</DescriptionDetails><DescriptionTerm>Styling</DescriptionTerm><DescriptionDetails>Standard CSS</DescriptionDetails></DescriptionList>;
}`,
  ),
  accordion: define(
    () => (
      <Accordion defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>Accessible disclosure content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@combric/react";

export function Example() {
  return <Accordion defaultValue="details"><AccordionItem value="details"><AccordionTrigger>Details</AccordionTrigger><AccordionContent>Accessible disclosure content.</AccordionContent></AccordionItem></Accordion>;
}`,
  ),
  "accordion-disabled-item": define(
    () => (
      <Accordion defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Available details</AccordionTrigger>
          <AccordionContent>Content can be opened.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="locked" disabled>
          <AccordionTrigger>Unavailable details</AccordionTrigger>
          <AccordionContent>This item is disabled.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@combric/react";

export function Example() {
  return <Accordion defaultValue="details"><AccordionItem value="details"><AccordionTrigger>Available details</AccordionTrigger><AccordionContent>Content can be opened.</AccordionContent></AccordionItem><AccordionItem value="locked" disabled><AccordionTrigger>Unavailable details</AccordionTrigger><AccordionContent>This item is disabled.</AccordionContent></AccordionItem></Accordion>;
}`,
  ),
  collapsible: define(
    () => (
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Technical details</CollapsibleTrigger>
        <CollapsibleContent>
          Package-first component catalogue.
        </CollapsibleContent>
      </Collapsible>
    ),
    `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@combric/react";

export function Example() {
  return <Collapsible defaultOpen><CollapsibleTrigger>Technical details</CollapsibleTrigger><CollapsibleContent>Package-first component catalogue.</CollapsibleContent></Collapsible>;
}`,
  ),
  "collapsible-disabled": define(
    () => (
      <Collapsible disabled>
        <CollapsibleTrigger>Technical details</CollapsibleTrigger>
        <CollapsibleContent>
          Package-first component catalogue.
        </CollapsibleContent>
      </Collapsible>
    ),
    `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@combric/react";

export function Example() {
  return <Collapsible disabled><CollapsibleTrigger>Technical details</CollapsibleTrigger><CollapsibleContent>Package-first component catalogue.</CollapsibleContent></Collapsible>;
}`,
  ),
  dialog: define(
    () => (
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm change</DialogTitle>
          <DialogDescription>
            This action updates the project.
          </DialogDescription>
          <DialogClose>Cancel</DialogClose>
        </DialogContent>
      </Dialog>
    ),
    `import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@combric/react";

export function Example() {
  return <Dialog><DialogTrigger>Open dialog</DialogTrigger><DialogContent><DialogTitle>Confirm change</DialogTitle><DialogDescription>This action updates the project.</DialogDescription><DialogClose>Cancel</DialogClose></DialogContent></Dialog>;
}`,
  ),
  drawer: define(
    () => (
      <Drawer>
        <DrawerTrigger>Filters</DrawerTrigger>
        <DrawerContent side="right">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Limit visible results.</DrawerDescription>
          <DrawerClose>Done</DrawerClose>
        </DrawerContent>
      </Drawer>
    ),
    `import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@combric/react";

export function Example() {
  return <Drawer><DrawerTrigger>Filters</DrawerTrigger><DrawerContent side="right"><DrawerTitle>Filters</DrawerTitle><DrawerDescription>Limit visible results.</DrawerDescription><DrawerClose>Done</DrawerClose></DrawerContent></Drawer>;
}`,
  ),
  "drawer-left": define(
    () => (
      <Drawer>
        <DrawerTrigger>Project details</DrawerTrigger>
        <DrawerContent side="left">
          <DrawerTitle>Project details</DrawerTitle>
          <DrawerDescription>Review project metadata.</DrawerDescription>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    ),
    `import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@combric/react";

export function Example() {
  return <Drawer><DrawerTrigger>Project details</DrawerTrigger><DrawerContent side="left"><DrawerTitle>Project details</DrawerTitle><DrawerDescription>Review project metadata.</DrawerDescription><DrawerClose>Close</DrawerClose></DrawerContent></Drawer>;
}`,
  ),
  "dropdown-menu": define(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@combric/react";

export function Example() {
  return <DropdownMenu><DropdownMenuTrigger>Actions</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem disabled>Archive</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}`,
  ),
  "dropdown-menu-positioning": define(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger>More actions</DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end">
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Move</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    `import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@combric/react";

export function Example() {
  return <DropdownMenu><DropdownMenuTrigger>More actions</DropdownMenuTrigger><DropdownMenuContent side="top" align="end"><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Move</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}`,
  ),
  popover: define(
    () => (
      <Popover>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent>Non-modal details</PopoverContent>
      </Popover>
    ),
    `import { Popover, PopoverContent, PopoverTrigger } from "@combric/react";

export function Example() {
  return <Popover><PopoverTrigger>Details</PopoverTrigger><PopoverContent>Non-modal details</PopoverContent></Popover>;
}`,
  ),
  "popover-positioning": define(
    () => (
      <Popover>
        <PopoverTrigger>Inspect</PopoverTrigger>
        <PopoverContent side="top" align="end">
          Build is stable.
        </PopoverContent>
      </Popover>
    ),
    `import { Popover, PopoverContent, PopoverTrigger } from "@combric/react";

export function Example() {
  return <Popover><PopoverTrigger>Inspect</PopoverTrigger><PopoverContent side="top" align="end">Build is stable.</PopoverContent></Popover>;
}`,
  ),
  tooltip: define(
    () => (
      <Tooltip>
        <TooltipTrigger>Help</TooltipTrigger>
        <TooltipContent>Keyboard shortcut: Ctrl+K</TooltipContent>
      </Tooltip>
    ),
    `import { Tooltip, TooltipContent, TooltipTrigger } from "@combric/react";

export function Example() {
  return <Tooltip><TooltipTrigger>Help</TooltipTrigger><TooltipContent>Keyboard shortcut: Ctrl+K</TooltipContent></Tooltip>;
}`,
  ),
  "tooltip-positioning": define(
    () => (
      <Tooltip>
        <TooltipTrigger>Shortcut</TooltipTrigger>
        <TooltipContent side="left" align="start">
          Press Ctrl+K to search.
        </TooltipContent>
      </Tooltip>
    ),
    `import { Tooltip, TooltipContent, TooltipTrigger } from "@combric/react";

export function Example() {
  return <Tooltip><TooltipTrigger>Shortcut</TooltipTrigger><TooltipContent side="left" align="start">Press Ctrl+K to search.</TooltipContent></Tooltip>;
}`,
  ),
  alert: define(
    () => (
      <Alert tone="error">
        <AlertTitle>Import failed</AlertTitle>
        <AlertDescription>Check the source file.</AlertDescription>
      </Alert>
    ),
    `import { Alert, AlertDescription, AlertTitle } from "@combric/react";

export function Example() {
  return <Alert tone="error"><AlertTitle>Import failed</AlertTitle><AlertDescription>Check the source file.</AlertDescription></Alert>;
}`,
  ),
  "alert-neutral": define(
    () => (
      <Alert tone="neutral">
        <AlertTitle>Ready to review</AlertTitle>
        <AlertDescription>All required fields are complete.</AlertDescription>
      </Alert>
    ),
    `import { Alert, AlertDescription, AlertTitle } from "@combric/react";

export function Example() {
  return <Alert tone="neutral"><AlertTitle>Ready to review</AlertTitle><AlertDescription>All required fields are complete.</AlertDescription></Alert>;
}`,
  ),
  "alert-live": define(
    () => (
      <Alert tone="error" live="assertive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          The latest invoice could not be processed.
        </AlertDescription>
      </Alert>
    ),
    `import { Alert, AlertDescription, AlertTitle } from "@combric/react";

export function Example() {
  return <Alert tone="error" live="assertive"><AlertTitle>Payment failed</AlertTitle><AlertDescription>The latest invoice could not be processed.</AlertDescription></Alert>;
}`,
  ),
  toast: define(
    () => (
      <ToastViewport aria-label="Notifications">
        <Toast duration={0}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes are available.</ToastDescription>
          <ToastClose>Dismiss</ToastClose>
        </Toast>
      </ToastViewport>
    ),
    `import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@combric/react";

export function Example() {
  return <ToastViewport aria-label="Notifications"><Toast duration={0}><ToastTitle>Saved</ToastTitle><ToastDescription>Your changes are available.</ToastDescription><ToastClose>Dismiss</ToastClose></Toast></ToastViewport>;
}`,
  ),
  "toast-assertive": define(
    AssertiveToastExample,
    `import { useState } from "react";
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "@combric/react";

export function Example() {
  const [open, setOpen] = useState(false);
  return <><button type="button" onClick={() => setOpen(true)}>Show urgent notification</button><ToastViewport aria-label="Urgent notifications"><Toast open={open} onOpenChange={setOpen} duration={0} priority="assertive"><ToastTitle>Connection lost</ToastTitle><ToastDescription>Changes have not been saved.</ToastDescription><ToastClose>Dismiss</ToastClose></Toast></ToastViewport></>;
}`,
  ),
  progress: define(
    () => <Progress aria-label="Import progress" value={60} max={100} />,
    `import { Progress } from "@combric/react";

export function Example() {
  return <Progress aria-label="Import progress" value={60} max={100} />;
}`,
  ),
  "progress-indeterminate": define(
    () => <Progress aria-label="Preparing import" max={100} />,
    `import { Progress } from "@combric/react";

export function Example() {
  return <Progress aria-label="Preparing import" max={100} />;
}`,
  ),
  spinner: define(
    () => <Spinner aria-label="Refreshing projects" />,
    `import { Spinner } from "@combric/react";

export function Example() {
  return <Spinner aria-label="Refreshing projects" />;
}`,
  ),
  skeleton: define(
    () => <Skeleton style={{ minHeight: "3rem" }} />,
    `import { Skeleton } from "@combric/react";

export function Example() {
  return <Skeleton style={{ minHeight: "3rem" }} />;
}`,
  ),
  "empty-state": define(
    () => (
      <EmptyState>
        <EmptyStateTitle level={3}>No projects</EmptyStateTitle>
        <EmptyStateDescription>
          Create a project to begin.
        </EmptyStateDescription>
        <EmptyStateActions>
          <Button>Create project</Button>
        </EmptyStateActions>
      </EmptyState>
    ),
    `import { Button, EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateTitle } from "@combric/react";

export function Example() {
  return <EmptyState><EmptyStateTitle level={3}>No projects</EmptyStateTitle><EmptyStateDescription>Create a project to begin.</EmptyStateDescription><EmptyStateActions><Button>Create project</Button></EmptyStateActions></EmptyState>;
}`,
  ),
  "spinner-decorative": define(
    () => <Spinner />,
    `import { Spinner } from "@combric/react";

export function Example() {
  return <Spinner />;
}`,
  ),
  "empty-state-heading-levels": define(
    () => (
      <div style={{ display: "grid", gap: "1rem" }}>
        <EmptyState>
          <EmptyStateTitle level={2}>No projects</EmptyStateTitle>
          <EmptyStateDescription>
            Create a project to begin.
          </EmptyStateDescription>
        </EmptyState>
        <EmptyState>
          <EmptyStateTitle level={4}>No activity</EmptyStateTitle>
          <EmptyStateDescription>
            Recent updates will appear here.
          </EmptyStateDescription>
        </EmptyState>
        <EmptyState>
          <EmptyStateTitle level={6}>No results</EmptyStateTitle>
          <EmptyStateDescription>Try a different search.</EmptyStateDescription>
        </EmptyState>
      </div>
    ),
    `import { EmptyState, EmptyStateDescription, EmptyStateTitle } from "@combric/react";

export function Example() {
  return <div style={{ display: "grid", gap: "1rem" }}><EmptyState><EmptyStateTitle level={2}>No projects</EmptyStateTitle><EmptyStateDescription>Create a project to begin.</EmptyStateDescription></EmptyState><EmptyState><EmptyStateTitle level={4}>No activity</EmptyStateTitle><EmptyStateDescription>Recent updates will appear here.</EmptyStateDescription></EmptyState><EmptyState><EmptyStateTitle level={6}>No results</EmptyStateTitle><EmptyStateDescription>Try a different search.</EmptyStateDescription></EmptyState></div>;
}`,
  ),
  "layout-container": define(
    () => <Container size="prose">A readable prose-width container.</Container>,
    `import { Container } from "@combric/react";

export function Example() {
  return <Container size="prose">A readable prose-width container.</Container>;
}`,
  ),
  "layout-container-sizes": define(
    () => (
      <Stack gap="3">
        <Container size="prose">Prose width</Container>
        <Container size="wide">Wide width</Container>
        <Container size="full">Full width</Container>
      </Stack>
    ),
    `import { Container, Stack } from "@combric/react";

export function Example() {
  return <Stack gap="3"><Container size="prose">Prose width</Container><Container size="wide">Wide width</Container><Container size="full">Full width</Container></Stack>;
}`,
  ),
  "layout-stack": define(
    () => (
      <Stack gap="3">
        <div>First</div>
        <div>Second</div>
      </Stack>
    ),
    `import { Stack } from "@combric/react";

export function Example() {
  return <Stack gap="3"><div>First</div><div>Second</div></Stack>;
}`,
  ),
  "layout-stack-gaps": define(
    () => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "1rem",
        }}
      >
        <Stack gap="1">
          <div>One</div>
          <div>Two</div>
        </Stack>
        <Stack gap="3">
          <div>One</div>
          <div>Two</div>
        </Stack>
        <Stack gap="6">
          <div>One</div>
          <div>Two</div>
        </Stack>
      </div>
    ),
    `import { Stack } from "@combric/react";

export function Example() {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem" }}><Stack gap="1"><div>One</div><div>Two</div></Stack><Stack gap="3"><div>One</div><div>Two</div></Stack><Stack gap="6"><div>One</div><div>Two</div></Stack></div>;
}`,
  ),
  "layout-inline": define(
    () => (
      <Inline gap="3" align="baseline">
        <strong>Project</strong>
        <span>Ready</span>
      </Inline>
    ),
    `import { Inline } from "@combric/react";

export function Example() {
  return <Inline gap="3" align="baseline"><strong>Project</strong><span>Ready</span></Inline>;
}`,
  ),
  "layout-inline-alignments": define(
    () => (
      <Stack gap="2">
        <Inline gap="2" align="start">
          <span>Start</span>
          <strong>Value</strong>
        </Inline>
        <Inline gap="2" align="center">
          <span>Center</span>
          <strong>Value</strong>
        </Inline>
        <Inline gap="2" align="end">
          <span>End</span>
          <strong>Value</strong>
        </Inline>
        <Inline gap="2" align="baseline">
          <span>Baseline</span>
          <strong>Value</strong>
        </Inline>
      </Stack>
    ),
    `import { Inline, Stack } from "@combric/react";

export function Example() {
  return <Stack gap="2"><Inline gap="2" align="start"><span>Start</span><strong>Value</strong></Inline><Inline gap="2" align="center"><span>Center</span><strong>Value</strong></Inline><Inline gap="2" align="end"><span>End</span><strong>Value</strong></Inline><Inline gap="2" align="baseline"><span>Baseline</span><strong>Value</strong></Inline></Stack>;
}`,
  ),
  "layout-cluster": define(
    () => (
      <Cluster gap="2">
        <button type="button">Save</button>
        <button type="button">Cancel</button>
        <button type="button">Preview</button>
      </Cluster>
    ),
    `import { Cluster } from "@combric/react";

export function Example() {
  return <Cluster gap="2"><button type="button">Save</button><button type="button">Cancel</button><button type="button">Preview</button></Cluster>;
}`,
  ),
  "layout-cluster-alignments": define(
    () => (
      <Stack gap="3">
        <Cluster gap="2" align="start">
          <Button size="sm">Start</Button>
          <Button size="lg">Value</Button>
        </Cluster>
        <Cluster gap="2" align="center">
          <Button size="sm">Center</Button>
          <Button size="lg">Value</Button>
        </Cluster>
        <Cluster gap="2" align="end">
          <Button size="sm">End</Button>
          <Button size="lg">Value</Button>
        </Cluster>
        <Cluster gap="2" align="baseline">
          <Button size="sm">Baseline</Button>
          <Button size="lg">Value</Button>
        </Cluster>
      </Stack>
    ),
    `import { Button, Cluster, Stack } from "@combric/react";

export function Example() {
  return <Stack gap="3"><Cluster gap="2" align="start"><Button size="sm">Start</Button><Button size="lg">Value</Button></Cluster><Cluster gap="2" align="center"><Button size="sm">Center</Button><Button size="lg">Value</Button></Cluster><Cluster gap="2" align="end"><Button size="sm">End</Button><Button size="lg">Value</Button></Cluster><Cluster gap="2" align="baseline"><Button size="sm">Baseline</Button><Button size="lg">Value</Button></Cluster></Stack>;
}`,
  ),
  "layout-grid": define(
    () => (
      <Grid minItemWidth="sm" gap="3">
        <article>First</article>
        <article>Second</article>
        <article>Third</article>
      </Grid>
    ),
    `import { Grid } from "@combric/react";

export function Example() {
  return <Grid minItemWidth="sm" gap="3"><article>First</article><article>Second</article><article>Third</article></Grid>;
}`,
  ),
  "layout-grid-columns": define(
    () => (
      <Stack gap="3">
        <Grid columns={2} gap="2">
          <article>Two columns</article>
          <article>Two columns</article>
        </Grid>
        <Grid columns={3} gap="2">
          <article>Three</article>
          <article>Three</article>
          <article>Three</article>
        </Grid>
        <Grid columns={4} gap="2">
          <article>Four</article>
          <article>Four</article>
          <article>Four</article>
          <article>Four</article>
        </Grid>
      </Stack>
    ),
    `import { Grid, Stack } from "@combric/react";

export function Example() {
  return <Stack gap="3"><Grid columns={2} gap="2"><article>Two columns</article><article>Two columns</article></Grid><Grid columns={3} gap="2"><article>Three</article><article>Three</article><article>Three</article></Grid><Grid columns={4} gap="2"><article>Four</article><article>Four</article><article>Four</article><article>Four</article></Grid></Stack>;
}`,
  ),
  "foundation-native-css": define(
    () => <article className="surface">Canonical token surface</article>,
    `@import "@combric/tokens/css";

.surface {
  color: var(--combric-color-text);
  background: var(--combric-color-surface);
  border: var(--combric-border-width) solid var(--combric-color-border);
  padding: var(--combric-space-4);
  border-radius: var(--combric-radius);
}

<article class="surface">Canonical token surface</article>`,
  ),
  "foundation-tailwind": define(
    () => (
      <article className="border-combric border-combric-border bg-combric-surface p-combric-4 text-combric-foreground rounded-combric">
        Canonical token surface
      </article>
    ),
    `@import "tailwindcss/theme.css" layer(theme);
@import "@combric/tailwind";
@import "tailwindcss/utilities.css" layer(utilities);

<article class="border-combric border-combric-border bg-combric-surface p-combric-4 text-combric-foreground rounded-combric">
  Canonical token surface
</article>`,
  ),
  "grid-native-css": define(
    () => (
      <div className="combric-grid" data-min-item-width="sm" data-gap="3">
        <article>First</article>
        <article>Second</article>
        <article>Third</article>
      </div>
    ),
    `@import "@combric/layout/css";

<div class="combric-grid" data-min-item-width="sm" data-gap="3">
  <article>First</article>
  <article>Second</article>
  <article>Third</article>
</div>`,
  ),
  "grid-tailwind": define(
    () => (
      <div className="grid grid-combric-auto-sm gap-combric-3">
        <article>First</article>
        <article>Second</article>
        <article>Third</article>
      </div>
    ),
    `@import "tailwindcss/theme.css" layer(theme);
@import "@combric/tailwind";
@import "tailwindcss/utilities.css" layer(utilities);

<div class="grid grid-combric-auto-sm gap-combric-3">
  <article>First</article>
  <article>Second</article>
  <article>Third</article>
</div>`,
  ),
};

export interface CanonicalCatalogueDemo extends ExampleDefinition {
  readonly id: string;
  readonly version: string;
  readonly kind?: "component" | "layout" | "styling";
  readonly catalogueSlug?: string;
  readonly layoutSlug?: string;
  readonly comparisonId?: string;
  readonly approach?: "native-css" | "tailwind";
  readonly title: string;
  readonly testScenario?: string;
}

export const canonicalCatalogueDemos: readonly CanonicalCatalogueDemo[] =
  Object.freeze(
    catalogueDemoMetadata.map((metadata) => {
      const example = componentExamples[metadata.exampleKey];
      const validTarget =
        metadata.kind === "layout"
          ? Boolean(metadata.layoutSlug)
          : metadata.kind === "styling"
            ? Boolean(metadata.comparisonId && metadata.approach)
            : catalogue.some((item) => item.slug === metadata.catalogueSlug);
      if (
        !example ||
        !validTarget ||
        !documentationVersions.some(
          (version) => version.id === metadata.version,
        )
      )
        throw new Error(`Invalid canonical demo metadata: ${metadata.id}`);
      return Object.freeze({
        ...metadata,
        Component: example.Component,
        source: example.source,
      });
    }),
  );

export function catalogueDemosFor(version: string, slug: string) {
  return canonicalCatalogueDemos.filter(
    (demo) =>
      demo.version === version &&
      (demo.kind ?? "component") === "component" &&
      demo.catalogueSlug === slug,
  );
}

export function layoutDemosFor(version: string, slug: string) {
  return canonicalCatalogueDemos.filter(
    (demo) =>
      demo.version === version &&
      demo.kind === "layout" &&
      demo.layoutSlug === slug,
  );
}

export function stylingDemosFor(version: string, comparisonId: string) {
  return canonicalCatalogueDemos.filter(
    (demo) =>
      demo.version === version &&
      demo.kind === "styling" &&
      demo.comparisonId === comparisonId,
  );
}

export function catalogueDemoById(id: string) {
  return canonicalCatalogueDemos.find((demo) => demo.id === id);
}

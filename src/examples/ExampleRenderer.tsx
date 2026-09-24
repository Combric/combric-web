import { catalogueDemoById } from "./catalogue-examples";

export function ExampleRenderer({ demoId }: { readonly demoId: string }) {
  const example = catalogueDemoById(demoId);
  if (!example) return <p role="alert">Example unavailable.</p>;
  const Example = example.Component;
  return <Example />;
}

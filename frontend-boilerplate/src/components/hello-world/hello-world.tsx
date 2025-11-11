import { Heading } from "@radix-ui/themes";

interface HelloWorldProps {
  name?: string;
}

export function HelloWorld(props: HelloWorldProps) {
  const { name = "World" } = props;

  return <Heading size="9">Hello, {name}!</Heading>;
}

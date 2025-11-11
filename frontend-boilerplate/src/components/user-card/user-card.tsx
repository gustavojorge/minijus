import { Card, DataList } from "@radix-ui/themes";

interface UserCardProps {
  user: {
    name: string;
    email: string;
    age: number;
  };
}

export function UserCard(props: UserCardProps) {
  const { user } = props;

  return (
    <Card>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Nome:</DataList.Label>
          <DataList.Value>{user.name}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Email:</DataList.Label>
          <DataList.Value>{user.email}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>Idade:</DataList.Label>
          <DataList.Value>{user.age}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Card>
  );
}

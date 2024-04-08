import ListItemGroup from "@/components/ListItemGroup";
import { getListMembersByUser, getTagsByUser } from "@/lib/database/list";
import { getListItemsByUser } from "@/lib/database/listItem";
import { getUser } from "@/lib/session";

export default async function Page() {
  const user = await getUser();

  const items = await getListItemsByUser(user ? user.id : '');
  const tags = await getTagsByUser(user ? user.id : '');
  const members = await getListMembersByUser(user ? user.id : '');

  return (
    <main className='p-8 w-full flex flex-col gap-8'>
      <ListItemGroup startingItems={JSON.stringify(items)} startingTags={JSON.stringify(tags)} members={JSON.stringify(members)} />
    </main>
  );
}
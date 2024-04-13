'use client';

import { ReactNode, useState } from "react";
import { Button, Input, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@nextui-org/react";
import { CalendarMinus, Check, Sliders2, StopwatchFill, Plus, TrashFill } from "react-bootstrap-icons";
import { usePathname, useRouter } from 'next/navigation';
import { api } from "@/lib/api";
import { addSnackbar } from "@/components/Snackbar";
import { setTimeout } from "timers";
import { validateListName } from "@/lib/validate";
import List from "@/lib/model/list";

export default function Sidebar({ startingLists }: { startingLists: string }) {
  const [lists, setLists] = useState<List[]>(JSON.parse(startingLists));
  const [addingList, setAddingList] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function finalizeNew(name: string) {
    api.post('/list', { name })
      .then(res => {
        const id = res.content?.split('/').at(-1);
        router.push(`/user${res.content}`);
        
        const newLists = structuredClone(lists);
        newLists.push(new List(name, [], [], true, true, true, id));
        setLists(newLists);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  async function removeNew() {
    function delay(ms: number) {
      return new Promise(res => setTimeout(res, ms));
    }
    
    await delay(100);
    setAddingList(false);
  }

  function deleteList(id: string) {
    if(!confirm('Are you sure you want to delete this list? This action is irreversible.'))
      return;

    api.delete(`/list/${id}`)
      .then(res => {
        addSnackbar(res.message, 'success');

        if(`/user/list/${id}` == pathname)
          router.replace('/user');

        const newLists = structuredClone(lists);
        for(let i = 0; i < newLists.length; i++)
          if(newLists[i].id == id)
            newLists.splice(i, 1);
        setLists(newLists);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <aside className='w-48 bg-content1 p-4 flex flex-col gap-4 overflow-y-scroll'>
      <NavItem name='Today' link='/user' />
      <NavSection name='Lists' endContent={<AddList addList={() => setAddingList(true)} />}>
        {
          lists.sort((a, b) => a.name > b.name ? 1 : 0)
            .map(list => <NavItem key={list.id} name={list.name} link={`/user/list/${list.id}`} endContent={<ListSettings listId={list.id} dueDates={list.hasDueDates} timeTracking={list.hasTimeTracking} deleteList={deleteList.bind(null, list.id)} />} />)
        }
        {addingList ? <NewItem finalize={finalizeNew} remove={removeNew} /> : <></>}
      </NavSection>
    </aside>
  );
}

function NavSection({ name, endContent, children }: { name: string, endContent?: ReactNode, children: ReactNode }) {
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center text-xs'>{name} {endContent}</div>
      <div className='pl-2 flex flex-col'>
        {children}
      </div>
    </div>
  );
}

export function NavItem({ name, link, endContent }: { name: string, link: string, endContent?: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname == link;

  return (
    <span className={`pl-2 flex items-center justify-between border-l-2${isActive ? ' border-primary' : ' border-transparent'} text-sm`}>
      <Link href={link} color='foreground' >{name}</Link>
      {endContent}
    </span>
  );
}

function AddList({ addList }: { addList: () => any }) {
  return (
    <Button onPress={addList} variant='ghost' color='primary' isIconOnly className='border-0 text-foreground rounded-lg w-8 h-8 min-w-8 min-h-8'>
      <Plus size={'1.25em'} />
    </Button>
  );
}

function NewItem({ finalize, remove }: { finalize: (name: string) => any, remove: () => any }) {
  const [name, setName] = useState('');

  function updateName(name: string) {
    setName(validateListName(name)[1]);
  }

  return (
    <form className={`pl-1 flex items-center justify-between gap-2 text-sm`} onSubmit={e => { e.preventDefault(); finalize(name) }}>
      <Input value={name} autoFocus onValueChange={updateName} onBlur={remove} variant='underlined' color='primary' placeholder='List name' size='sm' />
      <Button type='submit' variant='ghost' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'>
        <Check />
      </Button>
    </form>
  );
}

export function ListSettings({ listId, timeTracking, dueDates, deleteList }: { listId: string, timeTracking: boolean, dueDates: boolean, deleteList: () => any }) {
  const [hasTimeTracking, setHasTimeTracking] = useState(timeTracking);
  const [hasDueDates, setHasDueDates] = useState(dueDates);

  function updateHasTimeTracking() {
    api.patch(`/list/${listId}`, { hasTimeTracking: !hasTimeTracking })
      .then(res => {
        addSnackbar(res.message, 'success');
        setHasTimeTracking(!hasTimeTracking);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  function updateHasDueDates() {
    api.patch(`/list/${listId}`, { hasDueDates: !hasDueDates })
      .then(res => {
        addSnackbar(res.message, 'success');
        setHasDueDates(!hasDueDates);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }
  
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button type='button' color='primary' isIconOnly variant='ghost' className='border-0 text-foreground rounded-lg w-8 h-8 min-w-8 min-h-8'>
          <Sliders2 />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onPress={updateHasTimeTracking} key='toggleTime' startContent={<StopwatchFill />}>{hasTimeTracking ? 'Disable' : 'Enable'} time tracking</DropdownItem>
        <DropdownItem onPress={updateHasDueDates} startContent={<CalendarMinus />}>{hasDueDates ? 'Disable' : 'Enable'} due dates</DropdownItem>
        <DropdownItem onPress={deleteList} startContent={<TrashFill />} className='text-danger' color='danger'>Delete list</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
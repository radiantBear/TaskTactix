'use client';

import { ReactNode, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { Check, Sliders2, Plus, StopwatchFill, CalendarMinus, SortUpAlt } from "react-bootstrap-icons";
import { useRouter } from 'next/navigation';
import { api } from "@/lib/api";
import { addSnackbar } from "@/components/Snackbar";
import { setTimeout } from "timers";
import { validateListName } from "@/lib/validate";

export default function Sidebar() {
  const [addingList, setAddingList] = useState(false);
  const router = useRouter();

  function finalize(name: string) {
    console.log('starting')
    api.post('/list', { name })
      .then(res => {
        router.push(`/user${res.content}`);
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  async function remove() {
    function delay(ms: number) {
      return new Promise(res => setTimeout(res, ms));
    }
    
    await delay(100);
    setAddingList(false);
  }

  return (
    <aside className='w-48 bg-content1 p-4 flex flex-col gap-4'>
      <NavItem value='Today' isActive={false} />
      <NavSection name='Lists' endContent={<AddList addList={() => setAddingList(true)} />}>
        <NavItem value='List 1' isActive={true} endContent={<ListSettings />} />
        <NavItem value='List 2' isActive={false} endContent={<ListSettings />} />
        {addingList ? <NewItem finalize={finalize} remove={remove} /> : <></>}
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

function NavItem({ value, endContent, isActive }: { value: ReactNode, endContent?: ReactNode, isActive: boolean }) {
  return (
    <span className={`pl-2 flex items-center justify-between${isActive ? ' border-l-2 border-primary' : ''} text-sm`}>
      {value}
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
      <Input value={name} ref={input => input?.focus()} onValueChange={updateName} onBlur={remove} variant='underlined' color='primary' placeholder='List name' size='sm' />
      <Button type='submit' variant='ghost' color='primary' isIconOnly className='rounded-lg w-8 h-8 min-w-8 min-h-8'>
        <Check />
      </Button>
    </form>
  );
}

function ListSettings() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color='primary' isIconOnly variant='ghost' className='border-0 text-foreground rounded-lg w-8 h-8 min-w-8 min-h-8'>
          <Sliders2 />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key='toggleTime' startContent={<StopwatchFill />}>No time tracking</DropdownItem>
        <DropdownItem key='toggleDueDate' startContent={<CalendarMinus />}>No due dates</DropdownItem>
        <DropdownItem key='sortCompleted' startContent={<SortUpAlt />}>Sort completed ascending</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
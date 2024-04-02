'use client';

import Message, { InputMessage } from '@/components/InputMessage';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { addSnackbar } from '@/components/Snackbar';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { setLoggedIn } from '@/app/body';

export default function SignIn() {
  interface InputMessages {
    username: InputMessage;
    password: InputMessage;
  }

  const defaultMessage: InputMessage = {message: '', color: 'default'};

  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [inputMsgs, setInputMsgs] = useState<InputMessages>({ username: defaultMessage, password: defaultMessage });
  const router = useRouter();

  function handleUsernameInput(input: string) {
    setInputs({...inputs, username: input})
  }
  
  function handlePasswordInput(input: string) {
    setInputs({...inputs, password: input});
  }

	function handleSubmit() {
    api.post('/session', inputs)
      .then(() => {
        setLoggedIn();
        router.replace('/user');
      })
      .catch(err => addSnackbar(err.message, 'error'));
  }

  return (
    <form>
      <Input 
        label='Username' 
        value={inputs.username}
        color={inputMsgs.username.color}
        description={<Message data={inputMsgs.username} />}
        onValueChange={handleUsernameInput}
        type='text'
        variant='underlined'
      />
      <Input 
        label='Password' 
        value={inputs.password}
        color={inputMsgs.password.color}
        description={<Message data={inputMsgs.password} />}
        onValueChange={handlePasswordInput}
        type='password' 
        variant='underlined'
      />
      <div className='flex justify-center mt-6'>
        <Button color='primary' onPress={handleSubmit} >Sign In</Button>
      </div>
    </form>
	);
}
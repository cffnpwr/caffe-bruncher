import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import useSWR, { KeyedMutator } from 'swr';

const MisskeyLogin = () => {
  const [instanceName, setInstanceName] = useState('');
  const { data, error, mutate } = useLoginStatus();
  const isLogin = data ? data.status === 200 : false;
  const onChangeInstanceName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInstanceName(event.target.value);
  };

  return (
    <>
      {isLogin ? (
        ''
      ) : (
        <input
          type='text'
          value={instanceName}
          onChange={onChangeInstanceName}
          placeholder='Instance Name'
        />
      )}
      <button onClick={() => login(isLogin, instanceName, mutate)}>
        {(isLogin ? 'Logout' : 'Login') + ' Misskey'}
      </button>
    </>
  );
};

const login = async (
  isLogin: boolean,
  instanceName: string,
  mutate: KeyedMutator<string>
) => {
  if (isLogin) {
    await fetch('/api/misskey/auth', {
      method: 'DELETE',
    });

    mutate();
  } else {
    const res = await fetch(`/api/misskey/auth?instance=${instanceName}`, {
      method: 'GET',
    });
    const url = (await res.json())['auth_url'] || '';
    if (!url) return;

    Router.push(url);
  }
};

const fetcher = (url: string) =>
  fetch(url, { method: 'GET' }).then((res) => res.json());
const useLoginStatus = () => {
  const { data, error, isValidating, mutate } = useSWR(
    '/api/misskey/login_status',
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      shouldRetryOnError: false,
    }
  );

  return { data, error, isValidating, mutate };
};

export default MisskeyLogin;

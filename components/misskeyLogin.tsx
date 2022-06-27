import { mkIsLoginContext } from '@/pages';
import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import useSWR, { KeyedMutator } from 'swr';

const MisskeyLogin = () => {
  const [instanceName, setInstanceName] = useState('');
  const { data, isValidating, mutate } = useLoginStatus();
  const isLoginContext = useContext(mkIsLoginContext);
  const isLogin = isLoginContext.isLogin;

  useEffect(() => {
    isLoginContext.setIsLogin(data ? data.status === 200 : false);
  }, [isLoginContext.setIsLogin, data]);

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
          disabled={isValidating}
        />
      )}
      <button
        onClick={() => login(isLogin, instanceName, mutate)}
        disabled={isValidating}
      >
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
    if (!instanceName) return;
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

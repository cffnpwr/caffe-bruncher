import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { KeyedMutator } from 'swr';
import { mkValidationState } from './stores/login';
import { useMkLoginStatus } from './stores/swr';

const MisskeyLogin = () => {
  const [vState, setVState] = useRecoilState(mkValidationState);

  const [instanceName, setInstanceName] = useState('');
  const { data, isValidating, mutate } = useMkLoginStatus();
  const isLogin = vState.isLogin;

  useEffect(() => {
    setVState({
      isLogin: data ? data.status === 200 || data.status === 100 : false,
      data: data ? data.data || '' : '',
    });
  }, [setVState, data]);

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
    if (res.status !== 200) return;
    const url = (await res.json())['auth_url'] || '';
    if (!url) return;

    Router.push(url);
  }
};

export default MisskeyLogin;

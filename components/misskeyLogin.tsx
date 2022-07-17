import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { mkValidationState } from './stores/login';
import { useMkLoginStatus } from './stores/swr';

const MisskeyLogin = () => {
  const [vState, setVState] = useRecoilState(mkValidationState);

  const [instanceName, setInstanceName] = useState('');
  const { data, isValidating, mutate } = useMkLoginStatus();

  useEffect(() => {
    if (isValidating) return;

    setVState({
      isLogin: data ? data.status === 200 : false,
      data: data ? data.data || '' : '',
    });
  }, [isValidating, setVState, data]);

  const onChangeInstanceName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInstanceName(event.target.value);
  };

  const login = async () => {
    if (vState.isLogin) {
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

  return (
    <>
      {vState.isLogin ? (
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
      <button onClick={login} disabled={isValidating}>
        {(vState.isLogin ? 'Logout' : 'Login') + ' Misskey'}
      </button>
    </>
  );
};

export default MisskeyLogin;

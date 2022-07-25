import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
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
        <TextField
          variant='outlined'
          type='text'
          value={instanceName}
          onChange={onChangeInstanceName}
          label='Instance Name'
          disabled={isValidating}
          sx={{ pr: 2, pb: { xs: 2, sm: 0 } }}
        />
      )}
      <LoadingButton
        onClick={login}
        loading={isValidating}
        variant={vState.isLogin ? 'text' : 'contained'}
      >
        {(vState.isLogin ? 'Logout' : 'Login') + ' Misskey'}
      </LoadingButton>
    </>
  );
};

export default MisskeyLogin;

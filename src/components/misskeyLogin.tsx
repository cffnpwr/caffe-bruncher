import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Router from 'next/router';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { localeState } from '../stores/locale';
import { mkValidationState } from '../stores/login';
import { useMkLoginStatus } from '../stores/swr';
import locales from '../locale';

const MisskeyLogin = () => {
  const vState = useRecoilValue(mkValidationState);

  const [instanceName, setInstanceName] = useState('');
  const { isValidating, mutate } = useMkLoginStatus();

  const locale = useRecoilValue(localeState);
  const localeObj = locales[locale];

  const onChangeInstanceName = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
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
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center ',
        height: '16em',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center ',
          width: 'max-content',
        }}
      >
        <Avatar
          src='https://raw.githubusercontent.com/misskey-dev/assets/main/icon.png'
          alt='Misskey instance icon'
          sx={{
            bgcolor: 'transparent',
            m: '0.5em',
            width: '48px',
            height: '48px',
            color: '#86b300',
          }}
        >
          Mi
        </Avatar>
        <Typography variant='h5'>
          {localeObj.login.misskey.loginWith}
        </Typography>
      </Box>
      {vState.isLogin ? (
        ''
      ) : (
        <TextField
          variant='standard'
          type='text'
          value={instanceName}
          onChange={onChangeInstanceName}
          label={localeObj.login.misskey.instance}
          placeholder={localeObj.login.misskey.egInstance}
          disabled={isValidating}
        />
      )}
      <LoadingButton
        onClick={login}
        loading={isValidating}
        variant={vState.isLogin ? 'text' : 'contained'}
        sx={{ mt: 0 }}
      >
        {(vState.isLogin ? 'Logout' : 'Login') + ' Misskey'}
      </LoadingButton>
    </Box>
  );
};

export default MisskeyLogin;

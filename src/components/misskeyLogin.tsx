import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Router from 'next/router';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { theme } from '../pages/_app';
import { mkValidationState } from '../stores/login';
import { useMkLoginStatus } from '../stores/swr';

const MisskeyLogin = () => {
  const vState = useRecoilValue(mkValidationState);

  const [instanceName, setInstanceName] = useState('');
  const { isValidating, mutate } = useMkLoginStatus();

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
        }}
      >
        <Avatar
          src=''
          alt='Misskey instance icon'
          sx={{
            bgcolor: theme.palette.background.default,
            mx: '0.5em',
            my: '0.75em',
            color: '#86B300',
          }}
        >
          Mi
        </Avatar>
        <Typography variant='h5'>Misskeyでログイン</Typography>
      </Box>
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

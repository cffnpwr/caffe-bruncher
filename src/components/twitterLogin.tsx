import { Twitter } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Typography } from '@mui/material';
import Router from 'next/router';
import { useRecoilValue } from 'recoil';


import locales from '../locale';
import { localeState } from '../stores/locale';
import { twValidationState } from '../stores/login';
import { useTwLoginStatus } from '../stores/swr';

const TwitterLogin = () => {
  const { isValidating, mutate } = useTwLoginStatus();

  const vState = useRecoilValue(twValidationState);

  const locale = useRecoilValue(localeState);
  const localeObj = locales[locale];

  const login = async () => {
    if (vState.isLogin) {
      await fetch('/api/twitter/auth', {
        method: 'DELETE',
      });

      mutate();
    } else {
      const res = await fetch('/api/twitter/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      });
      const oauthToken = (await res.json())['oauth_token'] || '';

      if (!oauthToken) return;

      Router.push(`https://api.twitter.com/oauth/authorize?${oauthToken}`);
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
        <Twitter fontSize='large' sx={{ m: '0.5em', color: '#1da1f2' }} />
        <Typography variant='h5'>
          {localeObj.login.twitter.loginWith}
        </Typography>
      </Box>
      <LoadingButton
        onClick={login}
        loading={isValidating}
        variant={vState.isLogin ? 'text' : 'contained'}
      >
        {vState.isLogin ? 'Logout Twitter' : 'Login Twitter'}
      </LoadingButton>
    </Box>
  );
};

export default TwitterLogin;

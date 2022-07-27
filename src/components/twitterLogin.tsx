import Router from 'next/router';
import { useEffect } from 'react';
import { twValidationState } from '../stores/login';
import { useRecoilState } from 'recoil';
import { useTwLoginStatus } from '../stores/swr';
import LoadingButton from '@mui/lab/LoadingButton';

const TwitterLogin = () => {
  const { data, isValidating, mutate } = useTwLoginStatus();

  const [vState, setVState] = useRecoilState(twValidationState);

  useEffect(() => {
    if (isValidating) return;

    setVState({
      isLogin: data ? data.status === 200 : false,
      data: data ? data.data || '' : '',
    });
  }, [isValidating, setVState, data]);

  const login = async () => {
    if (vState.isLogin) {
      await fetch('/api/twitter/auth', {
        method: 'DELETE',
      });

      mutate();
    } else {
      const res = await fetch('/api/twitter/auth', {
        method: 'GET',
      });
      const oauthToken = (await res.json())['oauth_token'] || '';

      if (!oauthToken) return;

      Router.push(`https://api.twitter.com/oauth/authorize?${oauthToken}`);
    }
  };

  return (
    <LoadingButton
      onClick={login}
      loading={isValidating}
      variant={vState.isLogin ? 'text' : 'contained'}
    >
      {vState.isLogin ? 'Logout Twitter' : 'Login Twitter'}
    </LoadingButton>
  );
};

export default TwitterLogin;

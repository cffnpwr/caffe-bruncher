import Router from 'next/router';
import { useEffect } from 'react';
import { twValidationState } from './stores/login';
import { useRecoilState } from 'recoil';
import { useTwLoginStatus } from './stores/swr';

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
    <button onClick={login} disabled={isValidating}>
      {vState.isLogin ? 'Logout Twitter' : 'Login Twitter'}
    </button>
  );
};

export default TwitterLogin;

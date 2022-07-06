import Router from 'next/router';
import { useEffect } from 'react';
import { KeyedMutator } from 'swr';
import { twValidationState } from './stores/login';
import { useRecoilState } from 'recoil';
import { useTwLoginStatus } from './stores/swr';

const TwitterLogin = () => {
  const { data, isValidating, mutate } = useTwLoginStatus();

  const [vState, setVState] = useRecoilState(twValidationState);
  const isLogin = vState.isLogin;

  useEffect(() => {
    setVState({
      isLogin: data ? data.status === 200 || data.status === 100 : false,
      data: data ? data.data || '' : '',
    });
  }, [setVState, data]);
  return (
    <button onClick={() => login(isLogin, mutate)} disabled={isValidating}>
      {isLogin ? 'Logout Twitter' : 'Login Twitter'}
    </button>
  );
};

const login = async (isLogin: boolean, mutate: KeyedMutator<string>) => {
  if (isLogin) {
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

export default TwitterLogin;

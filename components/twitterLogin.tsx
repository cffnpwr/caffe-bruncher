import { twIsLoginContext } from '@/pages';
import Router from 'next/router';
import { useContext, useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr';

const TwitterLogin = () => {
  const { data, isValidating, mutate } = useLoginStatus();
  const isLoginContext = useContext(twIsLoginContext);
  const isLogin = isLoginContext.isLogin;

  useEffect(() => {
    isLoginContext.setIsLogin(data ? data === '200' : false);
  }, [isLoginContext.setIsLogin, data]);
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

const fetcher = (url: string) =>
  fetch(url, { method: 'GET' }).then((res) => res.text());
const useLoginStatus = () => {
  const { data, error, isValidating, mutate } = useSWR(
    '/api/twitter/login_status',
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      shouldRetryOnError: false,
    }
  );

  return { data, error, isValidating, mutate };
};

export default TwitterLogin;

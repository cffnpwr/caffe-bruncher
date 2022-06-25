import Router from 'next/router';
import useSWR, { KeyedMutator } from 'swr';

const TwitterLogin = () => {
  const { data, error, mutate } = useLoginStatus();
  const isLogin = data === '200';

  return (
    <>
      <button onClick={() => login(isLogin, mutate)}>
        {isLogin ? 'Logout Twitter' : 'Login Twitter'}
      </button>
    </>
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
      refreshInterval: 1000,
      shouldRetryOnError: false,
    }
  );

  return { data, error, isValidating, mutate };
};

export default TwitterLogin;

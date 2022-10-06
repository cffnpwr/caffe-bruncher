import useSWR from 'swr';

const twFetcher = (url: string) =>
  fetch(url, { method: 'GET' }).then((res) => res.json());
export const useTwLoginStatus = () => {
  const { data, error, isValidating, mutate } = useSWR(
    '/api/twitter/auth/status',
    twFetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      shouldRetryOnError: false,
    },
  );

  return { data, error, isValidating, mutate };
};

const mkFetcher = (url: string) =>
  fetch(url, { method: 'GET' }).then((res) => res.json());
export const useMkLoginStatus = () => {
  const { data, error, isValidating, mutate } = useSWR(
    '/api/misskey/auth/status',
    mkFetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      shouldRetryOnError: false,
    },
  );

  return { data, error, isValidating, mutate };
};

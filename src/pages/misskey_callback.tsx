import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Page: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    const setToken = async () => {
      if (router.isReady) {
        const token = router.query.token;
        if (!token) router.push('/');

        const res = await fetch('/api/misskey/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            token: token,
          }),
        });

        if (res.status !== 200) console.error('failed:status', res.status);

        router.push('/');
      }
    };
    setToken();
  }, [router, query]);

  return <></>;
};

export default Page;

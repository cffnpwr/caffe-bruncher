import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Page: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (router.isReady) {
      const token = router.query.token;
      if (!token) router.push('/');

      fetch('/api/misskey/auth', {
        method: 'POST',
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((res) => {
          if (res.status !== 200) console.error('failed:status', res.status);

          return res.text();
        })
        .then((data) => data);

      router.push('/');
    }
  }, [router, query]);

  return <></>;
};

export default Page;

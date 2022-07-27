import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Page: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    const setToken = async () => {
      if (router.isReady) {
        const oauthToken = router.query.oauth_token;
        const oauthVerifier = router.query.oauth_verifier;
        if (!oauthToken || !oauthVerifier) router.push('/login');

        const res = await fetch('/api/twitter/auth', {
          method: 'POST',
          body: JSON.stringify({
            oauth_token: oauthToken,
            oauth_verifier: oauthVerifier,
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

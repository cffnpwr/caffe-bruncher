import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (router.isReady) {
      const oauthToken = router.query.oauth_token;
      const oauthVerifier = router.query.oauth_verifier;
      if (!oauthToken || !oauthVerifier) {
        router.push('/');
      }

      fetch('/api/twitter/auth', {
        method: 'POST',
        body: JSON.stringify({
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
        }),
      })
        .then((res) => {
          if (res.status !== 200) {
            console.error('failed:status', res.status);
          }

          return res.text();
        })
        .then((data) => data);

      router.push('/');
    }
  }, [router, query]);

  return <></>;
};

export default Page;

import { CircularProgress, Box } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Page: NextPage = () => {
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (router.isReady) {
      const token = router.query.token;
      if (!token) router.push('/login');

      fetch('/api/misskey/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          token: token,
        }),
      }).then((res) => {
        if (res.status !== 200) {
          console.error('failed:status', res.status);
        }
      });

      setTimeout(() => router.push('/'), 2500);
    }
  }, [router, query]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size='60px' />
    </Box>
  );
};

export default Page;

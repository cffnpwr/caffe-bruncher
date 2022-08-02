import { useRecoilValue } from 'recoil';
import PostForm from '@/src/components/postForm';
import { mkValidationState, twValidationState } from '@/src/stores/login';
import { Box, Container, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CheckLogin from '../components/checkLogin';
import CaffeBruncherTitle from '../components/caffeBruncherTitle';

const Home = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const isLogin = twVState.isLogin && mkVState.isLogin;

  const router = useRouter();

  useEffect(() => {
    if (
      router.isReady &&
      !isLogin &&
      twVState.isLogin !== undefined &&
      mkVState.isLogin !== undefined
    ) {
      router.push('/login');
    }
  }, [router, isLogin, twVState, mkVState]);

  return (
    <>
      <Box
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CaffeBruncherTitle />
        <Container
          component='main'
          sx={{
            maxWidth: { xs: 'lg', md: 'md' },
            mb: 5,
            px: { xs: 1, md: 'auto' },
          }}
        >
          <Paper sx={{ px: { xs: 2, md: 5 }, py: 2.5 }}>
            <PostForm />
          </Paper>
        </Container>
      </Box>
      <CheckLogin />
    </>
  );
};

export default Home;

import { Box, Grid, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import CaffeBruncherTitle from '../components/caffeBruncherTitle';
import CheckLogin from '../components/checkLogin';
import MisskeyLogin from '../components/misskeyLogin';
import TwitterLogin from '../components/twitterLogin';
import { mkValidationState, twValidationState } from '../stores/login';

const Login = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const isLogin = twVState.isLogin && mkVState.isLogin;

  const router = useRouter();

  useEffect(() => {
    if (router.isReady && isLogin) {
      router.push('/');
    }
  }, [router, isLogin]);

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
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent='center'
            alignItems='center'
            sx={{ maxWidth: { sm: 'sm', md: 'lg' } }}
          >
            <Grid item xs={12} md={6}>
              <Paper>
                <TwitterLogin />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper>
                <MisskeyLogin />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <CheckLogin />
    </>
  );
};

export default Login;

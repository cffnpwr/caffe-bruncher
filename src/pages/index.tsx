import { useRecoilValue } from 'recoil';
import PostForm from '@/src/components/postForm';
import { mkValidationState, twValidationState } from '@/src/stores/login';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CheckLogin from '../components/checkLogin';
import CaffeBruncherTitle from '../components/caffeBruncherTitle';
import { Close, GitHub, Settings } from '@mui/icons-material';
import { useMkLoginStatus, useTwLoginStatus } from '../stores/swr';

const Home = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const isLogin = twVState.isLogin && mkVState.isLogin;

  const { mutate: twMutate } = useTwLoginStatus();
  const { mutate: mkMutate } = useMkLoginStatus();

  const [openSettigs, setOpenSettings] = useState<boolean>(false);

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

  const logout = async (srv: 'misskey' | 'twitter') => {
    await fetch(`/api/${srv}/auth`, {
      method: 'DELETE',
    });
    srv === 'misskey' ? mkMutate() : twMutate();

    return;
  };

  return (
    <>
      <AppBar
        color='transparent'
        sx={{ backdropFilter: 'blur(24px)', boxShadow: 'none' }}
      >
        <Toolbar sx={{ justifyContent: 'end' }}>
          <IconButton
            href='https://github.com/cffnpwr/caffe-bruncher'
            target='_blank'
            color='primary'
            size='large'
          >
            <GitHub />
          </IconButton>
          <IconButton
            color='primary'
            size='large'
            onClick={() => setOpenSettings(true)}
          >
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
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
      <SwipeableDrawer
        anchor='right'
        open={openSettigs}
        onOpen={() => setOpenSettings(true)}
        onClose={() => setOpenSettings(false)}
        PaperProps={{
          sx: { width: '350px', borderRadius: '10px 0px 0px 10px' },
        }}
        ModalProps={{ keepMounted: true }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6'>Settings</Typography>
          <IconButton color='primary' onClick={() => setOpenSettings(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography variant='overline'>Accounts</Typography>

          <List>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ ml: 2 }}>Twitter</Typography>
              <Button
                variant='text'
                size='small'
                sx={{ mx: 1 }}
                onClick={() => logout('twitter')}
              >
                Logout
              </Button>
            </Box>
            <ListItem sx={{ mb: 2 }}>
              <ListItemAvatar>
                <Avatar src={twVState.data.profile_image_url} />
              </ListItemAvatar>
              <ListItemText
                primary={twVState.data.name}
                secondary={`@${twVState.data.username}`}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ ml: 2 }}>Misskey</Typography>
              <Button
                variant='text'
                size='small'
                sx={{ mx: 1 }}
                onClick={() => logout('misskey')}
              >
                Logout
              </Button>
            </Box>
            <ListItem sx={{ mb: 2 }}>
              <ListItemAvatar>
                <Avatar src={mkVState.data.avatarUrl} />
              </ListItemAvatar>
              <ListItemText
                primary={mkVState.data.name}
                secondary={`@${mkVState.data.username}`}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
      <CheckLogin />
    </>
  );
};

export default Home;

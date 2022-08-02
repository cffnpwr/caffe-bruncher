import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Close, GitHub, Settings } from '@mui/icons-material';
import { useMkLoginStatus, useTwLoginStatus } from '@/src/stores/swr';
import { mkValidationState, twValidationState } from '../stores/login';
import { useRecoilValue } from 'recoil';

const CaffeBruncherHeader = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const isLogin = twVState.isLogin && mkVState.isLogin;

  const { mutate: twMutate } = useTwLoginStatus();
  const { mutate: mkMutate } = useMkLoginStatus();

  const [openSettigs, setOpenSettings] = useState<boolean>(false);

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
        position='absolute'
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
        {isLogin ? (
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
        ) : (
          ''
        )}
      </SwipeableDrawer>
    </>
  );
};

export default CaffeBruncherHeader;

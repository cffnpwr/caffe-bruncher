import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SwipeableDrawer,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  AccountCircle,
  Close,
  GitHub,
  Settings,
  Translate,
} from '@mui/icons-material';
import { useMkLoginStatus, useTwLoginStatus } from '@/src/stores/swr';
import { mkValidationState, twValidationState } from '../stores/login';
import { useRecoilState, useRecoilValue } from 'recoil';
import { localeState } from '../stores/locale';
import locales from '../locale';

const CaffeBruncherHeader = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const isLogin = twVState.isLogin && mkVState.isLogin;

  const { mutate: twMutate } = useTwLoginStatus();
  const { mutate: mkMutate } = useMkLoginStatus();

  const [openSettigs, setOpenSettings] = useState<boolean>(false);

  const [locale, setLocale] = useRecoilState(localeState);
  const localeObj = locales[locale];

  const logout = async (srv: 'misskey' | 'twitter') => {
    await fetch(`/api/${srv}/auth`, {
      method: 'DELETE',
    });
    srv === 'misskey' ? mkMutate() : twMutate();

    return;
  };

  const onChangeLanguage = (event: SelectChangeEvent) => {
    setLocale(event.target.value as string);
  };

  return (
    <>
      <AppBar
        color='transparent'
        sx={{ backdropFilter: 'blur(24px)', boxShadow: 'none' }}
        position='absolute'
      >
        <Toolbar sx={{ justifyContent: 'end' }}>
          <Tooltip title={localeObj.tooltip.github}>
            <IconButton
              href='https://github.com/cffnpwr/caffe-bruncher'
              target='_blank'
              color='primary'
              size='large'
            >
              <GitHub />
            </IconButton>
          </Tooltip>
          <Tooltip title={localeObj.tooltip.settings}>
            <IconButton
              color='primary'
              size='large'
              onClick={() => setOpenSettings(true)}
            >
              <Settings />
            </IconButton>
          </Tooltip>
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
          <Typography variant='h6'>{localeObj.settings.title}</Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountCircle sx={{ mr: 1 }} />
              <Typography variant='overline'>
                {localeObj.settings.accounts.title}
              </Typography>
            </Box>

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
              <ListItem>
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
              <ListItem>
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
        <Box
          sx={{
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Translate sx={{ mr: 1 }} />
            <Typography variant='overline'>
              {localeObj.settings.language.title}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ my: 2 }}>
            <Select value={locale} onChange={onChangeLanguage}>
              {Object.keys(locales).map((locale, index) => (
                <MenuItem key={index} value={locale}>
                  {locales[locale].language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default CaffeBruncherHeader;

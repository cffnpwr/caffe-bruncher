import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mkValidationState, twValidationState } from '@/src/stores/login';
import { postingContentState } from '../stores/postForm';
import { countGrapheme, countGraphemeForTwitter } from '@/src/lib/utils';
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  TextField,
} from '@mui/material';
import {
  Send,
  Public,
  Image,
  Visibility,
  VisibilityOff,
  Leaderboard,
  TagFacesRounded,
  Home,
  Lock,
  CloudOff,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

const PostForm = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const [postingContent, setPostingContent] =
    useRecoilState(postingContentState);

  const [canPosting, setCanPosting] = useState<boolean>(false);
  const [useCW, setUseCW] = useState<boolean>(false);

  const twIconUrl = twVState.data.profile_image_url;
  const mkIconUrl = mkVState.data.avatarUrl;

  const twIsLogin = twVState.isLogin;
  const mkIsLogin = mkVState.isLogin;

  const [visibilityAnchor, setVisibilityAnchor] = useState<null | HTMLElement>(
    null
  );

  useEffect(() => {
    setCanPosting(twIsLogin && mkIsLogin);
  }, [setCanPosting, twIsLogin, mkIsLogin]);

  const onChangePostingText = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    content.text = event.target.value;

    setPostingContent(content);
  };

  const onChangeCW = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    content.cw = event.target.value;

    setPostingContent(content);
  };

  const setVisibility = (
    event: React.MouseEvent<HTMLElement>,
    visibility: 'public' | 'home' | 'followers'
  ): void => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    content.visibility = visibility;

    setPostingContent(content);
    setVisibilityAnchor(null);
  };

  const onKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ): Promise<void> => {
    if (event.key == 'Enter' && event.ctrlKey) await submit();
  };

  const toggleCW = () => {
    setUseCW(!useCW);
  };

  const toggleLocalOnly = () => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    content.localOnly = !content.localOnly;

    setPostingContent(content);
  };

  const submit = async () => {
    if (!canPosting || !postingContent.text) return;

    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    if (useCW) {
      if (!postingContent.cw) content.cw = '';
    } else {
      delete content.cw;
    }

    setCanPosting(false);
    const res = await fetch('/api/post', {
      method: 'POST',
      body: JSON.stringify(content),
    });
    if (res.status !== 200) {
      console.error(`failed to post. status: ${res.status}`);
      setCanPosting(true);

      return;
    }

    setPostingContent({
      text: '',
      visibility: postingContent.visibility,
      cw: postingContent.cw,
    });
    setCanPosting(true);

    return;
  };

  return (
    <Box component='form'>
      <Box
        component='header'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'sponClick={}ace-around',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            pr: 1,
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Avatar
              alt='twitter icon'
              src={twIconUrl}
              sx={{ width: '48px', height: '48px', bgcolor: '#fff', m: 1 }}
            />
            <Avatar
              alt='misskey icon'
              src={mkIconUrl}
              sx={{ width: '48px', height: '48px', bgcolor: '#fff', m: 1 }}
            />
          </Box>
          <Grid container sx={{ width: '10em', height: 'fit-content' }}>
            <Grid item xs={4} sx={{ height: 'fit-content' }}>
              Twitter
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'end', height: 'fit-content' }}>
              {countGraphemeForTwitter(postingContent.text)}
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ textAlign: 'center', height: 'fit-content' }}
            >
              /
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'end', height: 'fit-content' }}>
              280
            </Grid>

            <Grid item xs={4} sx={{ height: 'fit-content' }}>
              Misskey
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'end', height: 'fit-content' }}>
              {countGrapheme(postingContent.text)}
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ textAlign: 'center', height: 'fit-content' }}
            >
              /
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'end', height: 'fit-content' }}>
              3000
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            textAlign: 'end',
            width: {
              xs: '100%',
              md: postingContent.localOnly ? '16.5em' : '12em',
            },
            ml: 1,
          }}
        >
          {postingContent.localOnly ? (
            <IconButton
              aria-label='local only'
              color='primary'
              disableRipple={true}
              sx={{ mr: 0.5 }}
            >
              <CloudOff />
            </IconButton>
          ) : (
            ''
          )}
          <IconButton
            aria-label='visibility'
            color='primary'
            onClick={(event) => setVisibilityAnchor(event.currentTarget)}
          >
            {postingContent.visibility === 'followers' ? (
              <Lock />
            ) : postingContent.visibility === 'home' ? (
              <Home />
            ) : (
              <Public />
            )}
          </IconButton>
          <Menu
            anchorEl={visibilityAnchor}
            open={Boolean(visibilityAnchor)}
            onClose={() => setVisibilityAnchor(null)}
          >
            <MenuItem onClick={(event) => setVisibility(event, 'public')}>
              <ListItemIcon>
                <Public color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='パブリック'
                secondary='すべてのユーザーに公開'
              />
            </MenuItem>
            <MenuItem onClick={(event) => setVisibility(event, 'home')}>
              <ListItemIcon>
                <Home color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='ホーム'
                secondary='ホームタイムラインにのみに公開'
              />
            </MenuItem>
            <MenuItem onClick={(event) => setVisibility(event, 'followers')}>
              <ListItemIcon>
                <Lock color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='フォロワー'
                secondary='自分のフォロワーのみに公開'
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={toggleLocalOnly}>
              <ListItemIcon>
                <CloudOff color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='ローカルのみ'
                secondary='リモートユーザーには非公開'
              />
              <Switch
                checked={Boolean(postingContent.localOnly)}
                onChange={toggleLocalOnly}
              />
            </MenuItem>
          </Menu>
          <LoadingButton
            onClick={submit}
            endIcon={<Send />}
            loading={!canPosting && twIsLogin && mkIsLogin}
            loadingPosition='end'
            variant='contained'
            disabled={!twIsLogin || !mkIsLogin}
            sx={{ ml: 1 }}
          >
            Send
          </LoadingButton>
        </Box>
      </Box>
      <Box>
        {useCW ? (
          <TextField
            type='text'
            value={postingContent.cw || ''}
            placeholder='Comments'
            onChange={onChangeCW}
            sx={{
              width: '100%',
              resize: 'none',
              py: '1em',
            }}
          />
        ) : (
          ''
        )}
        <TextField
          multiline
          rows={10}
          value={postingContent.text}
          disabled={!canPosting}
          onChange={onChangePostingText}
          onKeyDown={onKeyDown}
          placeholder='What are you doing?'
          sx={{
            height: '100%',
            width: '100%',
            resize: 'none',
            py: '1em',
          }}
        />
      </Box>
      <Box component='footer'>
        <IconButton aria-label='image' color='primary' size='large'>
          <Image />
        </IconButton>
        <IconButton aria-label='poll' color='primary' size='large'>
          <Leaderboard />
        </IconButton>
        <IconButton
          aria-label='CW'
          color='primary'
          size='large'
          onClick={toggleCW}
        >
          {useCW ? <VisibilityOff /> : <Visibility />}
        </IconButton>
        <IconButton aria-label='emojis' color='primary' size='large'>
          <TagFacesRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostForm;

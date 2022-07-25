import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  mkValidationState,
  twValidationState,
} from '@/components/stores/login';
import { postingContentState } from './stores/postForm';
import { countGrapheme, countGraphemeForTwitter } from '@/lib/utils';
import { Avatar, Box, Grid, IconButton, TextField } from '@mui/material';
import {
  Send,
  Public,
  Image,
  Visibility,
  VisibilityOff,
  Leaderboard,
  TagFacesRounded,
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

  const onKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>
  ): Promise<void> => {
    if (event.key == 'Enter' && event.ctrlKey) await submit();
  };

  const toggleCW = () => {
    setUseCW(!useCW);
  };

  const submit = async () => {
    if (!canPosting || !postingContent.text) return;

    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    if (useCW && !postingContent.cw) content.cw = '';
    else delete content.cw;

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

    setPostingContent({ text: '' });
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
          justifyContent: 'space-between',
          alignItems: 'center',
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
        <Grid display='flex' justifyContent='space-between'>
          <Grid
            display='flex'
            justifyContent='space-between'
            flexDirection='column'
          >
            <span>Twitter</span>
            <span>Misskey</span>
          </Grid>
          <Grid
            display='flex'
            justifyContent='space-between'
            flexDirection='column'
          >
            <Grid
              display='flex'
              justifyContent='space-between'
              sx={{ pl: '1em', width: '5em' }}
            >
              <span>{countGraphemeForTwitter(postingContent.text)}</span>
              <Grid
                display='flex'
                justifyContent='space-between'
                sx={{ width: '2.75em' }}
              >
                <span>/</span>
                <span>280</span>
              </Grid>
            </Grid>
            <Grid
              display='flex'
              justifyContent='space-between'
              sx={{
                pl: '1em',
                width: '5em',
              }}
            >
              <span>{countGrapheme(postingContent.text)}</span>
              <Grid
                display='flex'
                justifyContent='space-between'
                sx={{ width: '2.75em' }}
              >
                <span>/</span>
                <span>3000</span>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            textAlign: { xs: 'end', md: 'initial' },
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <IconButton aria-label='global' color='primary'>
            <Public />
          </IconButton>
          <LoadingButton
            onClick={submit}
            endIcon={<Send />}
            loading={!canPosting && twIsLogin && mkIsLogin}
            loadingPosition='end'
            variant='contained'
            disabled={!twIsLogin || !mkIsLogin}
          >
            Send
          </LoadingButton>
        </Box>
      </Box>
      <Box>
        {useCW ? (
          <TextField
            type='text'
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
      <footer>
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
      </footer>
    </Box>
  );
};

export default PostForm;

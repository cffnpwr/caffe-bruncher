import {
  Cancel,
  ClosedCaption,
  Cloud,
  CloudOff,
  Home,
  Image as ImageIcon,
  Leaderboard,
  Lock,
  Public,
  Send,
  TagFacesRounded,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { generate } from 'cjp';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { countGrapheme, countGraphemeForTwitter } from '@/src/lib/utils';
import locales from '@/src/locale';
import { mkValidationState, twValidationState } from '@/src/stores/login';

import { localeState } from '../stores/locale';
import { postingContentState } from '../stores/postForm';


const PostForm = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const [postingContent, setPostingContent] =
    useRecoilState(postingContentState);

  const [canPosting, setCanPosting] = useState<boolean>(false);
  const [canTyping, setCanTyping] = useState<boolean>(true);
  const [useCW, setUseCW] = useState<boolean>(false);

  const twIconUrl = twVState.data.profile_image_url;
  const mkIconUrl = mkVState.data.avatarUrl;

  const twIsLogin = twVState.isLogin;
  const mkIsLogin = mkVState.isLogin;

  const [visibilityAnchor, setVisibilityAnchor] = useState<null | HTMLElement>(
    null,
  );

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  const locale = useRecoilValue(localeState);
  const localeObj = locales[locale];

  const [useCjp, setUseCjp] = useState<boolean>(false);

  const [previewImages, setPreviewImages] = useState<PostingFileProps[]>([]);
  const [imageSettingAnchor, setImageSettingAnchor] =
    useState<null | HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<null | number>(
    null,
  );

  const [imageCaptionOpen, setImageCaptionOpen] = useState<boolean>(false);
  const [imageCaption, setImageCaption] = useState<string>('');

  useEffect(() => {
    setCanPosting(Boolean(twIsLogin) && Boolean(mkIsLogin));
  }, [setCanPosting, twIsLogin, mkIsLogin]);

  const onChangePostingText = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent),
    );
    content.text = event.target.value;

    setPostingContent(content);
  };

  const onChangeCW = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent),
    );
    content.cw = event.target.value;

    setPostingContent(content);
  };

  const setVisibility = (visibility: 'public' | 'home' | 'followers'): void => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent),
    );
    content.visibility = visibility;

    setPostingContent(content);
    setVisibilityAnchor(null);
  };

  const onKeyDown = async (
    event: React.KeyboardEvent<HTMLDivElement>,
  ): Promise<void> => {
    if (event.key == 'Enter' && event.ctrlKey) await submit();
  };

  const toggleCW = () => {
    setUseCW(!useCW);
  };

  const toggleLocalOnly = () => {
    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent),
    );
    content.localOnly = !content.localOnly;

    setPostingContent(content);
  };

  const closeSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
  };

  const addFiles = (files: FileList) => {
    const previewURLs = [...previewImages];
    for (const file of files)
      if (previewURLs.length < 16 && 
        (file.type === 'image/jpeg' || 
        file.type === 'image/png' || 
        file.type === 'image/gif' || 
        file.type === 'image/webp'))
        previewURLs.push({ file: file, URL: URL.createObjectURL(file) });

    setPreviewImages(previewURLs);
  };

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    addFiles(files);

    event.target.value = '';
  };

  const cancelFileUpload = (index: number) => {
    const previewURLs = [...previewImages];
    const revokingImages = previewURLs.splice(index, 1);

    URL.revokeObjectURL(revokingImages[0].URL);

    setPreviewImages(previewURLs);
    setImageSettingAnchor(null);
    setCurrentImageIndex(null);
  };

  const onPasteFile = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const files = event.clipboardData.files;
    if(!files.length) return;

    addFiles(files);
  };

  const onChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (countGrapheme(text) > 512) return;

    setImageCaption(text);
  };

  const setCaption = (index: number) => {
    const previewURLs = [...previewImages];
    previewURLs[index].caption = imageCaption;

    setPreviewImages(previewURLs);
  };

  const toggleSensitive = (index: number) => {
    const previewURLs = [...previewImages];
    previewURLs[index].isSensitive = !previewURLs[index].isSensitive;

    setPreviewImages(previewURLs);
  };

  const submit = async () => {
    if (!canPosting || (!postingContent.text && !previewImages.length)) return;

    const content: PostingContentProps = JSON.parse(
      JSON.stringify(postingContent),
    );
    if (useCW) {
      if (!postingContent.cw) content.cw = '';
    } else {
      delete content.cw;
    }

    if (useCjp && locale === 'ja-sus') {
      content.text = generate(content.text);

      if (useCW) content.cw = generate(content.cw);
    }

    setCanPosting(false);
    setCanTyping(false);
    if (previewImages.length) {
      const fileData = new FormData();
      const fileInfos: { caption: string; isSensitive: boolean; }[] = [];
      for (const key in previewImages) {
        const image = previewImages[key];
        fileData.append(key, image.file);

        fileInfos[key] = {
          caption: image.caption || '',
          isSensitive: image.isSensitive || false,
        };
      }
      fileData.set('info', JSON.stringify(fileInfos));

      const fileRes = await fetch('/api/medias', {
        method: 'POST',
        body: fileData,
      });
      const fileIds: { twMediaIds: string[], mkFileIds: string[]; } = await fileRes.json();
      content.fileIds = fileIds;

      //  revoke blobs
      for (const image of previewImages)
        URL.revokeObjectURL(image.URL);
    }

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(content),
    });
    if (res.status !== 200) {
      console.error(`failed to post. status: ${res.status}`);

      let msg = localeObj.error.api.post.unknown;
      switch ((await res.json()).status) {
        case '400b':
          msg = localeObj.error.api.post['400b'];
          break;

        case '500t':
          msg = localeObj.error.api.post['500t'];
          break;

        case '500m':
          msg = localeObj.error.api.post['500m'];
          break;

        default:
          break;
      }
      setSnackbarMsg(msg);
      setOpenSnackbar(true);

      setCanPosting(true);
      setCanTyping(true);

      return;
    }

    setPostingContent({
      text: '',
      visibility: postingContent.visibility,
      localOnly: postingContent.localOnly,
      cw: postingContent.cw,
    });
    setPreviewImages([]);
    setCanPosting(true);
    setCanTyping(true);

    return;
  };

  return (
    <Box component='form'>
      <Box
        component='header'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-around',
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
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent=' '
              variant='dot'
              overlap='circular'
              sx={{
                '& .MuiBadge-badge': { bgcolor: '#1da1f2', transform: 'none' },
              }}
            >
              <Avatar
                alt='twitter icon'
                src={twIconUrl}
                sx={{ width: '48px', height: '48px', bgcolor: '#fff', m: 1 }}
              />
            </Badge>
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent=' '
              variant='dot'
              overlap='circular'
              sx={{
                '& .MuiBadge-badge': { bgcolor: '#86b300', transform: 'none' },
              }}
            >
              <Avatar
                alt='misskey icon'
                src={mkIconUrl}
                sx={{ width: '48px', height: '48px', bgcolor: '#fff', m: 1 }}
              />
            </Badge>
          </Box>
          <Grid container sx={{ width: '10em', height: 'fit-content' }}>
            <Grid item xs={4} sx={{ height: 'fit-content' }}>
              Twitter
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'end', height: 'fit-content' }}>
              {countGraphemeForTwitter(
                useCjp && locale === 'ja-sus'
                  ? generate(postingContent.text)
                  : postingContent.text,
              )}
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
              {countGrapheme(
                useCjp && locale === 'ja-sus'
                  ? generate(postingContent.text)
                  : postingContent.text,
              )}
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
              md: '16.5em',
            },
            ml: 1,
          }}
        >
          <Tooltip title={localeObj.tooltip.localOnly}>
            <IconButton
              aria-label='local only'
              color='primary'
              sx={{ mr: 0.5 }}
              onClick={toggleLocalOnly}
            >
              {postingContent.localOnly ? <CloudOff /> : <Cloud />}
            </IconButton>
          </Tooltip>
          <Tooltip title={localeObj.tooltip.visibility}>
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
          </Tooltip>
          <Menu
            anchorEl={visibilityAnchor}
            open={Boolean(visibilityAnchor)}
            onClose={() => setVisibilityAnchor(null)}
          >
            <MenuItem onClick={() => setVisibility('public')}>
              <ListItemIcon>
                <Public color='primary' />
              </ListItemIcon>
              <ListItemText
                primary={localeObj.postForm.visibility.public.primary}
                secondary={localeObj.postForm.visibility.public.secondary}
              />
            </MenuItem>
            <MenuItem onClick={() => setVisibility('home')}>
              <ListItemIcon>
                <Home color='primary' />
              </ListItemIcon>
              <ListItemText
                primary={localeObj.postForm.visibility.home.primary}
                secondary={localeObj.postForm.visibility.home.secondary}
              />
            </MenuItem>
            <MenuItem onClick={() => setVisibility('followers')}>
              <ListItemIcon>
                <Lock color='primary' />
              </ListItemIcon>
              <ListItemText
                primary={localeObj.postForm.visibility.followers.primary}
                secondary={localeObj.postForm.visibility.followers.secondary}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={toggleLocalOnly}>
              <ListItemIcon>
                <CloudOff color='primary' />
              </ListItemIcon>
              <ListItemText
                primary={localeObj.postForm.visibility.localOnly.primary}
                secondary={localeObj.postForm.visibility.localOnly.secondary}
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
            {localeObj.postForm.send}
          </LoadingButton>
        </Box>
      </Box>
      <Box>
        {useCW ? (
          <TextField
            type='text'
            value={postingContent.cw || ''}
            placeholder={localeObj.postForm.cw}
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
          disabled={!canTyping}
          onChange={onChangePostingText}
          onKeyDown={onKeyDown}
          onPaste={onPasteFile}
          placeholder={localeObj.postForm.textarea}
          sx={{
            height: '100%',
            width: '100%',
            resize: 'none',
            py: '1em',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        {previewImages.map((image, index) => (
          <Box key={index}>
            <Image
              src={image.URL}
              id={index.toString()}
              key={index}
              width='48px'
              height='48px'
              objectFit='contain'
              onClick={(e) => {
                setImageSettingAnchor(e.currentTarget);
                setCurrentImageIndex(index);
              }}
              alt='uploaded image'
            />
            <Menu
              anchorEl={imageSettingAnchor}
              open={index === currentImageIndex}
              onClose={() => {
                setImageSettingAnchor(null);
                setCurrentImageIndex(null);
              }}
            >
              <MenuItem
                onClick={() => {
                  setImageCaption(previewImages[index].caption || '');
                  setImageCaptionOpen(true);
                }}
              >
                <ClosedCaption sx={{ mr: 2 }} />
                <Typography color='primary'>キャプションを追加</Typography>
              </MenuItem>
              <MenuItem onClick={() => toggleSensitive(index)}>
                {previewImages[index].isSensitive ? (
                  <VisibilityOff sx={{ mr: 2 }} />
                ) : (
                  <Visibility sx={{ mr: 2 }} />
                )}
                <Typography color='primary'>閲覧注意</Typography>
              </MenuItem>
              <MenuItem onClick={() => cancelFileUpload(index)}>
                <Cancel sx={{ mr: 2 }} />
                <Typography color='primary'>添付取り消し</Typography>
              </MenuItem>
            </Menu>
            <Modal
              open={index === currentImageIndex && imageCaptionOpen}
              onClose={() => setImageCaptionOpen(false)}
            >
              <Fade in={index === currentImageIndex && imageCaptionOpen}>
                <Container
                  component='main'
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: { xs: '100%', md: '520px' },
                  }}
                >
                  <Paper>
                    <Box
                      sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center ',
                        height: 'auto',
                      }}
                    >
                      <Typography variant='h5'>キャプションを追加</Typography>
                      <TextField
                        multiline
                        rows={5}
                        placeholder='キャプションを追加'
                        onChange={onChangeCaption}
                        value={imageCaption}
                        sx={{
                          height: '100%',
                          width: '100%',
                          resize: 'none',
                          py: '1em',
                          m: 2,
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center ',
                          width: 'max-content',
                        }}
                      >
                        <Button
                          variant='contained'
                          sx={{ minWidth: '100px', px: 2, mx: 1 }}
                          onClick={() => {
                            setCaption(index);
                            setImageCaptionOpen(false);
                          }}
                        >
                          OK
                        </Button>
                        <Button
                          variant='outlined'
                          sx={{ minWidth: '100px', px: 2, mx: 1 }}
                          onClick={() => {
                            setImageCaption('');
                            setImageCaptionOpen(false);
                          }}
                        >
                          キャンセル
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Container>
              </Fade>
            </Modal>
          </Box>
        ))}
      </Box>
      <Box
        component='footer'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box>
          <Tooltip title={localeObj.tooltip.image}>
            <IconButton
              aria-label='image'
              color='primary'
              size='large'
              component='label'
              disabled={!canTyping}
            >
              <input
                hidden
                accept='image/png, image/jpeg, image/gif, image/webp'
                type='file'
                multiple
                onChange={onFileUpload}
              />
              <ImageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={localeObj.tooltip.poll}>
            <IconButton aria-label='poll' color='primary' size='large' disabled={!canTyping}>
              <Leaderboard />
            </IconButton>
          </Tooltip>
          <Tooltip title={localeObj.tooltip.cw}>
            <IconButton
              aria-label='CW'
              color='primary'
              size='large'
              onClick={toggleCW}
              disabled={!canTyping}
            >
              {useCW ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>
          <Tooltip title={localeObj.tooltip.emoji}>
            <IconButton aria-label='emojis' color='primary' size='large' disabled={!canTyping}>
              <TagFacesRounded />
            </IconButton>
          </Tooltip>
        </Box>
        {locale === 'ja-sus' ? (
          <FormControlLabel
            control={
              <Switch checked={useCjp} onChange={() => setUseCjp(!useCjp)} />
            }
            label='怪レい日本语て投稿ずゑ'
            sx={{ ml: 0.5 }}
          />
        ) : (
          <Box />
        )}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity='error'
          sx={{ width: '100%' }}
          variant='filled'
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostForm;

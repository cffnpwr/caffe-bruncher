import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  mkValidationState,
  twValidationState,
} from '@/components/stores/login';
import * as styles from '@/styles/postForm';
import { postingContentState } from './stores/postForm';

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
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): Promise<void> => {
    if (event.key == 'Enter' && event.ctrlKey) await login();
  };

  const toggleCW = () => {
    setUseCW(!useCW);
  };

  const login = async () => {
    if (!canPosting || !postingContent.text) return;

    const content: MisskeyPostingContentProps = JSON.parse(
      JSON.stringify(postingContent)
    );
    if (useCW && !postingContent.cw) content.cw = '';

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
    <div css={styles.postForm}>
      <header css={styles.topbar}>
        <div>
          <img src={twIconUrl} alt='twitter icon' css={styles.icon} />
          <img src={mkIconUrl} alt='misskey icon' css={styles.icon} />
        </div>
        <button type='submit' disabled={!canPosting} onClick={login}>
          Send
        </button>
      </header>
      <div className='form'>
        {useCW ? (
          <input
            type='text'
            css={styles.input}
            placeholder='Comments'
            onChange={onChangeCW}
          />
        ) : (
          ''
        )}
        <textarea
          css={[styles.input, styles.inputArea]}
          value={postingContent.text}
          disabled={!canPosting}
          onChange={onChangePostingText}
          onKeyDown={onKeyDown}
          placeholder='What are you doing?'
        ></textarea>
      </div>
      <footer>
        <button css={styles.button}>
          <i className='fa-solid fa-images'></i> {/* 画像 */}
        </button>
        <button css={styles.button}>
          <i className='fa-solid fa-square-poll-vertical'></i> {/* 投票 */}
        </button>
        <button
          css={styles.button}
          className={useCW ? 'active' : ''}
          onClick={toggleCW}
        >
          <i className='fa-solid fa-eye-low-vision'></i> {/* CW */}
        </button>
        <button css={styles.button}>
          <i className='fa-solid fa-face-smile'></i> {/* 絵文字 */}
        </button>
      </footer>
    </div>
  );
};

export default PostForm;

import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  mkValidationState,
  twValidationState,
} from '@/components/stores/login';
import * as styles from '@/styles/postForm';
import { postingContentState } from './stores/postForm';
import { countGrapheme, countGraphemeForTwitter } from '@/lib/utils';

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
          {twIconUrl && (
            <img src={twIconUrl} alt='twitter icon' css={styles.icon} />
          )}
          {mkIconUrl && (
            <img src={mkIconUrl} alt='misskey icon' css={styles.icon} />
          )}
        </div>
        <div css={styles.textCounts}>
          <div css={styles.textCount}>
            <span>Twitter</span>
            <span>Misskey</span>
          </div>
          <div css={styles.textCount}>
            <div css={styles.countParLimit}>
              <span>{countGraphemeForTwitter(postingContent.text)}</span>
              <div css={styles.textCountLimit}>
                <span>/</span>
                <span>280</span>
              </div>
            </div>
            <div css={styles.countParLimit}>
              <span>{countGrapheme(postingContent.text)}</span>
              <div css={styles.textCountLimit}>
                <span>/</span>
                <span>3000</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button css={styles.button}>
            <span className='material-symbols-rounded'>public</span>
            {/* 公開範囲 */}
          </button>
          <button type='submit' disabled={!canPosting} onClick={submit}>
            Send <span className='material-symbols-rounded'>send</span>
          </button>
        </div>
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
          <span className='material-symbols-rounded'>image</span> {/* 画像 */}
        </button>
        <button css={styles.button}>
          <span className='material-symbols-rounded'>leaderboard</span>
          {/* 投票 */}
        </button>
        <button
          css={styles.button}
          className={useCW ? 'active' : ''}
          onClick={toggleCW}
        >
          <span className='material-symbols-rounded'>visibility_off</span>
          {/* CW */}
        </button>
        <button css={styles.button}>
          <span className='material-symbols-rounded'>sentiment_satisfied</span>
          {/* 絵文字 */}
        </button>
      </footer>
    </div>
  );
};

export default PostForm;

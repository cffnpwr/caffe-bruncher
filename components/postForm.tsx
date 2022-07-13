import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  mkValidationState,
  twValidationState,
} from '@/components/stores/login';
import * as styles from '@/styles/postForm';

const PostForm = () => {
  const twVState = useRecoilValue(twValidationState);
  const mkVState = useRecoilValue(mkValidationState);
  const [postingContent, setPostingContent] = useState<string>('');
  const [canPosting, setCanPosting] = useState<boolean>(false);

  const twIconUrl = twVState.data.profile_image_url;
  const mkIconUrl = mkVState.data.avatarUrl;

  const twIsLogin = twVState.isLogin;
  const mkIsLogin = mkVState.isLogin;

  useEffect(() => {
    setCanPosting(twIsLogin && mkIsLogin);
  }, [setCanPosting, twIsLogin, mkIsLogin]);

  const onChangePostingContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setPostingContent(event.target.value);
  };

  const login = async (postingContent: string, canPosting: boolean) => {
    if (!canPosting || !postingContent) return;

    setCanPosting(false);
    const res = await fetch('/api/post', {
      method: 'POST',
      body: JSON.stringify({
        content: postingContent,
      }),
    });
    if (res.status !== 200) {
      console.error(`failed to post. status: ${res.status}`);

      return;
    }

    setPostingContent('');
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
        <button
          type='submit'
          disabled={!canPosting}
          onClick={() => {
            login(postingContent, canPosting);
          }}
        >
          Send
        </button>
      </header>
      <div className='form'>
        <input type='text' css={styles.input} />
        <textarea
          css={[styles.input, styles.inputArea]}
          value={postingContent}
          disabled={!canPosting}
          onChange={onChangePostingContent}
        ></textarea>
      </div>
      <footer>
        <button css={styles.button}>
          <i className='fa-solid fa-images'></i> {/* 画像 */}
        </button>
        <button>
          <i className='fa-solid fa-square-poll-vertical'></i> {/* 投票 */}
        </button>
      </footer>
    </div>
  );
};

export default PostForm;

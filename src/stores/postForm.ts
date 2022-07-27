import { atom } from 'recoil';

export const postingContentState = atom<MisskeyPostingContentProps>({
  key: 'postingContent',
  default: {
    text: '',
  },
});

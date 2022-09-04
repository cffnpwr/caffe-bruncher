import { atom } from 'recoil';
import { persistAtom } from './common';

export const postingContentState = atom<MisskeyPostingContentProps>({
  key: 'postingContent',
  default: {
    text: '',
  },
  effects_UNSTABLE: [persistAtom],
});

import { atom } from 'recoil';
import { persistAtom } from './common';

export const localeState = atom<string>({
  key: 'localeState',
  default: 'ja',
  effects_UNSTABLE: [persistAtom],
});

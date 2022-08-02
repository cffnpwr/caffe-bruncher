import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'recoilPersist',
  storage: typeof window === 'undefined' ? undefined : localStorage,
});

export const localeState = atom<string>({
  key: 'localeState',
  default: 'ja',
  effects_UNSTABLE: [persistAtom],
});

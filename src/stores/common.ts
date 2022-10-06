import { recoilPersist } from 'recoil-persist';

export const { persistAtom } = recoilPersist({
  key: 'recoilPersist',
  storage: typeof window === 'undefined' ? undefined : localStorage,
});

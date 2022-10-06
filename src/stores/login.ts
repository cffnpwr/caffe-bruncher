import { atom } from 'recoil';

export const twValidationState = atom<ValidationState>({
  key: 'twValidationState',
  default: {
    isLogin: undefined,
    data: {},
  },
});
export const mkValidationState = atom<ValidationState>({
  key: 'mkValidationState',
  default: {
    isLogin: undefined,
    data: {},
  },
});

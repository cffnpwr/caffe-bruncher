import { atom } from 'recoil';

export const twValidationState = atom<ValidationState>({
  key: 'twValidationState',
  default: {
    isLogin: false,
    data: {},
  },
});
export const mkValidationState = atom<ValidationState>({
  key: 'mkValidationState',
  default: {
    isLogin: false,
    data: {},
  },
});

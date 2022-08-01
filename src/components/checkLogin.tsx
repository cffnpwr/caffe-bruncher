import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { mkValidationState, twValidationState } from '../stores/login';
import { useMkLoginStatus, useTwLoginStatus } from '../stores/swr';

const CheckLogin = () => {
  const setTwVState = useSetRecoilState(twValidationState);
  const setMkVState = useSetRecoilState(mkValidationState);

  const { data: twData, isValidating: twIsValidating } = useTwLoginStatus();
  const { data: mkData, isValidating: mkIsValidating } = useMkLoginStatus();

  useEffect(() => {
    if (twIsValidating) return;

    setTwVState({
      isLogin: twData ? twData.status === 200 : false,
      data: twData ? twData.data || '' : '',
    });
  }, [twIsValidating, setTwVState, twData]);

  useEffect(() => {
    if (mkIsValidating) return;

    setMkVState({
      isLogin: mkData ? mkData.status === 200 : false,
      data: mkData ? mkData.data || '' : '',
    });
  }, [mkIsValidating, setMkVState, mkData]);

  return <></>;
};

export default CheckLogin;

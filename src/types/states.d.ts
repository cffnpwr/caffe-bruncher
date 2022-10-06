interface IsLoginContextProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

interface IconContextProps {
  iconUrl: string;
  setIconUrl: (iconUrl: string) => void;
}

interface ValidateResult {
  status: number;
  data: any;
}

interface ValidationState {
  isLogin: boolean | undefined;
  data: any;
  instance?: string;
}

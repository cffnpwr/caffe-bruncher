import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { RecoilRoot } from 'recoil';

import createEmotionCache from '@/src/lib/createEmotionCache';

import CaffeBruncherHeader from '../components/header';

import type { AppProps } from 'next/app';

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  palette: {
    primary: {
      main: '#7b5544',
      contrastText: '#f1f1f1',
    },
    secondary: {
      main: '#cc9074',
    },
    text: {
      primary: '#7B5544',
      secondary: '#cc9074',
    },
    background: {
      default: '#e5e5e5',
      paper: '#f1f1f1',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Ubuntu, Noto Sans',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
        },
      },
    },
  },
});

function MyApp(props: MyAppProps) {
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    setShowScreen(true);
  }, []);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return showScreen ? (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <CaffeBruncherHeader />
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    ''
  );
}

export default MyApp;

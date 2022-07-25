import createEmotionCache from '@/lib/createEmotionCache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export const theme = createTheme({
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
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RecoilRoot>
          <Component {...pageProps} />
        </RecoilRoot>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;

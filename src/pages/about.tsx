import { Box, Container, Link, Paper, Typography } from '@mui/material';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRecoilValue } from 'recoil';

import SpecialThanks from '@/src/datas/specialThanks.json';

import locales from '../locale';
import { localeState } from '../stores/locale';


const About = ({ specialThanks }: { specialThanks: SpecialThank[] }) => {
  const locale = useRecoilValue(localeState);
  const localeObj = locales[locale];
  
  return (
    <>
      <Head>
        <title>About | CaffeBruncher</title>
      </Head>
      <Container
        sx={{
          my: 8,
          mx: { xs: 0, md: 'auto' },
          px: { xs: 1, md: 'auto' },
          maxWidth: { xs: 'lg', md: 'md' },
        }}>
        <Paper sx={{
          px: { xs: 2, md: 5 }, 
          py: 2.5,
        }}>
          <Typography
            variant='h2'
            sx={{
              fontWeight: '700',
              pb: { xs: 2, md: 5 },
              fontSize: { xs: '1.7rem', md: '3.75rem' },
            }}
          >
            {localeObj.about.title}
          </Typography>
          <Typography
            variant='h4'
            sx={{
              fontWeight: '500',
              py: 2,
              fontSize: { xs: '1.25rem', md: '2rem' },
            }}
          >
            {localeObj.about.what.title}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              p: 2,
              fontSize: '1rem',
            }}
          >
            {localeObj.about.what.description}
          </Typography>
          <Typography
            variant='h4'
            sx={{
              fontWeight: '500',
              py: 2,
              fontSize: { xs: '1.25rem', md: '2rem' },
            }}
          >
            {localeObj.about.history.title}
          </Typography>
          <Typography
            variant='body1'
            sx={{
              p: 2,
              fontSize: '1rem',
            }}
          >
            {localeObj.about.history.description[0]}<br/>
          ↓<br/>
            {localeObj.about.history.description[1]}
          </Typography>
          <Typography
            variant='h4'
            sx={{
              fontWeight: '500',
              py: 2,
              fontSize: { xs: '1.25rem', md: '2rem' },
            }}
          >
            Special Thanks
          </Typography>
          <Typography
            variant='body1'
            sx={{
              p: 2,
              pb: 0,
              fontSize: '1rem',
            }}
          >
            {localeObj.about.st.debuggers}
          </Typography>
          <ul>
            {specialThanks.map(st => (
              <li key={st.name}>
                <Box 
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '15rem',
                  }}
                >
                  {st.name + ' '}
                  <Box>
                    <Link href={st.twitter} underline='hover' color='secondary'>
                      Twitter
                    </Link>
                    {' / '}
                    <Link href={st.misskey} underline='hover' color='secondary'>
                      Misskey
                    </Link>
                  </Box>
                </Box>
              </li>
            ))}
          </ul>
          <Typography
            variant='h4'
            sx={{
              fontWeight: '500',
              py: 2,
              fontSize: { xs: '1.25rem', md: '2rem' },
            }}
          >
            {localeObj.about.links.title}
          </Typography>
          <ul>
            <li>
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '25rem',
                }}
              >
                {localeObj.about.links.developer}
                <Box>
                  <Link href='https://twitter.com/cffnpwr' underline='hover' color='secondary'>
                      Twitter
                  </Link>
                  {' / '}
                  <Link href='https://submarin.online/@cffnpwr' underline='hover' color='secondary'>
                      Misskey
                  </Link>
                  {' / '}
                  <Link href='https://github.com/cffnpwr' underline='hover' color='secondary'>
                      Github
                  </Link>
                </Box>
              </Box>
            </li>
            <li>
              <Link href='https://github.com/cffnpwr/caffe-bruncher' underline='hover' color='secondary'>
                {localeObj.about.links.repo}
              </Link>
            </li>
          </ul>
          <Typography
            variant='h5'
            sx={{
              fontWeight: '500',
              py: 2,
            }}
          >
            {localeObj.about.others.title}
          </Typography>
          <ul>
            <li>
              {localeObj.about.others.misskey[0]}
              <Link href='https://creativecommons.org/licenses/by-nc-sa/4.0/' underline='hover' color='secondary'>CC BY-NC-SA</Link>
              {localeObj.about.others.misskey[1]}
            </li>
          </ul>
        </Paper>
        <Typography
          variant='body1'
          align='center'
          sx={{
            py: 4,
          }}
        >
          © 2022 CaffeinePower
        </Typography>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      specialThanks: SpecialThanks,
    },
  };
};

export default About;
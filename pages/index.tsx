import Head from 'next/head';
import TwitterLogin from '@/components/twitterLogin';
import MisskeyLogin from '@/components/misskeyLogin';
import * as styles from '@/styles/index';
import PostForm from '@/components/postForm';

const Home = () => {
  return (
    <div css={styles.container}>
      <Head>
        <title>CaffeBruncher</title>
        <meta
          name='description'
          content='CaffeBruncher is tools to post to Twitter and Misskey at the same time.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main css={styles.main}>
        <h1 css={styles.title}>CaffeBruncher</h1>

        <PostForm />

        <div css={styles.login}>
          <TwitterLogin />
          <MisskeyLogin />
        </div>
      </main>
    </div>
  );
};

export default Home;

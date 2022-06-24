import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import nookies from 'nookies';
import TwitterLogin from '../components/twitterLogin';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>CaffeBruncher</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>CaffeBruncher</h1>

        <TwitterLogin />
      </main>
    </div>
  );
};

export default Home;

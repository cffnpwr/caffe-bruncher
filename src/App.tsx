import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <p>This is empty.</p>
        <a
          class={styles.link}
          href='https://github.com/solidjs/solid'
          target='_blank'
          rel='noopener noreferrer'
        >
          Open Github Repository
        </a>
      </header>
    </div>
  );
};

export default App;

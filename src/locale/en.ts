export default {
  language: 'English',
  settings: {
    title: 'Settings',
    accounts: {
      title: 'Accounts',
    },
    language: {
      title: 'Language',
    },
  },
  tooltip: {
    github: 'Github repository',
    settings: 'Settings',
    localOnly: 'Local only',
    visibility: 'Visibility',
    image: 'Attach image',
    poll: 'Poll',
    cw: 'Hide content',
    emoji: 'emojis',
  },
  postForm: {
    textarea: 'What are you doing?',
    cw: 'Comments',
    send: 'Send',
    visibility: {
      public: {
        primary: 'Public',
        secondary: 'Open to all users',
      },
      home: {
        primary: 'Home',
        secondary: 'Post to home timeline only',
      },
      followers: {
        primary: 'Followers',
        secondary: 'Open only to your own followers',
      },
      localOnly: {
        primary: 'Local only',
        secondary: 'Not open to remote users',
      },
    },
  },
  login: {
    twitter: {
      loginWith: 'Login With Twitter',
    },
    misskey: {
      loginWith: 'Login With Misskey',
      instance: 'Instance name',
      egInstance: 'e.g. misskey.io',
    },
  },
  error: {
    api: {
      post: {
        unknown: 'Something happened',
        '400b': 'Incorrect request',
        '500t': 'Failed to send to Twitter and Misskey',
        '500m': 'Failed to send to Misskey',
      },
      misskey: {
        loginStatus: 'Incorrect instance name',
      },
    },
  },
} as Locale;

interface Locale {
  language: string;
  settings: {
    title: string;
    accounts: {
      title: string;
    };
    language: {
      title: string;
    };
    about: {
      title: stirng;
    };
  };
  info: {
    devMsg: string;
  };
  tooltip: {
    github: string;
    settings: string;
    localOnly: string;
    visibility: string;
    image: string;
    poll: string;
    cw: string;
    emoji: string;
  };
  postForm: {
    textarea: string;
    cw: string;
    send: string;
    visibility: {
      public: {
        primary: string;
        secondary: string;
      };
      home: {
        primary: string;
        secondary: string;
      };
      followers: {
        primary: string;
        secondary: string;
      };
      localOnly: {
        primary: string;
        secondary: string;
      };
    };
  };
  login: {
    twitter: {
      loginWith: string;
    };
    misskey: {
      loginWith: string;
      instance: string;
      egInstance: string;
    };
  };
  about: {
    title: string;
    what: {
      title: string;
      description: string;
    };
    history: {
      title: string;
      description: [
        string,
        string,
      ];
    };
    st: {
      debuggers: string;
      translators: string;
    };
    links: {
      title: string;
      developer: string;
      repo: string;
    };
    others: {
      title: string;
      misskey: [
        string,
        string,
      ];
    };
  };
  error: {
    api: {
      post: {
        unknown: string;
        '400b': string;
        '500t': string;
        '500m': string;
      };
      misskey: {
        loginStatus: string;
      };
    };
  };
}

interface Locales {
  [key: string]: Locale;
}

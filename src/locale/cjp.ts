export default {
  language: '日本语',
  settings: {
    title: '设定',
    accounts: {
      title: 'マカウソト',
    },
    language: {
      title: '言语',
    },
    about: {
      title: 'CaffeBruncherについて',
    },
  },
  info: {
    devMsg: 'これは开発版てず',
  },
  tooltip: {
    github: 'Github 刂ポヅ卜刂',
    settings: '设定',
    localOnly: 'ロー力儿ゐみ',
    visibility: '公开范囲',
    image: '画像添付',
    poll: 'マソケー卜',
    cw: '内容を隠ず',
    emoji: '絵文字',
  },
  postForm: {
    textarea: '今どラレてゑ？',
    cw: '注釈',
    send: '送信',
    visibility: {
      public: {
        primary: '八゜ブ刂シケ',
        secondary: 'ずべてゐユーザーに公开',
      },
      home: {
        primary: 'ホーム',
        secondary: 'ホームタ亻ムう亻ソゐみに公开',
      },
      followers: {
        primary: 'フォロワーゐみ',
        secondary: '自分ゐフォロワーゐみに公开',
      },
      localOnly: {
        primary: 'ロー力儿ゐみ',
        secondary: '刂乇ー卜ユーザーには非公开',
      },
    },
  },
  login: {
    twitter: {
      loginWith: 'Twitterて登录',
    },
    misskey: {
      loginWith: 'Misskeyて登录',
      instance: '亻ソヌタソヌ名',
      egInstance: '例: misskey.io',
    },
  },
  about: {
    title: 'CaffeBruncherについて',
    what: {
      title: 'これはなに',
      description: 'CaffeBruncherはTwitterとMisskeyに同时投稿を行なラツー儿てず',
    },
    history: {
      title: '开発経纬',
      description: [
        'TwitterとMisskeyに同时に投稿レだい',
        '作っだっだ',
      ],
    },
    st: {
      debuggers: '人柱ゐ皆様',
      translators: '翻訳者',
    },
    links: {
      title: '刂ソケ',
      developer: '开発者: カふぇいんぱわぁ',
      repo: 'CaffeBruncherゐ刂ポヅ卜刂',
    },
    others: {
      title: 'そゐ他',
      misskey: [
        'Misskeyゐロゴは',
        'ゐう亻乜ソヌに基づいて利用レていまず',
      ],
    },
  },
  error: {
    api: {
      post: {
        unknown: '何カが起こリまレだ',
        '400b': '不正な刂ケ卫ヌ卜てず',
        '500t': 'Twitter/Misskeyへゐ送信に失败レまレだ',
        '500m': 'Misskeyへゐ送信に失败レまレだ',
      },
      misskey: {
        loginStatus: '亻ソヌタソヌ名を正レㄑ入力レてくたちい',
      },
    },
  },
} as Locale;

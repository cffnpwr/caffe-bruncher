export default {
  language: '日本語',
  settings: {
    title: '設定',
    accounts: {
      title: 'アカウント',
    },
    language: {
      title: '言語',
    },
    about: {
      title: 'CaffeBruncherについて',
    },
  },
  tooltip: {
    github: 'Github リポジトリ',
    settings: '設定',
    localOnly: 'ローカルのみ',
    visibility: '公開範囲',
    image: '画像添付',
    poll: 'アンケート',
    cw: '内容を隠す',
    emoji: '絵文字',
  },
  postForm: {
    textarea: '今どうしてる？',
    cw: '注釈',
    send: '送信',
    visibility: {
      public: {
        primary: 'パブリック',
        secondary: 'すべてのユーザーに公開',
      },
      home: {
        primary: 'ホーム',
        secondary: 'ホームタイムラインのみに公開',
      },
      followers: {
        primary: 'フォロワーのみ',
        secondary: '自分のフォロワーのみに公開',
      },
      localOnly: {
        primary: 'ローカルのみ',
        secondary: 'リモートユーザーには非公開',
      },
    },
  },
  login: {
    twitter: {
      loginWith: 'Twitterでログイン',
    },
    misskey: {
      loginWith: 'Misskeyでログイン',
      instance: 'インスタンス名',
      egInstance: '例: misskey.io',
    },
  },
  about: {
    title: 'CaffeBruncherについて',
    what: {
      title: 'これはなに',
      description: 'CaffeBruncherはTwitterとMisskeyに同時投稿を行なうツールです',
    },
    history: {
      title: '開発経緯',
      description: [
        'TwitterとMisskeyに同時に投稿したい',
        '作ったった',
      ],
    },
    st: {
      debuggers: '人柱の皆様',
      translators: '翻訳者',
    },
    links: {
      title: 'リンク',
      developer: '開発者: かふぇいんぱわぁ',
      repo: 'CaffeBruncherのリポジトリ',
    },
    others: {
      title: 'その他',
      misskey: [
        'Misskeyのロゴは',
        'のライセンスに基づいて利用しています',
      ],
    },
  },
  error: {
    api: {
      post: {
        unknown: '何かが起こりました',
        '400b': '不正なリクエストです',
        '500t': 'Twitter/Misskeyへの送信に失敗しました',
        '500m': 'Misskeyへの送信に失敗しました',
      },
      misskey: {
        loginStatus: 'インスタンス名を正しく入力してください',
      },
    },
  },
} as Locale;

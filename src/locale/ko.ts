export default {
  language: '한국어',
  settings: {
    title: '설정',
    accounts: {
      title: '계정',
    },
    language: {
      title: '언어',
    },
    about: {
      title: 'CaffeBruncher에 대하여',
    },
  },
  tooltip: {
    github: 'Github 저장소',
    settings: '설정',
    localOnly: '로컬에만',
    visibility: '공개 범위',
    image: '이미지 첨부',
    poll: '투표',
    cw: '내용 숨기기',
    emoji: '이모지',
  },
  postForm: {
    textarea: '지금 무엇을 하고 있나요?',
    cw: '내용에 대한 주석',
    send: '보내기',
    visibility: {
      public: {
        primary: '공개',
        secondary: '모든 유저에게 공개',
      },
      home: {
        primary: '홈',
        secondary: '홈 타임라인에 공개',
      },
      followers: {
        primary: '팔로워',
        secondary: '팔로워에게만 공개',
      },
      localOnly: {
        primary: '로컬에만',
        secondary: '리모트 유저에게 보이지 않기',
      },
    },
  },
  login: {
    twitter: {
      loginWith: 'Twitter로 로그인',
    },
    misskey: {
      loginWith: 'Misskey로 로그인',
      instance: '인스턴스 이름',
      egInstance: '예시: misskey.io',
    },
  },
  about: {
    title: 'CaffeBruncher에 대하여',
    what: {
      title: '이게 뭐죠?',
      description: 'CaffeBruncher는 게시물을 Twitter와 Misskey에 동시에 올릴 수 있는 도구입니다.',
    },
    history: {
      title: '개발 동기',
      description: [
        '"게시물을 미스키와 트위터에 동시에 올리고 싶어!"',
        '만들었습니다^^',
      ],
    },
    st: {
      debuggers: '디버깅',
    },
    links: {
      title: '관련 링크',
      developer: '개발자: CaffeinePower',
      repo: 'CaffeBruncher Git 리포지터리',
    },
    others: {
      title: '기타',
      misskey: [
        'Misskey 로고는 ',
        ' 라이선스에 따라 사용되었습니다',
      ],
    },
  },
  error: {
    api: {
      post: {
        unknown: '알 수 없는 오류입니다.',
        '400b': '올바르지 않은 요청입니다',
        '500t': 'Twitter/Misskey에 전송하지 못했습니다',
        '500m': 'Misskey에 전송하지 못했습니다',
      },
      misskey: {
        loginStatus: '인스턴스 이름이 올바르지 않습니다',
      },
    },
  },
} as Locale;

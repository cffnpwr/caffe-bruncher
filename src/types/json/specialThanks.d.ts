interface SpecialThank {
  name: string,
  twitter: string,
  misskey: string,
}

declare module 'specialThanks.json'{

  const value: SpecialThank[];
  export = value;
}
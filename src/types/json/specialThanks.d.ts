interface People {
  name: string,
  twitter: string,
  misskey: string,
}
interface SpecialThanks {
  debuggers: People[],
  translators: People[],
}

declare module 'specialThanks.json'{
  const value: SpecialThanks;
  export = value;
}
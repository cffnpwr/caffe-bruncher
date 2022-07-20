export const countGrapheme = (str: string) => {
  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });

  return [...segmenter.segment(str)].length;
};

export const countGraphemeForTwitter = (str: string) => {
  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
  const partition = devideString(str);

  return partition.reduce((count: number, text: string): number => {
    if (new RegExp(/^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/).test(text)) {
      return count + 23;
    } else {
      return (
        count +
        [...segmenter.segment(text)].reduce((countText, segment) => {
          const ranges = [
            [0, 4351],
            [8192, 8205],
            [8208, 8223],
            [8242, 8247],
          ];
          const charCode = segment.segment.charCodeAt(0);

          for (const range of ranges) {
            if (range[0] <= charCode && charCode <= range[1])
              return countText + 1;
          }

          return countText + 2;
        }, 0)
      );
    }
  }, 0);
};

export const devideString = (str: string) =>
  str.split(/(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/);

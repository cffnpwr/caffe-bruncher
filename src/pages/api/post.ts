import { Misskey } from '@/src/lib/misskey';
import { Twitter } from '@/src/lib/twitter';
import { countGrapheme } from '@/src/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = req.body || {};

    const cookies = parseCookies({ req: req });
    const twitter = new Twitter({
      ...{ twitterToken: JSON.stringify(body.twitterToken) },
      ...cookies,
    });
    const misskey = new Misskey(
      { ...{ misskeyToken: JSON.stringify(body.misskeyToken) }, ...cookies },
      body.mkInstance
    );

    const isValid =
      body &&
      body.text &&
      (await twitter.validateToken()) &&
      (await misskey.validateToken()) &&
      countGrapheme(body.text) <= 3000;

    if (!isValid) {
      res.status(400).json({ status: '400b' });

      return;
    }

    //  投稿内容のコピーと整形
    const mkContent: MisskeyPostingContentProps = body;
    const twContent: TwitterPostingContentProps = {
      text: body.text,
    };

    const twIsSent = await twitter.postContent(twContent);
    if (!twIsSent) {
      console.error('twitter sending: ', twIsSent);
      res.status(500).json({ status: '500t' });

      return;
    }

    const mkIsSent = await misskey.postContent(mkContent);
    if (!mkIsSent) {
      console.error('misskey sending: ', mkIsSent);
      res.status(500).json({ status: '500m' });

      return;
    }

    res.status(200).json({});
    return;
  }

  res.status(404).json({});
  return;
};

export default handler;

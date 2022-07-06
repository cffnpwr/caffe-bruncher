import { Misskey } from '@/lib/misskey';
import { Twitter } from '@/lib/twitter';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const content = (body.content as string) || '';

    const cookies = parseCookies({ req: req });
    const twitter = new Twitter(cookies);
    const misskey = new Misskey(cookies);

    const isValid =
      (await twitter.validateToken()) && (await misskey.validateToken());

    if (!isValid) {
      res.status(400).send('');

      return;
    }

    const twIsSent = await twitter.postContent(content);
    const mkIsSent = await misskey.postContent(content);

    if (!twIsSent || !mkIsSent) {
      res.status(500).send('');

      return;
    }

    res.status(200).send('');
  }
};

export default handler;

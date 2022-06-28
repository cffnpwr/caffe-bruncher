import { Misskey } from '@/lib/misskey';
import { Twitter } from '@/lib/twitter';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const content = (body.content as string) || '';

    const twitter = await Twitter.init(req);
    const misskey = await Misskey.init(req, '');

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

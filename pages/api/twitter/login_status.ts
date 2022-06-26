import type { NextApiRequest, NextApiResponse } from 'next';
import { Twitter } from '@/lib/twitter';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const twitter = await Twitter.init(req);
    const isValid = await twitter.validateToken();
    const status = isValid ? 200 : 401;

    res.status(status).send(status);
  } else {
    res.status(400).send('');
  }

  return;
};

export default handler;

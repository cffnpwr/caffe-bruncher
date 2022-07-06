import type { NextApiRequest, NextApiResponse } from 'next';
import { Twitter } from '@/lib/twitter';
import { destroyCookie, parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = parseCookies({ req: req });
    const twitter = new Twitter(cookies);
    if (!twitter.hasToken()) {
      res.status(100).send('');

      return;
    }

    const isValid = await twitter.validateToken();
    const status = isValid.status;

    if (status === 401)
      destroyCookie({ res: res }, 'twitterToken', { path: '/' });

    res.status(status).json({
      status: status,
      data: isValid.data,
    });
  } else {
    res.status(400).send('');
  }

  return;
};

export default handler;

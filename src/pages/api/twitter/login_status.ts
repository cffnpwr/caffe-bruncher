import type { NextApiRequest, NextApiResponse } from 'next';
import { Twitter } from '@/src/lib/twitter';
import { destroyCookie, parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = parseCookies({ req: req });
    const twitter = new Twitter(cookies);

    const isValid = await twitter.validateToken();
    const status = isValid.status;

    if (status === 401)
      destroyCookie({ res: res }, 'twitterToken', { path: '/' });

    res.status(status).json(isValid);
  } else {
    res.status(400).json({});
  }

  return;
};

export default handler;

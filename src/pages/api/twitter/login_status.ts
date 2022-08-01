import type { NextApiRequest, NextApiResponse } from 'next';
import { Twitter } from '@/src/lib/twitter';
import { destroyCookie, parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === 'GET') {
    const cookies = parseCookies({ req: req });
    const twitter = new Twitter(cookies);

    const isValid = await twitter.validateToken();
    const status = isValid.status;

    if (status === 401)
      destroyCookie({ res: res }, 'twitterToken', { path: '/' });

    res.status(status).json(isValid);
    return;
  } else if (method === 'POST') {
    const body = req.body;
    const twitter = new Twitter({ twitterToken: JSON.stringify(body) });

    const isValid = await twitter.validateToken();
    const status = isValid.status;

    res.status(status).json(isValid);
    return;
  }
  res.status(404).json({});

  return;
};

export default handler;

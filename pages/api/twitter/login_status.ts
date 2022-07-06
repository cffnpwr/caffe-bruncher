import type { NextApiRequest, NextApiResponse } from 'next';
import { Twitter } from '@/lib/twitter';
import { parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = parseCookies({ req: req });
    const twitter = new Twitter(cookies);
    const isValid = await twitter.validateToken();
    const status = isValid.status;
    console.log(isValid);

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

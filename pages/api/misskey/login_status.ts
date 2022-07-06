import type { NextApiRequest, NextApiResponse } from 'next';
import { Misskey } from '@/lib/misskey';
import { parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = parseCookies({ req: req });
    const misskey = new Misskey(cookies);
    const isValid = await misskey.validateToken();
    const status = isValid.status ? 200 : 401;

    res.status(status).json({
      status: status,
      data: isValid.data,
      instance: isValid ? misskey.getInstance() : '',
    });
  } else {
    res.status(400).send('');
  }

  return;
};

export default handler;

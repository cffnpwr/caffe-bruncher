import type { NextApiRequest, NextApiResponse } from 'next';
import { Misskey } from '@/lib/misskey';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const misskey = await Misskey.init(req, '');
    const isValid = await misskey.validateToken();
    const status = isValid ? 200 : 401;

    res.status(status).json({
      status: status,
      instance: isValid ? misskey.getInstance() : '',
    });
  } else {
    res.status(400).send('');
  }

  return;
};

export default handler;

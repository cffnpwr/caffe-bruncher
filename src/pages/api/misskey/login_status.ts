import type { NextApiRequest, NextApiResponse } from 'next';
import { Misskey } from '@/src/lib/misskey';
import { parseCookies, destroyCookie } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const cookies = parseCookies({ req: req });
    const misskey = new Misskey(cookies);
    const isValid = await misskey.validateToken();
    const status = isValid.status;

    if (status === 401 || status === 404 || status === 500) {
      destroyCookie({ res: res }, 'misskeyToken', { path: '/' });
      destroyCookie({ res: res }, 'mkInstance', { path: '/' });
    }

    res.status(status).json({
      ...isValid,
      ...{ instance: isValid ? misskey.getInstance() : '' },
    });
  } else {
    res.status(400).send('');
  }

  return;
};

export default handler;

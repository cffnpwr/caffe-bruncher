import type { NextApiRequest, NextApiResponse } from 'next';
import { Misskey } from '@/src/lib/misskey';
import { parseCookies, destroyCookie } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  if (method === 'GET') {
    const cookies = parseCookies({ req: req });
    const misskey = new Misskey(cookies);
    const isValid = await misskey.validateToken();
    const status = isValid.status;

    if (status === 401 || status === 404 || status === 500)
      destroyCookie({ res: res }, 'misskeyToken', { path: '/' });

    res.status(status).json({
      ...isValid,
      ...{ instance: isValid ? misskey.getInstance() : '' },
    });
    return;
  } else if (method === 'POST') {
    const body = req.body;
    const misskey = new Misskey(
      { misskeyToken: JSON.stringify(body) },
      body.mkInstance,
    );
    const isValid = await misskey.validateToken();
    const status = isValid.status;

    res.status(status).json({
      ...isValid,
      ...{ instance: isValid ? misskey.getInstance() : '' },
    });
    return;
  }

  res.status(404).send({});
  return;
};

export default handler;

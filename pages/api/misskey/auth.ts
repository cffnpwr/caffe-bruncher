import { Misskey } from '@/lib/misskey';
import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const cookies = parseCookies({ req: req });
  const reqInstance = (req.query.instance as string) || '';
  const misskey = new Misskey(cookies, reqInstance);

  if (method === 'GET') {
    if (!reqInstance) {
      res.status(400).send('');

      return;
    }

    const authUrl = await misskey.getAuthUrl();
    if (!authUrl) res.status(400).send('');

    setCookie({ res: res }, 'mkInstance', reqInstance, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      path: '/',
    });
    res.status(200).json({
      auth_url: authUrl,
    });
  } else if (method === 'POST') {
    const body = JSON.parse(req.body);
    const token = body['token'] || '';
    if (!token) {
      res.status(400).send('');

      return;
    }

    const tokens = await misskey.getAccessToken(token);
    setCookie({ res: res }, 'misskeyToken', JSON.stringify(tokens), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      path: '/',
    });

    res.status(200).send('');
  } else if (method === 'DELETE') {
    destroyCookie({ res: res }, 'misskeyToken', {
      path: '/',
    });
    destroyCookie({ res: res }, 'mkInstance', {
      path: '/',
    });

    res.status(200).send('');
  }

  return;
};

export default handler;

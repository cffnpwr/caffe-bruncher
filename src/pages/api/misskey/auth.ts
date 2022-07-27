import { Misskey } from '@/src/lib/misskey';
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
    if (!authUrl || !authUrl.secret) {
      res.status(400).send('');

      return;
    }

    setCookie({ res: res }, 'mkInstance', reqInstance, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      path: '/',
    });
    setCookie({ res: res }, 'secret', authUrl.secret, {
      httpOnly: true,
      maxAge: 60 * 30 * 1000,
      sameSite: 'Strict',
      path: '/',
    });

    res.status(200).json({
      auth_url: authUrl.url,
    });
  } else if (method === 'POST') {
    const body = JSON.parse(req.body);
    const token = body['token'] || '';
    if (!token) {
      res.status(400).send('');

      return;
    }
    const secret = cookies['secret'];

    const tokens = await misskey.getAccessToken(secret, token);
    setCookie({ res: res }, 'misskeyToken', JSON.stringify(tokens), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      path: '/',
    });
    destroyCookie({ res: res }, 'secret', {
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

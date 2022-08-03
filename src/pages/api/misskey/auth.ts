import { Misskey } from '@/src/lib/misskey';
import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, parseCookies, setCookie } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const cookies = parseCookies({ req: req });
  const reqInstance =
    (req.query.instance as string) || req.body.mkInstance || '';
  const misskey = new Misskey(cookies, reqInstance);

  if (method === 'GET') {
    const callback = req.query.callback_url as string;
    if (!reqInstance) {
      res.status(400).json({});

      return;
    }

    const authUrl = await misskey.getAuthUrl(callback);
    if (!authUrl || !authUrl.secret) {
      res.status(400).json({});

      return;
    }

    setCookie({ res: res }, 'mkInstance', reqInstance, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    setCookie({ res: res }, 'secret', authUrl.secret, {
      httpOnly: true,
      maxAge: 60 * 30 * 1000,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.status(200).json({
      auth_url: authUrl.url,
      secret: authUrl.secret,
    });
    return;
  } else if (method === 'POST') {
    const body = req.body || {};
    const secret = cookies['secret'] || body.secret;
    const token = body.token;
    destroyCookie({ res: res }, 'secret', {
      path: '/',
    });

    if (!secret || !token) {
      res.status(400).json({});

      return;
    }

    const tokens = await misskey.getAccessToken(secret, token);
    if (!tokens || !tokens.accessToken || !tokens.accountId) {
      res.status(400).json({});

      return;
    }

    setCookie({ res: res }, 'misskeyToken', JSON.stringify(tokens), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.status(200).json({});
    return;
  } else if (method === 'DELETE') {
    destroyCookie({ res: res }, 'misskeyToken', {
      path: '/',
    });
    destroyCookie({ res: res }, 'mkInstance', {
      path: '/',
    });

    res.status(200).json({});
    return;
  }

  res.status(404).json({});
  return;
};

export default handler;

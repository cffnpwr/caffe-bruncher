import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, setCookie } from 'nookies';
import { Twitter } from '@/lib/twitter';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const twitter = await Twitter.init(req);

  if (method === 'GET') {
    const oauthToken = await twitter.getOAuthToken();

    res.status(200).json({
      oauth_token: oauthToken,
    });
  } else if (method === 'POST') {
    const body = JSON.parse(req.body);
    const oauthToken = body['oauth_token'] || '';
    const oauthVerifier = body['oauth_verifier'] || '';
    if (!oauthToken || !oauthVerifier) {
      res.status(400).send('');

      return;
    }

    const tokens = await twitter.getAccessToken(oauthToken, oauthVerifier);
    setCookie({ res: res }, 'twitterToken', JSON.stringify(tokens), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      path: '/',
    });

    res.status(200).send('');
  } else if (method === 'DELETE') {
    destroyCookie({ res: res }, 'twitterToken', {
      path: '/',
    });

    res.status(200).send('');
  }

  return;
};

export default handler;

import { destroyCookie, parseCookies, setCookie } from 'nookies';

import { Twitter } from '@/src/lib/twitter';

import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method;
  const cookies = parseCookies({ req: req });
  const twitter = new Twitter(cookies);

  if (method === 'GET') {
    const pinBase = req.query.pinBase;
    const oauthToken = await twitter.getOAuthToken(Boolean(pinBase));

    res.status(200).json({
      oauth_token: oauthToken,
    });
    return;
  } else if (method === 'POST') {
    const body = req.body || {};
    const oauthToken = body['oauth_token'] || '';
    const oauthVerifier = body['oauth_verifier'] || '';
    if (!oauthToken || !oauthVerifier) {
      res.status(400).json({});

      return;
    }

    const tokens = await twitter.getAccessToken(oauthToken, oauthVerifier);
    if (!tokens.accessSecret || !tokens.accessToken || !tokens.accountId) {
      res.status(400).json({});

      return;
    }

    setCookie({ res: res }, 'twitterToken', JSON.stringify(tokens), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    res.status(200).json(tokens);
    return;
  } else if (method === 'DELETE') {
    destroyCookie({ res: res }, 'twitterToken', {
      path: '/',
    });

    res.status(200).json({});
    return;
  }

  res.status(404).json({});
  return;
};

export default handler;

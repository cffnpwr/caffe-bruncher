import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { Twitter } from '@/src/lib/twitter';

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
      res.status(400).send({});

      return;
    }

    const tokens = await twitter.getAccessToken(oauthToken, oauthVerifier);
    if (!tokens.accessSecret || !tokens.accessToken || !tokens.accountId) {
      res.status(400).send({});

      return;
    }

    setCookie({ res: res }, 'twitterToken', JSON.stringify(tokens), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30 * 6 * 1000,
      sameSite: 'Strict',
      path: '/',
    });

    res.status(200).send(tokens);
    return;
  } else if (method === 'DELETE') {
    destroyCookie({ res: res }, 'twitterToken', {
      path: '/',
    });

    res.status(200).send({});
    return;
  }

  res.status(404).send({});
  return;
};

export default handler;

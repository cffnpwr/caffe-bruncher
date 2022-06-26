import OAuth from 'oauth-1.0a';
import crypto from 'node:crypto';
import { parseCookies } from 'nookies';
import { NextApiRequest } from 'next';

export class Twitter {
  //  consumer keys
  private ck = process.env.CK || '';
  private cs = process.env.CS || '';
  private callbackUrl = process.env.TW_OAUTH_CALLBACK || '';
  //  accesstoken
  private token: TwitterAccessToken | undefined;
  //  context
  private ctx: NextApiRequest;

  constructor(ctx: NextApiRequest) {
    //  set context
    this.ctx = ctx;
  }

  public static async init(ctx: NextApiRequest): Promise<Twitter> {
    const twitter = new Twitter(ctx);

    //  get access token
    twitter.token = await twitter.getToken(ctx);

    return twitter;
  }

  private async getToken(
    ctx: NextApiRequest
  ): Promise<TwitterAccessToken | undefined> {
    const cookies = parseCookies({ req: ctx });
    const tokens = JSON.parse(cookies['twitterToken'] || '{}');

    if (!tokens.accessToken || !tokens.accessSecret || !tokens.accountId)
      return undefined;

    this.token = tokens;
    const isValid = await this.validateToken();
    if (!isValid) return undefined;

    return {
      accountId: tokens.accountId,
      accessToken: tokens.accessToken,
      accessSecret: tokens.accessSecret,
    };
  }

  /**
   * getOAuthToken
   */
  public async getOAuthToken() {
    const target = 'https://api.twitter.com/oauth/request_token';
    const oauthHeader = this.getOAuthHeader(target, 'POST');

    const res = await fetch(target, {
      method: 'POST',
      headers: oauthHeader,
      body: JSON.stringify({
        oauth_callback: this.callbackUrl,
      }),
    });
    const oauthToken = await res.text();

    return oauthToken;
  }

  /**
   * getAccessToken
   */
  public async getAccessToken(oauthToken: string, oauthVerifier: string) {
    const target = `https://api.twitter.com/oauth/access_token?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`;
    const res = await fetch(target, {
      method: 'POST',
    });
    const resTokens = await res.text();

    const tokens = {
      accessToken: '',
      accessSecret: '',
      accountId: '',
    };
    for (const items of resTokens.split('&')) {
      const item = items.split('=');
      switch (item[0]) {
        case 'oauth_token':
          tokens.accessToken = item[1];
          break;

        case 'oauth_token_secret':
          tokens.accessSecret = item[1];
          break;

        case 'user_id':
          tokens.accountId = item[1];
          break;

        default:
          break;
      }
    }

    this.ctx.cookies;

    return tokens;
  }

  /**
   * validateToken
   */
  public async validateToken() {
    if (
      !this.token ||
      !this.token.accessSecret ||
      !this.token.accessToken ||
      !this.token.accountId
    )
      return false;

    const target = 'https://api.twitter.com/2/users/me';
    const oauthHeader = this.getOAuthHeader(target, 'GET');

    const res = await fetch(target, {
      method: 'GET',
      headers: oauthHeader,
    });
    if (res.status !== 200) return false;

    const accountId = (await res.json()).data.id;
    if (accountId !== this.token.accountId) return false;

    return true;
  }

  private getOAuthHeader(url: string, method: string) {
    const oauth = new OAuth({
      consumer: {
        key: this.ck,
        secret: this.cs,
      },
      signature_method: 'HMACSHA1',
      hash_function: (base, key) => {
        return crypto.createHmac('SHA1', key).update(base).digest('base64');
      },
    });

    const signature = this.token
      ? oauth.authorize(
          { url: url, method: method },
          { key: this.token.accessToken, secret: this.token.accessSecret }
        )
      : oauth.authorize({ url: url, method: method });
    const header: { Authorization: string } = oauth.toHeader(signature);

    return header;
  }
}

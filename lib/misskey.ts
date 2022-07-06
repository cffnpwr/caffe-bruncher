import { NextApiRequest } from 'next';
import { parseCookies } from 'nookies';

export class Misskey {
  //  app secret
  private appSecret: string = process.env.APP_SECRET || '';
  private callbackUrl: string = process.env.MK_CALLBACK || '';

  //  accces token
  private token: MisskeyAccessToken | undefined;

  //  instance
  private instance: string;

  //  cookies
  private cookies: { [key: string]: string };

  constructor(cookies: { [key: string]: string }, instance?: string) {
    //  set cookie
    this.cookies = cookies;
    //  set token
    this.token = this.getToken();
    //  set instance
    this.instance = instance || cookies['mkInstance'] || '';
  }

  private getToken(): MisskeyAccessToken | undefined {
    const tokens = JSON.parse(this.cookies['misskeyToken'] || '{}');

    if (!tokens.accessToken || !tokens.accountId) return undefined;

    return tokens;
  }

  /**
   * getInstance
   */
  public getInstance() {
    return this.instance;
  }

  /**
   * getAuthUrl
   */
  public async getAuthUrl() {
    const target = `https://${this.instance}/api/auth/session/generate`;

    const res = await fetch(target, {
      method: 'POST',
      body: JSON.stringify({
        appSecret: this.appSecret,
      }),
    });
    if (res.status !== 200) return '';
    const url: string = (await res.json())['url'] || '';

    return url;
  }

  /**
   * getAccessToken
   */
  public async getAccessToken(token: string) {
    if (!this.instance) return '';

    const target = `https://${this.instance}/api/auth/session/userkey`;
    const res = await fetch(target, {
      method: 'POST',
      body: JSON.stringify({
        appSecret: this.appSecret,
        token: token,
      }),
    });
    const resToken = await res.json();

    return {
      accountId: resToken.user.id || '',
      accessToken: resToken.accessToken || '',
    };
  }

  /**
   * validateToken
   */
  public async validateToken() {
    const result: ValidateResult = {
      status: 400,
      data: {},
    };

    if (
      !this.instance ||
      !this.token ||
      !this.token.accountId ||
      !this.token.accessToken
    )
      return result;

    const target = `https://${this.instance}/api/i`;
    const reqBody = {
      i: this.token.accessToken,
    };

    const res = await fetch(target, {
      method: 'POST',
      body: JSON.stringify(reqBody),
    });
    const data = await res.json();
    if (res.status !== 200) {
      result.status = res.status;
      result.data = data;

      return result;
    }

    const accountId = data.id;
    if (accountId !== this.token.accountId) return result;

    result.status = 200;
    result.data = data;
    return result;
  }

  /**
   * postContent
   */
  public async postContent(content: string) {
    if (
      !content ||
      !this.instance ||
      !this.token ||
      !this.token.accountId ||
      !this.token.accessToken
    )
      return false;

    const target = `https://${this.instance}/api/notes/create`;

    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        i: this.token.accessToken,
        text: content,
      }),
    });
    if (res.status !== 200) return false;

    return true;
  }
}

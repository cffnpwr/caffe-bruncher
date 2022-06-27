import { NextApiRequest } from 'next';
import { parseCookies } from 'nookies';

export class Misskey {
  //  app secret
  private appSecret: string = process.env.APP_SECRET || '';
  private callbackUrl: string = process.env.MK_CALLBACK || '';

  //  accces token
  private token: MisskeyAccessToken | undefined;

  //  context
  private ctx: NextApiRequest;

  //  instance
  private instance: string;

  constructor(ctx: NextApiRequest, instance: string) {
    //  set context
    this.ctx = ctx;

    //  set instance
    this.instance = instance;
  }

  public static async init(
    ctx: NextApiRequest,
    instance: string
  ): Promise<Misskey> {
    const mkInstance =
      instance || parseCookies({ req: ctx })['mkInstance'] || '';
    const misskey = new Misskey(ctx, mkInstance);

    //  set access token
    misskey.token = await misskey.getToken();

    return misskey;
  }

  /**
   * getInstance
   */
  public getInstance() {
    return this.instance;
  }

  private async getToken(): Promise<MisskeyAccessToken | undefined> {
    const cookies = parseCookies({ req: this.ctx }, { path: '/' });
    const tokens = JSON.parse(cookies['misskeyToken'] || '{}');

    if (!tokens.accessToken || !tokens.accountId) return undefined;

    this.token = tokens;
    const isValid = await this.validateToken();
    if (!isValid) return undefined;

    return this.token;
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
    if (
      !this.instance ||
      !this.token ||
      !this.token.accountId ||
      !this.token.accessToken
    )
      return false;

    const target = `https://${this.instance}/api/i`;
    const reqBody = {
      i: this.token.accessToken,
    };

    const res = await fetch(target, {
      method: 'POST',
      body: JSON.stringify(reqBody),
    });
    if (res.status !== 200) return false;

    const accountId = (await res.json()).id;
    if (accountId !== this.token.accountId) return false;

    return true;
  }
}

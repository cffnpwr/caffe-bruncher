export class Misskey {
  //  app secret
  private appSecret: string = '';
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
    try {
      const tokens = JSON.parse(this.cookies['misskeyToken'] || '{}');

      if (!tokens.accessToken || !tokens.accountId) return undefined;

      return tokens;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * getInstance
   */
  public getInstance() {
    return this.instance;
  }

  /**
   * hasToken
   */
  public hasToken(): boolean {
    return this.token ? true : false;
  }

  /**
   * getAuthUrl
   */
  public async getAuthUrl(callback?: string | null) {
    //  instance check
    const isInstanceAvailable = await fetch(
      `https://${this.instance}/api/ping`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: '{}',
      }
    )
      .then((res) => res.json())
      .then((data) => (data.pong > 0 ? true : false))
      .catch(() => false);

    if (!isInstanceAvailable) return {};
    //  create app
    this.appSecret = (
      await (
        await fetch(`https://${this.instance}/api/app/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            name: 'CaffeBruncher',
            description:
              'Tools to post to Twitter and Misskey at the same time.',
            permission: ['write:notes', 'write:drive'],
            callbackUrl:
              callback || (callback === null ? null : this.callbackUrl),
          }),
        })
      ).json()
    ).secret;

    //  get auth url
    const target = `https://${this.instance}/api/auth/session/generate`;
    try {
      const res = await fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          appSecret: this.appSecret,
        }),
      });
      if (res.status !== 200) return '';
      const url: string = (await res.json())['url'] || '';

      return {
        secret: this.appSecret,
        url: url,
      };
    } catch (error) {
      return {};
    }
  }

  /**
   * getAccessToken
   */
  public async getAccessToken(secret: string, token: string) {
    const result = {
      accountId: '',
      accessToken: '',
    };

    if (!this.instance) return result;

    const target = `https://${this.instance}/api/auth/session/userkey`;
    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        appSecret: secret,
        token: token,
      }),
    });
    if (res.status !== 200) return result;

    const resToken = await res.json();
    result.accessToken = resToken.accessToken;
    result.accountId = resToken.user.id;

    return result;
  }

  /**
   * validateToken
   */
  public async validateToken() {
    const result: ValidateResult = {
      status: 401,
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
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(reqBody),
    });
    let data;
    try {
      data = await res.json();
    } catch (error) {}

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
  public async postContent(content: MisskeyPostingContentProps) {
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
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        i: this.token.accessToken,
        ...content,
      }),
    });
    if (res.status !== 200) {
      console.log(content);
      console.error('error status: ', res.status);
      console.error('error msg: ', await res.json());

      return false;
    }

    return true;
  }
}

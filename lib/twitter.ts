import OAuth from 'oauth-1.0a';
import crypto from 'node:crypto';
import { countGraphemeForTwitter, devideString } from './utils';
import { toArray } from 'stringz';

export class Twitter {
  //  consumer keys
  private ck = process.env.CK || '';
  private cs = process.env.CS || '';
  private callbackUrl = process.env.TW_OAUTH_CALLBACK || '';
  //  accesstoken
  private token: TwitterAccessToken | undefined;
  //  cookies
  private cookies: { [key: string]: string };

  constructor(cookies: { [key: string]: string }) {
    //  set cookie
    this.cookies = cookies;
    //  set token
    this.token = this.getToken();
  }

  private getToken(): TwitterAccessToken | undefined {
    try {
      const tokens = JSON.parse(this.cookies['twitterToken'] || '{}');

      if (!tokens.accessToken || !tokens.accessSecret || !tokens.accountId)
        return undefined;

      return tokens;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * hasToken
   */
  public hasToken(): boolean {
    return this.token ? true : false;
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

    return tokens;
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
      !this.token ||
      !this.token.accessSecret ||
      !this.token.accessToken ||
      !this.token.accountId
    )
      return result;

    const target =
      'https://api.twitter.com/2/users/me?user.fields=profile_image_url';
    const oauthHeader = this.getOAuthHeader(target, 'GET');

    const res = await fetch(target, {
      method: 'GET',
      headers: oauthHeader,
    });
    const data = (await res.json()).data;
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
  public async postContent(content: TwitterPostingContentProps) {
    if (!content) return false;

    const target = 'https://api.twitter.com/2/tweets';
    const oauthHeader = this.getOAuthHeader(target, 'POST');

    let postingText = content.text;
    let textLenght = 0;
    //  ??????????????????????????????????????????
    let prevTweetId = '';
    do {
      let textPartition = '';
      //  URL?????????????????????????????????
      const urlPartition = devideString(postingText).filter(Boolean);

      //  ?????????280?????????????????????
      do {
        if (
          //  URL???
          new RegExp(/^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/).test(
            urlPartition[0]
          )
        ) {
          if (countGraphemeForTwitter(textPartition + urlPartition[0]) < 280)
            //  ?????????280?????????????????????
            textPartition += urlPartition.shift();
          //  ?????????????????????
          else break;
        } else {
          //  URL????????????
          //  1??????????????????
          const segments = toArray(urlPartition[0]);
          if (countGraphemeForTwitter(textPartition + segments[0]) < 280)
            //  ?????????280?????????????????????
            textPartition += segments.shift();
          //  ?????????????????????
          else break;

          //  ??????????????????
          urlPartition[0] = segments.join('');
          //  ????????????0??????????????????????????????
          if (segments.length === 0) urlPartition.shift();
        }
      } while (urlPartition.length > 0);

      //  ???????????????????????????
      postingText = urlPartition.join('');
      //  ?????????????????????????????????
      const body: TwitterPostingBody = {
        text: textPartition,
      };
      if (prevTweetId)
        body.reply = {
          in_reply_to_tweet_id: prevTweetId,
        };

      const res = await fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: oauthHeader.Authorization,
        },
        body: JSON.stringify(body),
      });
      if (res.status !== 201) {
        console.log(body);
        console.error('error status: ', res.status);

        return false;
      }
      prevTweetId = (await res.json()).data.id;

      //  ???????????????????????????
      textLenght = countGraphemeForTwitter(postingText);
    } while (textLenght > 0);

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

import { Blob, Buffer } from 'node:buffer';
import crypto from 'node:crypto';

import OAuth from 'oauth-1.0a';
import { toArray } from 'stringz';
import { FormData, fetch } from 'undici';

import { countGraphemeForTwitter, devideString } from './utils';


export class Twitter {
  //  consumer keys
  private ck = process.env.CK || '';
  private cs = process.env.CS || '';
  private callbackUrl = process.env.TW_OAUTH_CALLBACK || '';
  //  accesstoken
  private token: TwitterAccessToken | undefined;
  //  cookies
  private cookies: { [key: string]: string; };

  constructor(cookies: { [key: string]: string; }) {
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
  public async getOAuthToken(pinBase?: boolean) {
    const target = `https://api.twitter.com/oauth/request_token?oauth_callback=${encodeURIComponent(
      pinBase ? 'oob' : this.callbackUrl,
    )}`;
    const oauthHeader = this.getOAuthHeader(target, 'POST');

    const res = await fetch(target, {
      method: 'POST',
      headers: oauthHeader,
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
    const data = (await res.json() as any).data;
    if (res.status !== 200) {
      result.status = res.status;
      result.data = data;

      return result;
    }

    const accountId = data.id;
    if (accountId !== this.token.accountId) return result;

    result.status = 200;
    result.data = data;

    //  プロフィール画像の解像度をオリジナルにするためにゴニョゴニョする
    result.data.profile_image_url = (
      result.data.profile_image_url as string
    ).replace(/_normal/, '');

    return result;
  }

  /**
   * uploadMedia
   */
  public async uploadMediaInit(fileSize: number, mimeType: string) {
    if (!fileSize || !mimeType) return '';

    const target = `https://upload.twitter.com/1.1/media/upload.json?command=INIT&media_type=${encodeURIComponent(
      mimeType,
    )}&total_bytes=${encodeURIComponent(fileSize)}`;
    const oauthHeader = this.getOAuthHeader(target, 'POST');

    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: oauthHeader.Authorization,
      },
    });
    if (res.status !== 202) {
      console.log('init');
      console.error('error status: ', res.status);
      console.error('error msg: ', await res.json());

      return '';
    }
    const mediaId = (await res.json() as any).media_id_string as string;

    return mediaId;
  }

  /**
   * uploadMediaAppend
   */
  public async uploadMediaAppend(mediaId: string, file: Buffer) {
    if (!mediaId || !file) return false;

    const target = `https://upload.twitter.com/1.1/media/upload.json?command=APPEND&media_id=${encodeURIComponent(
      mediaId,
    )}&segment_index=0`;
    const oauthHeader = this.getOAuthHeader(target, 'POST');
    const body = new FormData();
    body.append('media', new Blob([file]));

    const res = await fetch(target, {
      method: 'POST',
      headers: {
        Authorization: oauthHeader.Authorization,
      },
      body: body as unknown as URLSearchParams,
    });
    if (res.status !== 204) {
      console.log('append');
      console.error('error status: ', res.status);
      console.error('error msg: ', await res.json());

      return false;
    }

    return true;
  }

  /**
   * uploadMediaFinalize
   */
  public async uploadMediaFinalize(mediaId: string) {
    if (!mediaId) return false;

    const target = `https://upload.twitter.com/1.1/media/upload.json?command=FINALIZE&media_id=${encodeURIComponent(
      mediaId,
    )}`;
    const oauthHeader = this.getOAuthHeader(target, 'POST');

    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: oauthHeader.Authorization,
      },
    });
    if (res.status !== 201) {
      console.log('finalize');
      console.error('error status: ', res.status);
      console.error('error msg: ', await res.json());

      return false;
    }

    return true;
  }

  /**
   * postContent
   */
  public async postContent(content: TwitterPostingContentProps) {
    if (!content) return false;

    const target = 'https://api.twitter.com/2/tweets';
    const oauthHeader = this.getOAuthHeader(target, 'POST');

    //  文章
    let postingText = content.text;
    //  Media IDs
    const mediaIds = content.mediaIds || [];
    let textLenght = 0;
    //  長文連結時での前回のツイート
    let prevTweetId = '';
    do {
      let textPartition = '';
      //  URL部とそれ以外全部に分割
      const urlPartition = devideString(postingText).filter(Boolean);

      //  前から280文字を切り出し
      while (urlPartition.length > 0) {
        if (
          //  URL部
          new RegExp(/^https?:\/\/[\w/:%#$&?()~.=+-]+$/).test(
            urlPartition[0],
          )
        ) {
          if (countGraphemeForTwitter(textPartition + urlPartition[0]) < 280)
            //  足して280文字を超えない
            textPartition += urlPartition.shift();
          //  超えるなら脱出
          else break;
        } else {
          //  URL以外全部
          //  1文字ずつ分割
          const segments = toArray(urlPartition[0]);
          if (countGraphemeForTwitter(textPartition + segments[0]) < 280)
            //  足して280文字を超えない
            textPartition += segments.shift();
          //  超えるなら脱出
          else break;

          //  文字を全結合
          urlPartition[0] = segments.join('');
          //  文字数が0なら分割の先頭を消す
          if (segments.length === 0) urlPartition.shift();
        }
      }

      //  残りの文字列を決定
      postingText = urlPartition.join('');
      //  切り出した文字列を送信
      const body: TwitterPostingBody = {
        text: textPartition,
      };
      if (prevTweetId)
        body.reply = {
          in_reply_to_tweet_id: prevTweetId,
        };
      if (mediaIds.length > 0)
        body.media = {
          media_ids: mediaIds.splice(0, 4),
        };


      const res = await fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Accept-Encoding': 'br',
          Authorization: oauthHeader.Authorization,
        },
        body: JSON.stringify(body),
      });
      if (res.status !== 201) {
        console.log(body);
        console.error('error status: ', res.status);
        console.error('error msg: ', await res.json());

        return false;
      }
      prevTweetId = (await res.json() as any).data.id;

      //  残った文字列の長さ
      textLenght = countGraphemeForTwitter(postingText);
    } while (textLenght > 0 || mediaIds.length > 0);

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
        { key: this.token.accessToken, secret: this.token.accessSecret },
      )
      : oauth.authorize({ url: url, method: method });
    const header: { Authorization: string; } = oauth.toHeader(signature);

    return header;
  }
}

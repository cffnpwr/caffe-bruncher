import { Misskey } from '@/lib/misskey';
import { Twitter } from '@/lib/twitter';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body) as MisskeyPostingContentProps;

    const cookies = parseCookies({ req: req });
    const twitter = new Twitter(cookies);
    const misskey = new Misskey(cookies);

    const isValid =
      (await twitter.validateToken()) && (await misskey.validateToken());

    if (!isValid || !body) {
      res.status(400).send('');

      return;
    }
    console.log(body);

    //  投稿内容のコピーと整形
    const mkContent: MisskeyPostingContentProps = body;
    const twContent: TwitterPostingContentProps = {
      text: body.text,
    };

    const twIsSent = await twitter.postContent(twContent);
    const mkIsSent = await misskey.postContent(mkContent);

    if (!twIsSent || !mkIsSent) {
      console.error('twitter sending: ', twIsSent);
      console.error('misskey sending: ', mkIsSent);
      res.status(500).send('');

      return;
    }

    res.status(200).send('');
  }
};

export default handler;

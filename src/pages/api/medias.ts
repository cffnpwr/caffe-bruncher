import fs from 'node:fs';

import { formidable, File as FFile } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

import { Misskey } from '@/src/lib/misskey';
import { Twitter } from '@/src/lib/twitter';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
      res.status(400).json({});
      return;
    }
    res.status(400);

    const form = formidable({
      maxFiles: 16,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({});

        return;
      }
      const cookies = parseCookies({ req: req });
      const info = JSON.parse(fields.info ? fields.info as string : '{}');
      const body = JSON.parse(fields.body ? fields.body as string : '{}');
      const twitter = new Twitter({
        ...{ twitterToken: JSON.stringify(body.twitterToken) },
        ...cookies,
      });
      const misskey = new Misskey(
        { ...{ misskeyToken: JSON.stringify(body.misskeyToken) }, ...cookies },
        body.mkInstance,
      );
      const twMediaIds: string[] = [];
      const mkFileIds: string[] = [];

      try {
        for (const key in files) {
          const file: FFile = files[key] as FFile;
          const mimeType = file.mimetype || '';
          const fileSize = file.size;
          const fileBuffer = fs.readFileSync(file.filepath);

          const option = { comment: info[Number(key)].caption, isSensitive: info[Number(key)].isSensitive };

          const mediaId: string = await twitter.uploadMediaInit(
            fileSize,
            mimeType,
          );

          const fileId = await misskey.uploadMedia(fileBuffer, option);

          if (fileId) mkFileIds.push(fileId);

          if (
            mediaId &&
            (await twitter.uploadMediaAppend(mediaId, fileBuffer)) &&
            (await twitter.uploadMediaFinalize(mediaId))
          ) {
            twMediaIds.push(mediaId);
          }
        }
      } catch (error) {
        console.error(error);

        res.status(500).json({});
        return;
      }

      // console.log(fields);
      // console.log(files);

      res.status(201).json({
        twMediaIds: twMediaIds,
        mkFileIds: mkFileIds,
      });
    });

    // const bb = busboy({ headers: req.headers });
    // let twitter: Twitter;
    // let misskey: Misskey;
    // let fileCount: number = 9999;
    // const twMediaIds: string[] = [];

    // res.status(500);

    // bb.on('field', (name, value, info) => {
    //   const body = JSON.parse(value);
    //   fileCount = body.length;
    //   twitter = new Twitter({
    //     ...{ twitterToken: JSON.stringify(body.twitterToken) },
    //     ...cookies,
    //   });
    //   misskey = new Misskey(
    //     { ...{ misskeyToken: JSON.stringify(body.misskeyToken) }, ...cookies },
    //     body.mkInstance
    //   );

    //   console.log(fileCount);
    // })
    //   .on('file', (name, stream, info) => {
    //     const { mimeType } = info;
    //     let file: Buffer = Buffer.alloc(0);
    //     stream
    //       .on('data', (chunk) => {
    //         file = Buffer.concat([file, Buffer.from(chunk)]);
    //       })
    //       .once('end', async () => {
    //         console.log(Boolean(twitter), fileCount, file);

    //         if (!twitter) return;
    //         const mediaId: string = await twitter.uploadMediaInit(
    //           file.byteLength,
    //           mimeType
    //         );

    //         if (
    //           mediaId &&
    //           (await twitter.uploadMediaAppend(mediaId, file)) &&
    //           (await twitter.uploadMediaFinalize(mediaId))
    //         ) {
    //           twMediaIds.push(mediaId);
    //         }
    //         fileCount--;

    //         // console.log('onceend', fileCount, twMediaIds);
    //         return;
    //       });
    //   })
    //   .once('close', () => {});
    // req.pipe(bb);

    // res.status(201).json({
    //   mediaId: twMediaIds,
    // });

    return;
  }
};
export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};

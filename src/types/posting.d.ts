interface PostingContentProps {
  text: string;
  visibility?: 'public' | 'home' | 'followers';
  cw?: string;
  localOnly?: boolean;
  fileIds?: {
    twMediaIds: string[],
    mkFileIds: string[];
  };
  poll?: {
    choices: string[];
    multiple?: boolean;
    expiresAt?: number;
    expiredAfter?: number;
  };
}

interface MisskeyPostingContentProps {
  text: string;
  visibility?: 'public' | 'home' | 'followers';
  cw?: string;
  localOnly?: boolean;
  fileIds?: string[];
  poll?: {
    choices: string[];
    multiple?: boolean;
    expiresAt?: number;
    expiredAfter?: number;
  };
}

interface TwitterPostingContentProps {
  text: string;
  mediaIds?: string[];
  poll?: {
    choices: string[];
    durationMin: number;
  };
}
interface TwitterPostingBody {
  text: string;
  reply?: {
    in_reply_to_tweet_id: string;
  };
  media?: {
    media_ids: string[];
  };
}

interface PostingFileProps {
  file: File;
  URL: string;
  caption?: string;
  isSensitive?: boolean;
}

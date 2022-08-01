# CaffeBruncher

![license](https://img.shields.io/github/license/cffnpwr/caffe-bruncher)
[![development deploy](https://github.com/cffnpwr/caffe-bruncher/actions/workflows/devDeploy.yml/badge.svg?branch=development)](https://github.com/cffnpwr/caffe-bruncher/actions/workflows/devDeploy.yml)

CaffeBruncherはTwitterとMisskeyに同時投稿を行なうツールです

Tools to post to Twitter and Misskey at the same time.

***ここは開発用ブランチです***

***This is a development branch.***

## 必要要件

 - [Node.js](https://nodejs.org) v18.3.0
 - [Yarn](https://yarnpkg.com/)

## 環境構築

以下のコマンドを実行します

```sh
git clone https://github.com/cffnpwr/caffe-bruncher-frontend.git
cd caffe-bruncher-frontend
yarn install
```

## 使い方

### 開発用サーバーの起動

`.env.development`もしくは`.env.development.local`を作成し、以下の内容を記述します

```
CK=[your consumer key for twitter API]
CS=[your consumer secret for twitter API]
TW_OAUTH_CALLBACK=http://localhost:3000/twitter_callback
MK_CALLBACK=http://localhost:3000/misskey_callback
```

以下のコマンドを実行します

```sh
yarn dev
```

### ビルド

`.env.production`もしくは`.env.production.local`を作成し、以下の内容を記述します

```
CK=[your consumer key for twitter API]
CS=[your consumer secret for twitter API]
TW_OAUTH_CALLBACK=[your server's URL]/twitter_callback # e.g. https://hogehoge.com/twitter_callback
MK_CALLBACK=[your server's URL]/misskey_callback       # e.g. https://hogehoge.com/misskey_callback
```

以下のコマンドを実行します

```sh
yarn build
```

## その他

正式リリースは`master`ブランチで行なわれています

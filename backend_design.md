# Dezamii(仮) backend 技術選定メモ

- AWS で可能な構成を調べる
- DB 設計
  - RDB のリレーション設計
  - チャットルーム用、ユーザーデータ用

## 参考文献

- [チャットなどリアルタイム更新が必要なスマフォアプリの構成について考えてみた - Qiita](https://qiita.com/mono0926/items/bb7fdd912bc338096f57)

- [LINE LIVE チャット機能を支えるアーキテクチャ](https://engineering.linecorp.com/ja/blog/the-architecture-behind-chatting-on-line-live/)

## サーバーサイドフレームワークの選定

### 1.Node.js

- サーバーサイド Javascript
- ノンプロッキング I/O とイベントループによる大量の同時処理に対応
- 基本シングルスレッドで非同期処理、マルチスレッドも可

#### 不明点

AWS を用いた

### 2. Apache/Nginx

## WebSocket API

> WebSocket API は、ユーザーのブラウザーとサーバー間で対話的な通信セッションを開くことができる先進技術です。この API によって、サーバーにメッセージを送信したり、応答をサーバーにポーリングすることなく、イベント駆動型のレスポンスを受信したりすることができます。

多分 websocketAPI でチャットの通信を実装することになると思う

- プロトコル
  - (https://www.otsuka-shokai.co.jp/words/protocol.html)

### 注意点

> モバイル端末との接続ということもあり、長時間張り続けたコネクションが不安定になるケースが目立つということです。これを回避するため、ペイロードの送信状態を監視し、コネクションが不安定だと判断できる場合は一度コネクションを切断して再接続を促すなどの対応が取られています。

### 参考文献

- [WebSocket のキホン](https://www.slideshare.net/You_Kinjoh/websocket-10621887)

- [SocketRocket(iOS アプリケーション向けライブラリ)](https://github.com/facebookincubator/SocketRocket)

### 3. サーバーサイド構成案

1. Node.js

- TypeScript with Node.js and Express
- Next.js を用いた SSR(べつに SSR でなくてもよい)と Routing

2. Laravel

-

## サーバーの構成

### AWS lambda

- イベントドリブン型サーバーレスコンピューティングを実現するインスタンス

### AWS EC2

### AWS ECS

[公式サイト](<(https://aws.amazon.com/jp/ecs/)>)

- クラスタ上での Docker コンテナの管理を簡単に行えるサービス
-

### 用語解説

#### 1. プロキシサーバー、プロキシ、リバースプロキシ

(https://jp.norton.com/internetsecurity-etc-proxy-server.html)

> プロキシサーバーなる仲介役サーバーを設置することが一般的。  
> ブラウザから直接スクリプトを実行しているサーバーにつなぐのではなく、  
> プロキシサーバーに接続させる。  
> プロキシサーバーは代わりに目的サイトにアクセスしてデータを受け取り、ブラウザにデータを渡して表示させる。

#### プロキシ

#### リバースプロキシ

- メリット
  - 負荷分散によるスループット向上
  - キャッシュによるレスポンス向上
  - 異なるアプリやフレームワーク、プラットフォームの統合
  - セキュリティ強化
  - SSL の集中管理

> 通常のプロキシと大きく違うのは負荷分散によるスループット向上でしょうか

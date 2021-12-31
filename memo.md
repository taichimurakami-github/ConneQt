memo

# やることメモ

## 開発進捗レポート

### 2021.12.29

### 実装したこと・変更点

- userDoc.friend の構造を変更、firestore からのデータ取得ロジックを大幅変更（割と限界かもしれない、あとは RDB 使おう）

- App.js allUsersDocs >> relatedUsersDocs に変更、取得するデータの変更に伴い、値を利用していた各コンポーネントの実装を変更

  - データ構造について(めんどいので後で architect.md に記載する)
    ```js
      relatedUserDocs = {
        friend: [uid]: UserDocObject
        request: {
          received: [uid]: UserDocObject,
          sent: [uid]: UserDocObject,
        },
        others: [uid]: UserDocObject
      }
    ```

- チャット画面の通知機能を実装

- Mypage の変更

- UserID インストールされていない場合はインストールを促すように UI 変更

### 2021.12.27

### 実装したこと・変更点

主に内部的な変更がメインです。

- 先日のアプリが起動できないバグ修正

- アプリの状態管理設計の変更
  - UserDoc は AppRoute で管理 >> 初回登録の分岐を簡素化するため
  - Modal 系はすべて AppRouteContext に格納
- Modal の実装を改良

  - ナビゲーション実装用に最適化

- アカウント登録周りの新規実装と、それに伴い UserDoc の構造を変更

  - 住所、年齢、プロフィールなどを保持
  - 後の FindUsers ロジック変更に対応
  - Mypage は今日中に対応します

- App.js, AppRoute.js の SignIn 周りの実装を改良

  - たぶん chat のバグも治ってるはず（未検証）

- 郵便番号から住所を自動取得し、バリデーションを通す処理（アカウント登録時のみ実装）

  - めっちゃ時間かかった

- UI/ControlledInput 追加、スタイル微調整等

- ビルド周りのエラー解決 & firebase hosting での配信開始
  - https://gls-conneqt-hey-demo002.web.app/
  - 上記の URL でアプリを使えます

### その他やってたこと

- firestore の再設計

  - 主に UserDoc
  - 通信量を減らすためにいろいろ工夫しようと思ったが、検証時間がなさそうなので大まかな設計はこのままでリリースする

- エラーハンドリング
  - 主に firestore のデータを参照する処理系の最適化を設計
  - 自分以外のアカウント削除、変更などに対する対処を設計

### 12.28 の開発予定

- 変更した UserDoc に基づいてアプリ全体を対応

  - すべてのコンポーネントで UserDoc を参照している部分を変更する
  - 特に Mypage の設定項目と、各プロフ画面

- FindUser 画面のスタイルを変更

  - XD 通りに表示するようにする

- チケット機能を仮実装

  - とりあえずチケットを使用する部分だけ作ろうかと思う

- PWA 化
  - スマホ用に PWA 化を行う

## 優先度 ★★★★★: updated at 2021.12.26

### 友達初登録時、チャット画面を開くとエラーが出る現象の修正

- onSnapShot を別途登録する必要があるところを、登録処理を挟んでいないのが原因
- registerOnSnapshot を作るか

### 決済機能の追加

- 決済機能部分を作成したい
- 試験運用版にはつけないほうがいいかも...という気がする。製品の品質が保証できてないのに金取れないと思う

### パフォーマンスチューニングとコードのメンテナンス性アップ

- 現状、基本的に state と Memo しか使っていないので、適宜 useCallback、state の最適化などを施す
- 特に authState 周りは、App コンポーネントのラッパーコンポーネントを作成してそこで管理したほうがいいかもしれない
- Menu コンポーネントを一時的に非表示にする機能が欲しい：chat コンポーネントなど特定コンポーネントで表示したくない
- firebase.handler と App.js で firestore 周りの functions がばらけているので、統一するかいっそ App コンポーネント内に保存してしまうか考えたい

* redux, context の使用を検討
  > 12.26 追記：リリース後の修正点とする
* state >> reducer への置き換えを検討
  > 必要な部分で適宜切り替えていく

### エラーハンドリング

- デバッグに手が回ってませんので、エラー多発。
- エラーが発生したら、ログを firebase 上に記録し、モーダル上に視覚的に表示するなど

### 通知機能の実装

- バッチを表示する機能、通知状態を表示する機能
- チャット機能、リクエスト送受信機能等、FriendList 周りだけで良いと思う

### スタイルの調整

- 全体的にスタイルが適当なので、調整する

### firebase hosting によるサーバー上でのテスト運用

- deploy 失敗してるよね？ということで build 周りの調整を行う

## 優先度 ★★★★☆ : updated at 2021.12.26

### PWA 化の実験

- 優先度 Max がすべて終わったら PWA 化を行う
- cloud messaging 等を用いて、スマホ・PC 本体への通知機能を実装

### 視覚的なナビの実装

- 各操作完了後、特定条件下などで、ユーザーの行動をサポートするモーダルを表示
- モーダル機構自体は既に実装しているので、特定状況で表示するコードを追加する

## 優先度 ★★★☆☆ : updated at 2021.12.26

### エラーログの自動記録機能

### ルーティングしたい

- 一応、スワイプでの戻る操作とかに対応したいので、ルーティングしたい
- react-router の使用を検討

## 問題点メモ

### firestore との通信量問題

- getAllUserDocs は通信帯域を圧迫してしまう
- meta を保持し、array-contains-any を使用して疑似 OR 文として取り出せばある程度削減できる
- localStorage を併用（crypto API 等で location のみ暗号化？）
  - authUserDoc, chatRoom: onSnapshot を使用するので必要なし
  - friendUserDocs, requestUserDocs: うまいこと使えそうだと思うが、結局ある程度の頻度で変更を検知する必要がある（ただ、リアルタイムでの検知が必須か？は議論の余地がある）
    - リアルタイムじゃなくていいなら localStorage を使おうかな(request, friend なら location データが要らないので、暗号化の必要がなくて楽。)
- というか array-contains-any 以上に削減してしまうとマッチしない気が…

### 友達リクエストを送る際、リクエストを送る瞬間までに相手がアカウントを削除していた場合

- 前述の問題と関連するが、

### アカウント削除時の挙動問題

- friend, request 系の配列から、該当ユーザーを自動削除する必要がある
- friend に関しては、chatRoom を利用して削除されたかどうかリアルタイムで判定できる
  > (1) `chatRoom.metaData.belongs: [user01.uid, user02.uid]`を追加
  > (2) onSnapshot で変更を検知するたびに、belongs に 2 人入っているか確認
  > (3) 入っていなかったら相方のアカウントが抜けた (=アカウント削除)と判定し、チャットルームを無効化する & 視覚的に表示する(チャットルームは開けなくして、フレンド削除ボタンを表示)
  > (4) これらの処理は、friendUserDoc 読み込み時に分岐として行う
- 問題は request 関係、どうやってリアルタイムで削除・変更をリッスンするか？
  - `request.sent, request.received`が存在する場合、該当ユーザーに対し、request データからの uid 削除処理を実行する
    > `getUserDoc(request.***)`->`updateDoc(request.***, {request.***: arrayRemove(data)}`

## 過去の開発進捗レポート

### 2021.12.26

#### 一言

計画より押しちゃってます…
明日明後日で巻き返したい

#### 変更点など

- 全体的なスタイル調整
- App.js コンポーネントの、ログイン周りの機能を別階層に移行し、メンテ性をアップ
- firebase hosting 自体はできるようになった（ただし、npm run build 後のデータに問題があるようでエラー発生を確認）
- その他：アプリ全体の動作フローを見直し、firestore との通信の最適化を行う準備
  > state を最適化、onSnapshot の最適化
  > 特にユーザーを探す機能に関しては最も通信を消費する部分なので、なるべくクエリに入れて取得したいけど難しそうな感じだった

#### 12.27 の開発予定

- App, FriendHandler, FindUserHandler 内の state の再設計と、それに伴う onSnapshot の最適化
- 先日のバグ修正
- アカウント登録周りのナビゲーション実装
- チケット周りの機能設計（たぶん無理だけどできた r 実装したい）
- build 周りのエラー解決
- PWA 化の準備（引き続き情報収取＆設計、素材書き出しなど）

#### 備考(メモ代わりなので見なくても良い)

- 設計を見直した結果、AppComponent の State は 3 つで良いのではないか？という結論になった
  > authUserDoc: 今まで通り
  > FriendUserDoc: reducer 化、正直 FriendHandler 表示時に取得すれば？とも思ったが、フレンドリストを開くたびにロードが入るのはウザいので AppComponent で管理
  > chatRoom: reducer 化、通知機能関連と連携させたいので AppComponent で保持
  > ほんとは Context か Redux 使いたいけど、今更いじる時間はなさそう
- RequestFriendsDocs は FriendHandler から「プロフを見る」ボタンを押すたびに fetch する方式にする
  > これ、ローカルでキャッシュ化できないか？通信量削減になるし、もしできるなら FriendUserDocs を FriendHandler 内に移動できる
  > とりあえずリリース時までに改善するのはあきらめる
- AllUserDocs -> nearbyUserDocs に変更、ShowFoundUserDocs で
- chatRoom バグの件は、AppComponent の State 状態を変更する際にまとめて対策を行う事にした

### 2021.12.25

#### 実装完了機能(feature/impl)

- UserDoc オブジェクト（firestore 上のユーザーアカウントデータのオブジェクトのこと）に locationObject を持たせ、マイページから任意で現在地を設定する
- ShowFoundUsersList で表示される近くの友達の判定基準に、location 同士を比較した距離が一定以内かどうかを追加（とりあえず 10km 以内なら表示されるようにしてます）
- 友達削除機能を実装：とりあえず開発向けの簡易的なもの。それに伴い、ShowChatRoom コンポーネント内にチャットルームメニューを実装（Header の右端の Menu で見れる）
  > ついでなのでトーク相手のプロフィールなども見れるようにしてみた

#### 変更点(rearch)

- UserDoc オブジェクトの request を map 構造化、それに伴い全体的なコード修正
- App.js allUserDocsState について、useEffect 内にて自動更新を設定
- UI/UserProfile コンポーネントを追加、FindUsers/ShowUserProfile, Friend/ShowUserProfile, ShowChatRoom 内で使用

#### 発見したバグ

- 登録してすぐのフレンドのチャットルームを、アプリの再起動や再ログインなしで開こうとするとエラーになる

  > 新しくフレンド登録が実行された時、ChatRoomDataState を変更するコードを追加すればよい

- ユーザーを探す >> リクエストを送る を多重クリックすると、フレンドリスト内に渡されるデータが不正な値になるっぽい（エラー経験済み）
  > とりあえず、ダブルクリック以上できないようにモーダルを表示。もう少し詳しく調査する必要があるが、基本的に DB との通信関数は連続で呼び出してはならないので、その辺を調整

#### 12/26 の開発予定

- 全体的なスタイル調整と、scss ファイル群の最適化
- App.js コンポーネントをさらに階層化し、Auth.js >> App.js >> Handlers という構造へ変更する
  > App.js の実装が肥大化してきたので、Auth 処理は別コンポーネントの State で持ちたい
- モーダルを App ではなく Handler 階層のコンポーネントで保持する構造へ変更
  > ナビゲーション実装のための調整
- /fn/db/ディレクトリのファイルを整理する
- 発見したバグの修正
- firebase hosting の設定
- ユーザーナビゲーションの実装開始

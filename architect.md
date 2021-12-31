アカウント削除機能

> > ShowFriendList.js
> > friendDocsState, reqest ~~ state : [userDocs] -> {uid: {userDoc}}に変更したい

    > friendUserDocs, requestedUserDocsは別途取得する必要あり
    > allUserDocsStateを変更すればよい

allUserDocsState -> relatedUserDocsState
保持データ：
{
friend: {uid: {userDoc}},
request: {
received: {uid: {userDoc}}
sent: {uid: {userDoc}}
},
others: {
}
}

showFoundUser で、rejected ユーザーを取得しないように注意する事

1. 先に friend と request 系のユーザーをとってくる
2. とってきたユーザーの uid を array 形式に変換
3. meta が合致するユーザーを取得する
4. 2 の配列内に存在する uid を持っていないもので、かつ request.rejected の配列内に存在しない uid を持っているユーザーを others にぶち込む

問題点：ネストが深いので、値の更新がめんどくさい気がする > とりあえずデータベース的な感じで受け取っといたらいい
後々 Store 化すべく、localStorage 保存しよう

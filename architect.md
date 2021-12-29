アカウント削除機能



>> ShowFriendList.js
friendDocsState, reqest ~~ state : [userDocs] -> {uid: {userDoc}}に変更したい

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

showFoundUserで、rejectedユーザーを取得しないように注意する事

1. 先にfriendとrequest系のユーザーをとってくる
2. とってきたユーザーのuidをarray形式に変換
3. metaが合致するユーザーを取得する
4. 2の配列内に存在するuidを持っていないもので、かつrequest.rejectedの配列内に存在しないuidを持っているユーザーをothersにぶち込む


問題点：ネストが深いので、値の更新がめんどくさい気がする
	> とりあえずデータベース的な感じで受け取っといたらいい
	後々Store化すべく、localStorage保存しよう


friend追加部分のfirebaseのupdate部分更新
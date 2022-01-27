import { appConfig } from "../../app.config";
import { LSHandler } from "../../fn/app/handleLocalStorage";
import { cutStrLength } from "../../fn/util/cutStrLength";
import "../../styles/UI/UsersList.scss";

/**
 * request.received, sentのユーザーを表示するUI
 * @param {*} props
 * @returns
 */
export const UsersList = (props) => {
  //退会済みユーザーを削除
  const userDocs = [];
  for (const userDoc of props.userDocs) {
    userDocs.push(userDoc);
    // userDoc && userDocs.push(userDoc);
  }

  return (
    <ul
      className={`users-list-wrapper ${
        props?.className?.wrapper ? props.className.wrapper : ""
      }`}
    >
      {userDocs.length > 0 ? (
        userDocs.map((val) => {
          if (val?.deleted) {
            return (
              <li
                id={val.uid}
                key={val.uid}
                className={`user-list ${
                  props?.className?.userList ? props.className.userList : ""
                } ${props?.handleClick ? "clickable" : ""}`}
                onClick={props?.handleClick}
              >
                <img className="user-icon p-events-none" src={val?.photo} />
                <div className="text-container p-events-none">
                  <p className="name p-events-none">退会したユーザー</p>
                </div>

                {props.children}
              </li>
            );
          } else if (val) {
            return (
              <li
                id={val.uid}
                className={`user-list ${
                  props?.className?.userList ? props.className.userList : ""
                } ${props?.handleClick ? "clickable" : ""}`}
                onClick={props?.handleClick}
                key={val.uid}
              >
                <img
                  className="user-icon p-events-none"
                  src={val?.photo}
                  alt={val?.name + "さんのプロフィール画像"}
                />
                <div className="text-container p-events-none">
                  <p className="name p-events-none">{val?.name}</p>
                  <p className="profile p-events-none">
                    {cutStrLength(val?.profile, 15, "...")}
                  </p>
                </div>

                {props.children}
              </li>
            );
          }
        })
      ) : (
        <p>
          {props?.noUserMessage
            ? props.noUserMessage
            : "該当するユーザーが見つかりませんでした。"}
        </p>
      )}
    </ul>
  );
};

/**
 * FriendListに表示されるUsersList
 * チャットデータの表示に対応した部分をコンポーネント化
 * @param {*} props
 * @returns
 */
export const FriendUserList = (props) => {
  const getTopMessage = (chatRoomID) => {
    const chatRoomData = props.chatRoomData[chatRoomID];

    // friendList上に表示される、一番新しいメッセージを表示
    // ただし、chatRoomData.data 配列内に要素がない場合は空文字列を返す
    if (chatRoomData?.data && chatRoomData.data?.length > 0) {
      //chatRoomData.data内に1つ以上のメッセージがあるときは、最後の要素をtopMessageDataに代入
      const fullText = chatRoomData.data[chatRoomData.data.length - 1].text;
      return cutStrLength(fullText, 30);
    } else {
      return "";
    }
  };

  const isUserCheckedAllPosts = (chatRoomID) => {
    const chatRoomData = props.chatRoomData[chatRoomID].data;

    //dataの長さが0だったら、まだチャットが投稿されていないので既読済みとする
    if (chatRoomData.length === 0) return true;

    //localStorageより、ユーザーが最後にチャットを確認した時間を取り出す
    //ちなみに、LSData.chatRoomID.checkedAtは、存在していない場合はApp.js useEffect内で初期値0で定義される
    const LSData = LSHandler.load(appConfig.localStorage["001"].id);
    const lastCheckedTime = LSData[chatRoomID]?.checkedAt;

    //最後の投稿が自分だったらそもそも既読済みとする
    if (chatRoomData[chatRoomData.length - 1].uid === props.authUserDoc.uid)
      return true;
    //最後の投稿が自分ではない場合、既読済みかどうか確認する
    else {
      const lastPostTime = chatRoomData[chatRoomData.length - 1].sentAt
        .toDate()
        .getTime();
      //最後にチャットルームを開いた時間 - 最後にチャットルームに投稿された時間 > 0 ならは、
      //最新の投稿はチェックされた事になる
      return lastPostTime < lastCheckedTime;
    }
  };

  return (
    <ul className="users-list-wrapper">
      {Object.keys(props.friendData).length !== 0 ? (
        Object.keys(props.friendData).map((key) => {
          const userDoc = props.relatedUserDocs[key];
          const chatRoomID = props.friendData[key]?.chatRoomID;
          const chatRoomData = props.chatRoomData[chatRoomID];

          if (chatRoomData && chatRoomData?.metaData && userDoc) {
            //正常にチャットルームを確認できる場合
            return (
              <li
                id={key}
                className={`user-list clickable ${
                  isUserCheckedAllPosts(chatRoomID) ? "checked" : "unchecked"
                }`}
                key={key}
                onClick={props.handleShowChatRoom}
              >
                <img
                  className="user-icon p-events-none"
                  src={userDoc?.photo}
                  alt={userDoc?.name + "さんのプロフィール画像"}
                />
                <div className="text-container wide p-events-none">
                  <p className="name p-events-none">{userDoc?.name}</p>
                  <p className="p-events-none">{getTopMessage(chatRoomID)}</p>
                </div>
                <span
                  className={`notification round orange blink ${
                    isUserCheckedAllPosts(chatRoomID) ? "" : "active"
                  }`}
                ></span>
              </li>
            );
          } else {
            //chatRoomが存在していない場合（取得に失敗した時とか？）
            //ユーザーのドキュメントが取得できなかった場合（相手が存在しない）
            //あるいは、chatRoomからmetaDataが消去されている場合（相手が友達削除した時）
            return (
              <li
                id={key}
                className={`user-list clickable`}
                onClick={props.handleShowUnactivatedChatRoom}
              >
                <img
                  className="user-icon p-events-none"
                  src=""
                  alt="退会したユーザー"
                />
                <div className="text-container p-events-none">
                  <p className="name p-events-none">退会したユーザー</p>
                </div>
              </li>
            );
          }
        })
      ) : (
        <p>
          <b>"見つける" から友達を探しましょう！</b>
          <br></br>
          {/* <button
            className="btn-orange"
            onClick={() => {
              props.handlePageContent(appConfig.pageContents["002"]);
            }}
          >
            友達を見つける
          </button> */}
        </p>
      )}
    </ul>
  );
};

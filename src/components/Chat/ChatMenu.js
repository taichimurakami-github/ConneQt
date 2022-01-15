import { UserProfile } from "../UI/UserProfile";

export const ChatMenu = (props) => {
  return (
    <>
      {props.chatRoomData.metaData ? (
        <h2 className="chatroom-menu-title">
          {props.metaData.doc.with.name}さんのプロフィール
        </h2>
      ) : (
        <h2 className="chatroom-menu-title">このユーザーは退会しました</h2>
      )}
      <UserProfile
        userDoc={
          props.chatRoomData?.metaData
            ? props.metaData.doc.with
            : {
                uid: props.metaData.doc.with.uid,
              }
        }
      />
      {
        //友達削除ボタン：chatRoomDataにmetaDataが存在している場合=相手が存在している場合のみ表示
        <button className="btn-orange" onClick={props.handleDeleteThisFriend}>
          この友達を削除する
        </button>
      }
    </>
  );
};

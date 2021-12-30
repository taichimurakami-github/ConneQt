import { useContext, useEffect, useState } from "react";
import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UsersList } from "../UI/UsersList";
import { AppRouteContext } from "../../AppRoute";

export const ShowFriendList = (props) => {
  const { authUserDoc, showConfirmModal, eraceModal } =
    useContext(AppRouteContext);

  const [requestUserDocs, setRequestUserDocs] = useState({
    received: [],
    sent: [],
  });
  const [friendUserDocs, setFriendUserDocs] = useState([]);

  useEffect(() => {
    if (props.relatedUserDocs) {
      setRequestUserDocs({
        received: Object.values(props.relatedUserDocs.request.received),
        sent: Object.values(props.relatedUserDocs.request.sent),
      });
      setFriendUserDocs(Object.values(props.relatedUserDocs.friend));
    }
  }, [authUserDoc.friend, authUserDoc.request]);

  const getTopMessageFromChatRoomData = (targetUid) => {
    const chatRoomID = authUserDoc.friend[targetUid].chatRoomID;
    const chatRoomData = { ...props.chatRoomData[chatRoomID] };

    // friendList上に表示される、一番新しいメッセージを表示
    // ただし、chatRoomData.data 配列内に要素がない場合は空文字列を返す
    if (chatRoomData?.data && chatRoomData.data?.length > 0) {
      //chatRoomData.data内に1つ以上のメッセージがあるときは、最後の要素をtopMessageDataに代入
      return chatRoomData.data[chatRoomData.data.length - 1].text;
    } else {
      return "";
    }
  };

  const handleShowProfileOnRequestSent = (e) => {
    // selectedUserDocStateを設定
    props.handleSelectedUserDoc({
      ...requestUserDocs.sent[e.target.id],
    });

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["004"]);
  };

  const handleShowProfileOnRequestReceived = (e) => {
    // selectedUserDocStateを設定
    props.handleSelectedUserDoc({
      ...requestUserDocs.received[e.target.id],
    });

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["003"]);
  };

  const handleShowChatRoom = (e) => {
    props.handleTargetChatRoomData({
      doc: {
        me: authUserDoc,
        with: friendUserDocs[e.target.id],
      },
      chatRoomID: authUserDoc.friend[e.target.id].chatRoomID,
    });
    // showChatRoom画面を表示
    props.handleViewState(cmpConfig.state.view["002"]);
  };

  return (
    <>
      <Header title="友達一覧" backable={false} />
      <div className="request-users-container received">
        <h3 className="title">あなた宛ての友達リクエスト</h3>
        <UsersList
          userDocs={requestUserDocs.received}
          noUserMessage="現在、あなたが受け取ったリクエストはありません。"
          handleClick={handleShowProfileOnRequestReceived}
        >
          <button className="btn-orange p-events-none">
            プロフィールを見る
          </button>
        </UsersList>
      </div>

      <div className="request-users-container sent">
        <h3 className="title">友達リクエスト送信済みのユーザー</h3>
        <UsersList
          userDocs={requestUserDocs.sent}
          noUserMessage="現在、あなたが送ったリクエストはありません。"
          handleClick={handleShowProfileOnRequestSent}
        >
          <button className="btn-orange p-events-none">
            プロフィールを見る
          </button>
        </UsersList>
      </div>

      <div className="friend-users-container">
        <h3 className="title">あなたの友達一覧</h3>
        <ul className="users-list-wrapper">
          {friendUserDocs.length !== 0 ? (
            friendUserDocs.map((val) => {
              return (
                <li
                  id={val.uid}
                  className={`user-list clickable`}
                  key={val.uid}
                  onClick={handleShowChatRoom}
                >
                  <img className="user-icon p-events-none" src={val?.photo} />
                  <div className="text-container p-events-none">
                    <p className="name p-events-none">{val?.name}</p>
                    <p className="p-events-none">
                      {getTopMessageFromChatRoomData(val.uid)}
                    </p>
                  </div>
                </li>
              );
            })
          ) : (
            <p>"見つける" から友達を探しましょう！</p>
          )}
        </ul>
      </div>
    </>
  );
};

// /**
//  * firestore の users >> nowAppUser[target] のuid-arrayの中に一致するuidを持つ
//  * allUserDocs内のオブジェクト（userDoc）を返す
//  * @param {string} target
//  * @returns
//  */
// const getSpecifiedUserDocsByUidArr = (targetArr) => {
//   let result = [];

//   if (targetArr.length === 0) return result;

//   for (const userDoc of props.allUserDocs) {
//     for (const targetUid of targetArr) {
//       if (targetUid === userDoc.uid) {
//         result.push(userDoc);
//         break;
//       } else continue;
//     }

//     // 取得したフレンドのDocsの数 === 登録してあるフレンドのuidの数
//     //   >> 全取得完了、処理を処理を終了
//     if (result.length === targetArr.length) break;
//   }
//   return result;
// };

// const getNumberFromStringID = (data, splitChar = "_") => {
//   const splitArr = data.split(splitChar);
//   return Number(splitArr.pop());
// };

// const getTargetChatRoomID = (targetUid) => {
//   for (const friendData of authUserDoc.friend) {
//     if (friendData.uid === targetUid) return friendData.chatRoomID;
//   }
// };

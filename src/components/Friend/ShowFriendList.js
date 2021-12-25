import { useState, useEffect } from "react";
import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UsersList } from "../UI/UsersList";

export const ShowFriendList = (props) => {
  /**
   * firestore の users >> nowAppUser[target] のuid-arrayの中に一致するuidを持つ
   * allUserDocs内のオブジェクト（userDoc）を返す
   * @param {string} target
   * @returns
   */
  const getSpecifiedUserDocsByUidArr = (targetArr) => {
    let result = [];

    if (targetArr.length === 0) return result;

    for (const userDoc of props.allUserDocs) {
      for (const targetUid of targetArr) {
        if (targetUid === userDoc.uid) {
          result.push(userDoc);
          break;
        } else continue;
      }

      // 取得したフレンドのDocsの数 === 登録してあるフレンドのuidの数
      //   >> 全取得完了、処理を処理を終了
      if (result.length === targetArr.length) break;
    }
    return result;
  };

  const getNumberFromStringID = (data, splitChar = "_") => {
    const splitArr = data.split(splitChar);
    return Number(splitArr.pop());
  };

  const getTargetChatRoomID = (targetUid) => {
    for (const friendData of props.nowUserDoc.friend) {
      if (friendData.uid === targetUid) return friendData.chatRoomID;
    }
  };

  const getTopMessageFromChatRoomData = (targetUid) => {
    const chatRoomID = getTargetChatRoomID(targetUid);
    const chatRoomData = { ...props.chatRoomData[chatRoomID] };

    // friendList上に表示される、一番新しいメッセージを表示
    // ただし、リクエスト許可直後は
    let topMessageText = "";
    if (chatRoomData?.data && chatRoomData.data?.length) {
      //chatRoomData.data内に1つ以上のメッセージがあるときは、最後の要素をtopMessageDataに代入
      topMessageText =
        chatRoomData.data.length &&
        chatRoomData.data[chatRoomData.data.length - 1].text;
    }

    return topMessageText;
  };

  const handleShowProfileOnRequestSent = (e) => {
    // selectedUserDocStateを設定
    props.handleSelectedUserDoc(
      req_sentUserDocsState[getNumberFromStringID(e.target.id)]
    );

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["004"]);
  };

  const handleShowProfileOnRequestReceived = (e) => {
    // selectedUserDocStateを設定
    props.handleSelectedUserDoc(
      req_receivedUserDocsState[getNumberFromStringID(e.target.id)]
    );

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["003"]);
  };

  const handleShowChatRoom = (e) => {
    const friendDocsStateArrTargetIndex = getNumberFromStringID(e.target.id);

    props.handleTargetChatRoomData({
      doc: {
        me: props.nowUserDoc,
        with: friendDocsState[friendDocsStateArrTargetIndex],
      },
      chatRoomID: getTargetChatRoomID(
        friendDocsState[friendDocsStateArrTargetIndex].uid
      ),
    });

    // showChatRoom画面を表示
    props.handleViewState(cmpConfig.state.view["002"]);
  };

  const [friendDocsState, setFriendDocsState] = useState([]);
  const [req_receivedUserDocsState, setReq_receivedUserDocsState] = useState(
    []
  );
  const [req_sentUserDocsState, setReq_sentUserDocsState] = useState([]);
  const [req_rejectedUserDocsState, setReq_rejectedUserDocsState] = useState(
    []
  );

  // AppState: userData, allUserDocsStateが変更された時にフレンドリストを更新
  useEffect(() => {
    setFriendDocsState(
      getSpecifiedUserDocsByUidArr(
        props.nowUserDoc.friend.map((val) => val.uid)
      )
    );

    setReq_receivedUserDocsState(
      getSpecifiedUserDocsByUidArr(
        props.nowUserDoc.request.received.map((val) => val)
      )
    );

    setReq_sentUserDocsState(
      getSpecifiedUserDocsByUidArr(
        props.nowUserDoc.request.sent.map((val) => val)
      )
    );

    setReq_rejectedUserDocsState(
      getSpecifiedUserDocsByUidArr(
        props.nowUserDoc.request.rejected.map((val) => val)
      )
    );
  }, [props.nowUserDoc, props.allUserDocs]);

  return (
    <>
      <Header title="フレンドリスト" backable={false} />

      <p
        style={{
          margin: "15px auto 10px",
          background: "green",
          color: "white",
        }}
      >
        あなたが受け取ったリクエスト一覧
      </p>
      <UsersList
        userDocs={req_receivedUserDocsState}
        noUserMessage="現在、あなたが受け取ったリクエストはありません。"
      >
        <button
          className="btn-orange"
          onClick={handleShowProfileOnRequestReceived}
        >
          プロフィールを見る
        </button>
      </UsersList>

      <p
        style={{
          margin: "100px auto 10px",
          background: "darkorange",
          color: "white",
        }}
      >
        あなたが送ったリクエスト一覧
      </p>
      <UsersList
        userDocs={req_sentUserDocsState}
        noUserMessage="現在、あなたが送ったリクエストはありません。"
      >
        <button className="btn-orange" onClick={handleShowProfileOnRequestSent}>
          プロフィールを見る
        </button>
      </UsersList>

      <p
        style={{ margin: "100px auto 10px", background: "red", color: "white" }}
      >
        あなたが拒否された・拒否したリクエスト一覧
      </p>
      <UsersList
        userDocs={req_rejectedUserDocsState}
        noUserMessage="現在、拒否された・したリクエストはありません。"
      ></UsersList>
      <ul className="users-list-wrapper">
        {friendDocsState && friendDocsState.length !== 0 ? (
          friendDocsState.map((val, index) => {
            return (
              <li
                id={`${val.uid}_${index}`}
                className={`user-list clickable`}
                key={val.uid}
                onClick={handleShowChatRoom}
              >
                <img className="user-icon" src={val?.photo} />
                <div className="text-container">
                  <p className="name">{val?.name}</p>
                  <p>{getTopMessageFromChatRoomData(val.uid)}</p>
                </div>
              </li>
            );
          })
        ) : (
          <p>"見つける" から友達を探しましょう！</p>
        )}
      </ul>
    </>
  );
};

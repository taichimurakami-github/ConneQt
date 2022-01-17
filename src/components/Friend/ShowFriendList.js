import { useContext, useState, useEffect } from "react";
import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { FriendUserList, UsersList } from "../UI/UsersList";
import { AppRouteContext } from "../../AppRoute";
import { appConfig } from "../../app.config";
import { cutStrLength } from "../../fn/util/cutStrLength";
import { LSHandler } from "../../fn/app/handleLocalStorage";

export const ShowFriendList = (props) => {
  const { authUserDoc, showErrorModal } = useContext(AppRouteContext);

  const handleShowProfileOnRequestSent = (e) => {
    const targetUserDoc = props.relatedUserDocs[e.target.id];

    if (!targetUserDoc) {
      return showErrorModal({
        content: {
          title: "ユーザー情報の取得に失敗しました。",
        },
      });
    }

    // selectedUserDocStateを設定
    props.handleSelectedUserDoc(targetUserDoc);

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["004"]);
  };

  const handleShowProfileOnRequestReceived = (e) => {
    const targetUserDoc = props.relatedUserDocs[e.target.id];

    if (!targetUserDoc) {
      return showErrorModal({
        content: {
          title: "ユーザー情報の取得に失敗しました。",
        },
      });
    }

    // selectedUserDocStateを設定
    props.handleSelectedUserDoc(targetUserDoc);

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["003"]);
  };

  const handleShowUnactivatedChatRoom = (e) => {
    //「退会したユーザー」のチャット画面を表示
    showErrorModal({
      content: {
        title: "退会したユーザーとのチャットルームです。",
        content: [
          "このチャットルームを削除するには、",
          "右上のMenuから「チャットルームを削除」を選択してください",
        ],
      },
    });
    //ユーザーとのチャット画面を表示
    props.handleTargetChatRoomData({
      doc: {
        me: authUserDoc,
        with: { uid: e.target.id },
      },
      chatRoomID: authUserDoc.friend[e.target.id].chatRoomID,
    });

    //showChatRoom画面を表示
    props.handleViewState(cmpConfig.state.view["002"]);
  };

  const handleShowChatRoom = (e) => {
    const chatRoomID = authUserDoc.friend[e.target.id].chatRoomID;
    //ユーザーとのチャット画面を表示
    props.handleTargetChatRoomData({
      doc: {
        me: authUserDoc,
        with: props.relatedUserDocs[e.target.id],
      },
      chatRoomID: chatRoomID,
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
          userDocs={authUserDoc.request.received.map(
            (uid) => props.relatedUserDocs[uid]
          )}
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
          userDocs={authUserDoc.request.sent.map(
            (uid) => props.relatedUserDocs[uid]
          )}
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
        <FriendUserList
          authUserDoc={authUserDoc}
          friendData={authUserDoc.friend}
          chatRoomData={props.chatRoomData}
          relatedUserDocs={props.relatedUserDocs}
          handleShowChatRoom={handleShowChatRoom}
          handleShowUnactivatedChatRoom={handleShowUnactivatedChatRoom}
        />
        {/* <ul className="users-list-wrapper">
          {Object.keys(authUserDoc.friend).length !== 0 ? (
            Object.keys(authUserDoc.friend).map((key) => {
              const userDoc = props.relatedUserDocs[key];
              const chatRoomID = authUserDoc.friend[key]?.chatRoomID;
              const chatRoomData = props.chatRoomData[chatRoomID];

              if (chatRoomData && chatRoomData?.metaData && userDoc) {
                //正常にチャットルームを確認できる場合
                return (
                  <li
                    id={key}
                    className={`user-list clickable ${
                      isUserCheckedAllPosts(chatRoomID)
                        ? "checked"
                        : "unchecked"
                    }`}
                    key={key}
                    onClick={handleShowChatRoom}
                  >
                    <img
                      className="user-icon p-events-none"
                      src={userDoc?.photo}
                      alt={userDoc?.name + "さんのプロフィール画像"}
                    />
                    <div className="text-container wide p-events-none">
                      <p className="name p-events-none">{userDoc?.name}</p>
                      <p className="p-events-none">
                        {getTopMessageFromChatRoomData(chatRoomID)}
                      </p>
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
                    onClick={handleShowUnactivatedChatRoom}
                  >
                    <img
                      className="user-icon p-events-none"
                      src=""
                      alt="退会したユーザー"
                    />
                    <div className="text-container p-events-none">
                      <p className="name p-events-none">退会したユーザー</p>
                      <p className="p-events-none">
                        {getTopMessageFromChatRoomData(chatRoomID)}
                      </p>
                      <span>{Date.now()}</span>
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <p>
              "見つける" から友達を探しましょう！<br></br>
              <button
                className="btn-orange"
                onClick={() => {
                  props.handlePageContent(appConfig.pageContents["002"]);
                }}
              >
                友達を見つける
              </button>
            </p>
          )}
        </ul> */}
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

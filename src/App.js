// config import
import { appConfig } from "./app.config";

// lib imports

import { useState, useEffect, useContext } from "react";

// components imports
import { FindUserHandler } from "./components/FindUserHandler";
import { FriendHandler } from "./components/FriendHandler";
import { MypageHandler } from "./components/MypageHandler";
import { PageMenu } from "./components/UI/Menu";

// fn imports
import { getRelatedUserDocs, getUserDocsByDataArray } from "./fn/db/getHandler";
// import handleOnWriteHook from "../functions";

// app common style imports
import "./styles/App.scss";

import { doc, getFirestore, onSnapshot } from "firebase/firestore";

import { AppRouteContext } from "./AppRoute";
import { db_name } from "./firebase.config";

export const App = (props) => {
  /**
   * setState definitions
   */
  const { authUserDoc, eraceModal } = useContext(AppRouteContext);
  // const [nowUserDoc, setNowUserDoc] = useState({...authUserDoc})
  const [relatedUserDocsState, setRelatedUserDocsState] = useState({});
  const [pageContentState, setPageContentState] = useState(
    appConfig.pageContents["001"]
  );
  const [chatRoomDataState, setChatRoomDataState] = useState({});

  /**
   * useEffect functions
   */

  useEffect(() => {
    (async () => {
      const r = await getRelatedUserDocs(authUserDoc);
      setRelatedUserDocsState(r);
      eraceModal();
    })();
  }, []);

  //chatRoomDataStateのUpdateHookを登録
  //friendが新しく追加された場合は、chatRoomDataStateを自動更新し、updateHookを付与する
  useEffect(() => {
    (async () => {
      //authUserDoc.friendが取得されていない、あるいはフレンドがいない状態なら実行しない
      console.log(authUserDoc.friend);
      if (!Object.keys(authUserDoc.friend).length > 0) return;

      const listenTargetChatRoomIDs = [];
      const nowListeningChatRoomIDs = Object.keys(chatRoomDataState);

      for (const friendObj of Object.values(authUserDoc.friend)) {
        //friend.chatRoomIDがリッスンされていないchatRoomだったら
        //listenTargetChatRoomIDsに登録
        if (!nowListeningChatRoomIDs.includes(friendObj.chatRoomID)) {
          listenTargetChatRoomIDs.push(friendObj.chatRoomID);
        }
      }

      //新たに追加するchatRoomがなかったらここで終了
      if (!listenTargetChatRoomIDs.length > 0) return;

      //新しくchatRoomをリッスンする
      const db = getFirestore();
      const chatroom_unSubFuncArr = listenTargetChatRoomIDs.map(
        (chatRoomID) => {
          return onSnapshot(
            doc(db, db_name.chatRoom, chatRoomID),
            //success callback
            (doc) => {
              //現在のchatRoomDataStateに要素を追加
              const newData = {
                ...chatRoomDataState,
              };
              const data = doc.data();
              if (data) {
                newData[chatRoomID] = data;
                setChatRoomDataState(newData);
              }
            },
            //error callback
            (error) => {
              console.log(error);
            }
          );
        }
      );

      //authUserStateにunsubFuncを登録
      props.registerUnsubFunc(chatroom_unSubFuncArr, "chatRoom");
    })();
  }, [authUserDoc.friend]);

  //friend, requestユーザーがアップデートされた場合、該当ユーザーがallUserDocs内に存在していなかったら取得する
  useEffect(() => {
    const newUserUidArray = [];
    const nowRelatedUsersUidArray = [
      ...Object.keys(authUserDoc.friend),
      ...authUserDoc.request.received,
      ...authUserDoc.request.sent,
    ];

    //現在所持しているrelatedUserDocs内に、authUserDocsが保持しているrelatedUser(request.sent, request.received, friend)のデータが存在しない場合
    //新たにfetchする対象とする
    for (const uid of nowRelatedUsersUidArray) {
      !relatedUserDocsState.hasOwnProperty(uid) && newUserUidArray.push(uid);
    }

    //新しいユーザーを取得し、relatedUserDocsに追加
    newUserUidArray.length > 0 &&
      (async () => {
        const r = await getUserDocsByDataArray(newUserUidArray);
        console.log({ ...relatedUserDocsState, ...r });
        setRelatedUserDocsState({
          ...relatedUserDocsState,
          ...r,
        });
      })();
  }, [
    authUserDoc.friend,
    authUserDoc.request.received,
    authUserDoc.request.sent,
  ]);

  // const deleteExistChatRoomData = (tRoomID = "") => {
  //   if ((chatRoomID = "")) return;

  //   const validatedChatRoomDataState = { ...chatRoomDataState };
  //   delete validatedChatRoomDataState[chatRoomID];

  //   setChatRoomDataState(validatedChatRoomDataState);
  // };

  /**
   * handle Page Content(Main content) by appConfig.pageContents data
   * @param {string} id
   * @returns
   */
  const handlePageContent = (id) => {
    switch (id) {
      case appConfig.pageContents["003"]:
        return (
          <FriendHandler
            nowUserDoc={authUserDoc}
            allUserDocs={relatedUserDocsState}
            chatRoomData={chatRoomDataState}
            handleChatRoom={setChatRoomDataState}
            handleRelatedUserDocs={setRelatedUserDocsState}
          />
        );

      case appConfig.pageContents["004"]:
        return (
          <MypageHandler
            nowUserDoc={authUserDoc}
            signOut={props.signOutFromApp}
          />
        );

      default:
        return (
          <FindUserHandler
            nowUserDoc={authUserDoc}
            allUserDocs={relatedUserDocsState}
            handleAllUserDocsState={setRelatedUserDocsState}
            handlePageContent={setPageContentState}
          />
        );
    }
  };

  /**
   * render
   */
  return (
    <div className="App">
      {handlePageContent(pageContentState)}
      <div className="spacer" style={{ height: "100px" }}></div>
      {authUserDoc && (
        <PageMenu
          pageContentState={pageContentState}
          handlePageContent={setPageContentState}
        />
      )}
    </div>
  );
};

//chatRoomDataStateが登録されているときは、
//chatRoomのデータ削除を検知して自動的に削除
// useEffect(() => {
//   if (Object.keys(chatRoomDataState).length > 0) {
//     const validatedChatRoomDataState = { ...chatRoomDataState };
//     for (const prop in chatRoomDataState) {
//       !chatRoomDataState[prop] && delete validatedChatRoomDataState[prop];
//       console.log(chatRoomDataState[prop]);
//     }
//     setChatRoomDataState(validatedChatRoomDataState);
//   }
// }, [chatRoomDataState]);

// const getAllUserDocsSnapshot = async (setter) => {
//   const db = getFirestore();
//   return onSnapshot(collection(db, "users"), (snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         console.log("New UserDoc: ", change.doc.data());
//         const newAllUserDocs = [...relatedUserDocsState];
//         const changedDocData = change.doc.data();
//         newAllUserDocs[changedDocData.uid] = changedDocData;
//         for (let i = 0; i < newAllUserDocs.length; i++) {
//           if (newAllUserDocs[i].uid === changedDocData.uid) {
//             newAllUserDocs[i] = changedDocData;
//             break;
//           }
//         }
//         setter(newAllUserDocs);
//       }
//       if (change.type === "modified") {
//         const newAllUserDocs = [...relatedUserDocsState];
//         const changedDocData = change.doc.data();
//         newAllUserDocs[changedDocData.uid] = changedDocData;
//         for (let i = 0; i < newAllUserDocs.length; i++) {
//           if (newAllUserDocs[i].uid === changedDocData.uid) {
//             newAllUserDocs[i] = changedDocData;
//             break;
//           }
//         }
//         console.log("Modified UserDoc: ", change.doc.data());
//         setter(newAllUserDocs);
//       }
//       if (change.type === "removed") {
//         console.log("Removed UserDoc: ", change.doc.data());
//         const newAllUserDocs = [...relatedUserDocsState];
//         delete newAllUserDocs[change.doc.data().uid];
//         setter(newAllUserDocs);
//       }
//     });
//   });
// };

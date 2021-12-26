// config import
import { appConfig } from "./app.config";

// lib imports

import { useState, useEffect } from "react";

// components imports
import { FindUserHandler } from "./components/FindUserHandler";
import { FriendHandler } from "./components/FriendHandler";
import { MypageHandler } from "./components/MypageHandler";
import { Modal } from "./components/Modal";
import { Menu } from "./components/UI/Menu";

// fn imports
import {
  getAuthUserDoc,
  registerAuthUserDoc,
  registerUpdateHookForChatroom,
  registerUpdateHookForUsers,
} from "./fn/db/firestore.handler";
// import handleOnWriteHook from "../functions";

// app common style imports
import "./styles/App.scss";
import { generateDummyUserDocs } from "./devTools/dummyUserListData";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";

export const App = (props) => {
  /**
   * setState definitions
   */
  // const [userData, setUserData] = useState(
  //   generateDummyUserDocs()[0]
  // );
  // const [allUserDocsState, setAllUserDocsState] = useState(
  //   generateDummyUserDocs()
  // );
  const [userData, setUserData] = useState(null);
  const [allUserDocsState, setAllUserDocsState] = useState([]);
  const [modalState, setModalState] = useState({
    ...appConfig.initialState.App.modalState,
  });
  const [pageContentState, setPageContentState] = useState(
    appConfig.pageContents["001"]
  );
  const [chatRoomDataState, setChatRoomDataState] = useState({});

  /**
   * modal state functions
   */
  const eraceModal = () =>
    setModalState({ ...appConfig.initialState.App.modalState });
  const createLoadingModal = () =>
    setModalState({
      ...modalState,
      display: true,
      closeable: false,
      type: appConfig.components.modal.type["001"],
    });

  /**
   * useEffect functions
   */
  useEffect(() => {
    /**
     * ログイン処理
     * ! 認証が通ってなかったら処理しない
     */
    props.authState &&
      (async () => {
        // await fetchAndRenewUserData({ init: true });
        //authを通ったユーザーを指定
        //返り値は Object(見つかった) or null(見つからなかった)
        const isUserStateExists = userData ? true : false;
        if (isUserStateExists) {
          //既にuserDocStateが存在しているかどうか判定
          console.log("your userdata has already exist.");
          return;
        }

        //loadingをつける
        createLoadingModal();

        const user = await getAuthUserDoc(props.authState);

        //見つからなかったらDBに登録して改めてusedataを取得・登録 >> Mypageを表示 & ようこそ！モーダルを表示
        //見つかったらそのままuserdataを登録 >> 表示するページはいじらない
        if (user) {
          /**
           * ここでfirestoreの変更をhookする関数を起動しておきたい
           * ログイン時に１回だけ起動できれば良い？はず
           */

          //ユーザー登録済み
          console.log("you're registered.");

          //chatRoomDataStateのUpdateHookを登録
          const db = getFirestore();

          const unsub_chatroom_onSnapshot = user.friend.map((val) => {
            return onSnapshot(doc(db, "chatRoom", val.chatRoomID), (doc) => {
              console.log("chatroom " + val.chatRoomID + " has been updated.");

              const newData = {
                ...chatRoomDataState,
              };
              newData[val.chatRoomID] = doc.data();

              console.log(newData);

              setChatRoomDataState(newData);
            });
          });

          props.setAuthState({
            ...props.authState,
            onSnapshot_unsubscribe: [
              registerUpdateHookForUsers(user.uid, setUserData),
              ...unsub_chatroom_onSnapshot,
            ],
          });

          onSnapshot(collection(db, "users"), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                console.log("New UserDoc: ", change.doc.data());
                const newAllUserDocs = [...allUserDocsState];
                const changedDocData = change.doc.data();
                newAllUserDocs[changedDocData.uid] = changedDocData;
                for (let i = 0; i < newAllUserDocs.length; i++) {
                  if (newAllUserDocs[i].uid === changedDocData.uid) {
                    newAllUserDocs[i] = changedDocData;
                    break;
                  }
                }
                setAllUserDocsState(newAllUserDocs);
              }
              if (change.type === "modified") {
                const newAllUserDocs = [...allUserDocsState];
                const changedDocData = change.doc.data();
                newAllUserDocs[changedDocData.uid] = changedDocData;
                for (let i = 0; i < newAllUserDocs.length; i++) {
                  if (newAllUserDocs[i].uid === changedDocData.uid) {
                    newAllUserDocs[i] = changedDocData;
                    break;
                  }
                }
                console.log("Modified UserDoc: ", change.doc.data());
                setAllUserDocsState(newAllUserDocs);
              }
              if (change.type === "removed") {
                console.log("Removed UserDoc: ", change.doc.data());
                const newAllUserDocs = [...allUserDocsState];
                delete newAllUserDocs[change.doc.data().uid];
                setAllUserDocsState(newAllUserDocs);
              }
            });
          });

          setUserData(user);

          eraceModal();

          // FInd Usersを表示コンテンツに指定
          setPageContentState(appConfig.pageContents["002"]);

          return;
        } else {
          console.log("you're NOT registered.");

          //ユーザー未登録
          setUserData(await registerAuthUserDoc(authState));
          setPageContentState(appConfig.pageContents["004"]);

          eraceModal();
          return;
        }
      })();
  }, []);

  /**
   * handle Page Content(Main content) by appConfig.pageContents data
   * @param {string} id
   * @returns
   */
  const handlePageContent = (id) => {
    switch (id) {
      //SIGN_UP
      // case appConfig.pageContents["001"]:
      //   return <SignUp />;

      //USERS_LIST
      case appConfig.pageContents["002"]:
        return (
          <FindUserHandler
            nowUserDoc={userData}
            allUserDocs={allUserDocsState}
            handleAllUserDocsState={setAllUserDocsState}
            handlePageContent={setPageContentState}
            handleModalState={setModalState}
          />
        );

      case appConfig.pageContents["003"]:
        return (
          <FriendHandler
            nowUserDoc={userData}
            allUserDocs={allUserDocsState}
            chatRoomData={chatRoomDataState}
          />
        );

      case appConfig.pageContents["004"]:
        return (
          <MypageHandler
            handleModalState={setModalState}
            eraceModal={eraceModal}
            nowUserDoc={userData}
            signOut={props.signOutFromApp}
          />
        );

      default:
        return undefined;
    }
  };

  /**
   * render
   */
  return (
    <div className="App">
      {handlePageContent(pageContentState)}
      <div className="spacer" style={{ height: "100px" }}></div>
      {userData && (
        <Menu
          pageContentState={pageContentState}
          handlePageContent={setPageContentState}
        />
      )}
      <Modal state={modalState} handleModalState={setModalState} />
    </div>
  );
};

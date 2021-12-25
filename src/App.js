// config import
import { appConfig } from "./app.config";

// lib imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

// components imports
import { SignUp } from "./components/SignUp";
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
import { signOut } from "./fn/auth/firebase.auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";

export const App = () => {
  /**
   * setState definitions
   */
  const [authState, setAuthState] = useState(null);
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
   * execute signOut
   */
  const signOutFromApp = () => {
    // onSnapshot のリスナーを削除
    authState.onSnapshot_unsubscribe.map((func) => func());

    // sign outを実行
    signOut();
  };

  /**
   * useEffect functions
   */

  //ログイン状態を判定・処理
  useEffect(() => {
    //loadingエフェクトを起動
    setModalState({
      display: true,
      closable: false,
      type: appConfig.components.modal.type["001"],
      content: null,
    });

    const auth = getAuth();
    // setPageContentState(appConfig.pageContents["002"]);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("you have signed in as : " + user.email);

        /**
         * firestoreのusers > nowUser.uid のdocの変更をhookする関数を起動
         * ログイン時に１回だけ起動できれば良い？はず
         * 以後、ログアウトするまで自動でuserDocの更新時にsetStateしてくれる
         */
        user.onSnapshot_unsubscribe = [
          registerUpdateHookForUsers(user.uid, setUserData),
        ];
        console.log(user);

        // AuthStateを更新
        setAuthState(user);

        eraceModal();
      } else {
        // User is signed out
        // ...
        console.log("you have signed out!");

        // AuthStateを更新
        setAuthState(null);

        // Signed Inを表示コンテンツに指定
        setPageContentState(appConfig.pageContents["001"]);

        eraceModal();
      }
    });
  }, []);

  useEffect(() => {
    /**
     * ログイン処理
     * ! 認証が通ってなかったら処理しない
     */
    authState &&
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

        const user = isUserStateExists
          ? { ...userData }
          : await getAuthUserDoc(authState);
        console.log(`isUsersStateExists?: ${isUserStateExists}`);

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

          setAuthState({
            ...authState,
            onSnapshot_unsubscribe: [
              ...authState.onSnapshot_unsubscribe,
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
  }, [authState]);

  /**
   * handle Page Content(Main content) by appConfig.pageContents data
   * @param {string} id
   * @returns
   */
  const handlePageContent = (id) => {
    switch (id) {
      //SIGN_UP
      case appConfig.pageContents["001"]:
        return <SignUp />;

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
            authState={authState}
            handleAuthState={setAuthState}
            chatRoomData={chatRoomDataState}
          />
        );

      case appConfig.pageContents["004"]:
        return (
          <MypageHandler
            handleModalState={setModalState}
            eraceModal={eraceModal}
            authData={authState}
            nowUserDoc={userData}
            signOut={signOutFromApp}
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
      {authState && userData && (
        <Menu
          pageContentState={pageContentState}
          handlePageContent={setPageContentState}
        />
      )}
      <Modal state={modalState} handleModalState={setModalState} />
    </div>
  );
};

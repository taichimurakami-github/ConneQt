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
import { getAuthUserDoc, registerAuthUserDoc, registerUpdateHookForUsers } from "./fn/db/firestore.handler";
// import handleOnWriteHook from "../functions";

// app common style imports
import "./styles/App.scss";
import { generateDummyUserDocs } from "./devTools/dummyUserListData";

export const App = () => {

  /**
   * setState definitions
   */
  const [authState, setAuthState] = useState(null);
  const [userData, setUserData] = useState(
    generateDummyUserDocs()[0]
  );
  const [allUserDocsState, setAllUserDocsState] = useState(
    generateDummyUserDocs()
  );
  // const [userData, setUserData] = useState(null);
  // const [allUserDocsState, setAllUserDocsState] = useState([]);
  const [modalState, setModalState] = useState({ ...appConfig.initialState.App.modalState });
  const [pageContentState, setPageContentState] = useState(appConfig.pageContents["001"]);

  // const 

  /**
   * modal state functions
   */
  const eraceModal = () => setModalState({ ...appConfig.initialState.App.modalState });
  const createLoadingModal = () => setModalState({
    ...modalState,
    display: true,
    closeable: false,
    type: appConfig.components.modal.type["001"]
  });


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
        return <FindUserHandler
          user={userData}
          allUserDocs={allUserDocsState}
          handleAllUserDocsState={setAllUserDocsState}
          handlePageContent={setPageContentState}
          handleModalState={setModalState}
        />;

      case appConfig.pageContents["003"]:
        return <FriendHandler
          appUser={userData}
        />;

      case appConfig.pageContents["004"]:
        return <MypageHandler
          handleModalState={setModalState}
          eraceModal={eraceModal}
          authData={authState}
          user={userData} />;

      default:
        return undefined;
    }
  }


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
      content: null
    });

    const auth = getAuth();
    // setPageContentState(appConfig.pageContents["002"]);

    onAuthStateChanged(auth, (user) => {
      let unsubscribe;

      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("you have signed in as : " + user.email);

        // AuthStateを更新
        setAuthState(user);

        /**
         * ここでfirestoreの変更をhookする関数を起動しておきたい
         * ログイン時に１回だけ起動できれば良い？はず
         * 以後、ログアウトするまで自動でuserDocの更新時にsetStateしてくれる
         */
        unsubscribe = registerUpdateHookForUsers(user.uid, setUserData);


      } else {
        // User is signed out
        // ...
        console.log("you have signed out!");

        // onSnapshotを削除
        unsubscribe && unsubscribe();

        // AuthStateを更新
        setAuthState(null);

        //loadingエフェクトを終了
        eraceModal();

        // Signed Inを表示コンテンツに指定
        setPageContentState(appConfig.pageContents["001"]);
      }
    });
  }, []);

  useEffect(() => {

    /**
     * ログイン処理
     */
    (async () => {
      // await fetchAndRenewUserData({ init: true });

      //認証が通ってなかったら処理しない
      if (!authState) return;

      //loadingをつける
      createLoadingModal();

      //authを通ったユーザーを指定
      //返り値は Object(見つかった) or null(見つからなかった)
      const isUserStateExists = userData ? true : false;
      const user = isUserStateExists ? { ...userData } : await getAuthUserDoc(authState);
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

        //既にuserDocStateが存在しているかどうか判定
        isUserStateExists
          ? console.log("your userdata has already exist.")
          : setUserData(user);

        eraceModal();

      }
      else {
        console.log("you're NOT registered.");

        //ユーザー未登録
        setUserData(await registerAuthUserDoc(authState));
        setPageContentState(appConfig.pageContents["004"]);
        setModalState({
          display: true,
          closable: true,
          type: appConfig.components.modal.type["002"],
          content: {
            title: "Hey! へようこそ！",
            text: [
              "hey!へようこそ！",
              "これは初回登録時にのみ表示されるメッセージです。",
              "まずはあなたのアカウント設定を行いましょう"
            ],
            buttonText: "閉じる"
          }
        })
      }

      //loadingエフェクトを終了
      eraceModal();

      // FInd Usersを表示コンテンツに指定
      setPageContentState(appConfig.pageContents["002"]);
    })();

  }, [authState]);


  /**
   * render
   */
  return (
    <div className="App">
      {
        handlePageContent(pageContentState)
      }
      <div className="spacer" style={{ height: "100px" }}></div>
      {
        authState && userData && (
          <Menu
            pageContentState={pageContentState}
            handlePageContent={setPageContentState}
          />
        )
      }
      <Modal
        state={modalState}
        handleModalState={setModalState}
      />
    </div>
  );
}

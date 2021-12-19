// config import
import { appConfig } from "./app.config";

// lib imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

// components imports
import { SignUp } from "./components/SignUp";
import { FindUserHandler } from "./components/FindUserHandler";
import { FriendHandler } from "./components/FriendHandler";
import { Mypage } from "./components/Mypage";
import { Modal } from "./components/Modal";
import { Menu } from "./components/UI/Menu";

// fn imports
import { getAuthUserDoc, registerAuthUserDoc } from "./fn/db/firestore.handler";

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
  const [isSignedIn, setIsSignedIn] = useState(false);
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
        return <Mypage
          fetchAndRenewUserData={fetchAndRenewUserData}
          handleModalState={setModalState}
          eraceModal={eraceModal}
          authData={authState}
          user={userData} />;

      default:
        return undefined;
    }
  }

  /**
   * update useState: userData
   */
  const fetchAndRenewUserData = async (options = { init: false }) => {

    //userDataを更新
    //userDataが無い場合はfirebaseより情報取得

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

      //ユーザー登録済み
      console.log(user);

      if (isUserStateExists) {
        console.log("your userdata has already exist.");
      }
      else {
        setUserData(user);
      }

      eraceModal();

    }
    else {

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

    //loadingを消す
    // eraceModal();
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
    setPageContentState(appConfig.pageContents["002"]);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("you have signed in!");
        console.log(user);

        // Users Listを表示コンテンツに指定
        setPageContentState(appConfig.pageContents["002"]);

        // AuthState, SignInStateを更新
        setAuthState(user);
        setIsSignedIn(true);

        //loadingエフェクトを終了
        eraceModal();

      } else {
        // User is signed out
        // ...
        console.log("you have signed out!");

        /**
         * SET AUTH FOR TRUE DUE TO DEVELOPMENT
         * PLEASE FIX IT BEFORE CHANGE MODE TO PRODUCTION!
         */
        // setAuthState(null);
        setAuthState(true);
        setIsSignedIn(true);


        // setIsSignedIn(false);
        // setPageContentState(appConfig.pageContents["001"]);

        //loadingエフェクトを終了
        eraceModal();
      }
    });
  }, []);


  //認証状態が変化したらアップデートを行う
  useEffect(() => {
    (async () => {
      authState && fetchAndRenewUserData({ init: true });
    })();
  }, [isSignedIn]);


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

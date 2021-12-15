// config import
import { appConfig } from "./app.config";

// lib imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

// components imports
import { SignUp } from "./components/SignUp";
import { UsersList } from "./components/UsersList";
import { UserProfile } from "./components/UserProfile";
import { Mypage } from "./components/Mypage";
import { Modal } from "./components/Modal";
import { Menu } from "./components/Menu";



// fn imports
import { getAllUserDocs, getAuthUserDoc, registerAuthUserDoc } from "./fn/db/firestore.handler";
// app common style imports
import "./styles/App.scss";


export const App = () => {

  /**
   * setState definitions
   */
  const [authState, setAuthState] = useState(null);
  const [userData, setUserData] = useState(null);
  const [allUsersData, setAllUsersData] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [modalState, setModalState] = useState({ ...appConfig.initialState.App.modalState });
  const [pageContentState, setPageContentState] = useState(appConfig.pageContents["001"]);

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
        return <UsersList
          user={userData}
          allUsers={allUsersData}
          renewUsers={fetchAndRenewAllUserData}
          handlePageContent={setPageContentState}
          handleSelectUser={setSelectedUserData} />;

      //USER_PROFILE
      case appConfig.pageContents["003"]:
        return <UserProfile
          user={selectedUserData}
          handlePageContent={setPageContentState} />;

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
    const user = await getAuthUserDoc(authState);

    // eraceModal();

    //見つからなかったらDBに登録して改めてusedataを取得・登録 >> Mypageを表示 & ようこそ！モーダルを表示
    //見つかったらそのままuserdataを登録 >> 表示するページはいじらない
    if (user) {

      //ユーザー登録済み
      setUserData(user);
      eraceModal();

      //init: trueの引数指定の場合のみ、「おかえりなさい！」モーダルを表示
      // options.init && setModalState({
      //   display: true,
      //   closable: true,
      //   type: appConfig.components.modal.type["002"],
      //   content: {
      //     title: "おかえりなさい！"
      //   }
      // });
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
          ]
        }
      })
    }

    //loadingを消す
    // eraceModal();
  }

  /**
   * update useState: allUserData
   */
  const fetchAndRenewAllUserData = async () => {
    createLoadingModal();
    setAllUsersData(await getAllUserDocs());
    eraceModal();
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
        setAuthState(null);
        setIsSignedIn(false);
        setPageContentState(appConfig.pageContents["001"]);

        //loadingエフェクトを終了
        eraceModal();
      }
    });
  }, []);


  //認証状態が変化したらアップデートを行う
  useEffect(() => {
    authState && fetchAndRenewUserData({ init: true });
  }, [isSignedIn]);


  /**
   * render
   */
  return (
    <div className="App">
      {
        // Main contents component
        // signInState
        //   ? <UsersList user={userData} />
        //   : <SignUp />
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

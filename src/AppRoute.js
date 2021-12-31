import { useState, useEffect, createContext } from "react";
import { App } from "./App";

import { appConfig } from "./app.config";
import { SignUp } from "./components/SignUp";
import { ModalHandler } from "./components/ModalHandler";
import { RegisterHandler } from "./components/RegisterHandler";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { getAuthUserDoc } from "./fn/db/getHandler";
import { signOut } from "./fn/auth/firebase.auth";

export const AppRouteContext = createContext();

export const AuthHandler = () => {
  const [authState, setAuthState] = useState(null);
  const [authUserDoc, setAuthUserDoc] = useState(null);
  const [modalState, setModalState] = useState({
    ...appConfig.initialState.modalState,
  });
  const [viewState, setViewState] = useState(
    appConfig.routePageContents["001"]
  );

  /**
   * Modal util functions
   */
  const eraceModal = () => {
    setModalState({ ...appConfig.initialState.modalState });
  };

  const showLoadingModal = () => {
    setModalState({
      display: true,
      type: appConfig.components.modal.type["001"],
      closeable: false,
    });
  };

  const showConfirmModal = (args) => {
    setModalState({
      display: true,
      type: appConfig.components.modal.type["002"],
      closable: true,
      ...args,
    });
  };

  const showErrorModal = (args) => {
    setModalState({
      display: true,
      type: appConfig.components.modal.type["003"],
      closable: true,
      ...args,
    });
  };

  /**
   * execute signOut
   */
  const signOutFromApp = () => {
    // onSnapshot のリスナーを削除
    authState.onSnapshot_unsubFuncArr.map((func) => func());

    // sign outを実行
    signOut();
  };

  /**
   * execute signIn
   */

  /**
   * onSnapshotのunsubscribe()をarray内に格納
   * signOut時に実行するのに使う
   * @param {*} funcArr
   * @param {*} to
   */

  const registerUnsubFunc = (funcArr, to = "standard") => {
    if (!Array.isArray(funcArr)) {
      throw new Error("registerUnsubFunc arg is needed to be an Array.");
    }
    if (to === "chatRoom") {
      //chatRoomのonSnapshotに関してのunsub
      //friend状態が変化した際にlistenし直すので、毎回全部unsubしてから総入れ替え
      authState.onSnapshot_chatRoom_unsubFuncArr.map((func) => func());
      setAuthState({
        ...authState,
        onSnapshot_chatRoom_unsubFuncArr: [...funcArr],
      });
    } else {
      setAuthState({
        ...authState,
        onSnapshot_unsubFuncArr: [
          ...authState.onSnapshot_unsubFuncArr,
          ...funcArr,
        ],
      });
    }
  };

  const handleAuthUserDoc = (user) => {
    const db = getFirestore();
    const authUserDoc_unSubFunc = onSnapshot(
      doc(db, "users", user.uid),
      (doc) => {
        console.log("changed doc data");
        const data = doc.data();
        console.log(doc.data());

        //undefinedだったらこれ以下の処理を実行しない(アカウント消去時)
        if (data) {
          setAuthUserDoc({ ...data });
          setViewState(appConfig.routePageContents["003"]);
        }
      }
    );
    return registerUnsubFunc([authUserDoc_unSubFunc]);
  };

  //ログイン状態を判定・処理
  useEffect(() => {
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
        const authStateData = {
          ...user,
          onSnapshot_unsubFuncArr: [],
          onSnapshot_chatRoom_unsubFuncArr: [],
        };
        // AuthStateを設定
        setAuthState(authStateData);
      } else {
        // User is signed out
        console.log("you have signed out!");

        // AuthStateを初期化
        setAuthState(null);
        setViewState(appConfig.routePageContents["001"]);
      }
    });
  }, []);

  useEffect(() => {
    authState &&
      (async () => {
        showLoadingModal();
        //authを通ったユーザーを指定
        //返り値は Object(見つかった) or null(見つからなかった)
        const isUserStateExists = authUserDoc ? true : false;
        if (isUserStateExists) {
          //既にuserDocStateが存在しているかどうか判定
          console.log("your userdata has already exist.");
          return;
        }

        // userDocをfirestore上で検索
        const fetchedAuthUserData = await getAuthUserDoc(authState);

        if (fetchedAuthUserData) {
          //userDocが存在した：登録済み
          //authUserのsnapShot登録 & 変更を検知したらsetAuthUserDocを自動実行
          handleAuthUserDoc(fetchedAuthUserData);
        } else {
          //fetchedAuthUserData == nullだった
          //初回登録へ
          console.log("you are new here.");
          setViewState(appConfig.routePageContents["002"]);
        }

        eraceModal();
      })();
  }, [authState]);

  /**
   * handle view
   */
  const handleView = () => {
    switch (viewState) {
      case appConfig.routePageContents["002"]:
        /**
         * authSStateが存在かつauthUserDocが取得できなかった
         *  >> アカウント初回登録処理
         */
        return (
          <RegisterHandler
            handleSignOut={signOutFromApp}
            handleAuthUserDoc={handleAuthUserDoc}
            authState={authState}
          />
        );

      case appConfig.routePageContents["003"]:
        /**
         * authStateが存在かつauthUserDocが取得できた
         *  >> ログイン完了、アプリ開始処理
         */
        return (
          <App
            authState={authState}
            setAuthState={setAuthState}
            authUserDoc={authUserDoc}
            signOutFromApp={signOutFromApp}
            registerUnsubFunc={registerUnsubFunc}
          />
        );

      default:
        /**
         * authUserDocが取得できなかった
         *  >> ログイン前画面表示
         */
        return <SignUp />;
    }
  };

  return (
    <>
      <AppRouteContext.Provider
        value={{
          modalState,
          setModalState,
          eraceModal,
          authUserDoc,
          setAuthUserDoc,
          signOutFromApp,
          showLoadingModal,
          showConfirmModal,
          showErrorModal,
        }}
      >
        {handleView()}

        <ModalHandler />
      </AppRouteContext.Provider>
    </>
  );
};

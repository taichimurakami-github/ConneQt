import { useState, useEffect, useContext, createContext } from "react";
import { App } from "./App";
import { SignUp } from "./components/SignUp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "./fn/auth/firebase.auth";
import { appConfig } from "./app.config";
import { ModalHandler } from "./components/ModalHandler";
import { RegisterHandler } from "./components/RegisterHandler";
import { getAuthUserDoc } from "./fn/db/firestore.handler";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

export const AppRouteContext = createContext();

export const AuthHandler = () => {
  const [authState, setAuthState] = useState(null);
  const [authUserDoc, setAuthUserDoc] = useState(null);
  const [modalState, setModalState] = useState({
    ...appConfig.initialState.modalState,
  });

  /**
   * Modal util functions
   */
  const eraceModal = () =>
    setModalState({ ...appConfig.initialState.modalState });

  const showLoadingModal = () => {
    setModalState({
      display: true,
      type: appConfig.components.modal.type["001"],
      closeable: false,
    });
  };

  const showConfirmModal = (content = { title: "", text: "" }) => {
    setModalState({
      display: true,
      type: appConfig.components.modal.type["002"],
      closable: true,
      content: {
        title: content.title,
        text: content.text,
      },
    });
  };

  const showErrorModal = (content = { title: "", text: "" }) => {
    setModalState({
      display: true,
      type: appConfig.components.modal.type["003"],
      closable: true,
      content: {
        title: content.title,
        text: content.text,
      },
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

  const registerUnsubFunc = (funcArr) => {
    if (!Array.isArray(funcArr)) {
      throw new Error("registerUnsubFunc arg is needed to be an Array.");
    }
    setAuthState({
      ...authState,
      onSnapshot_unsubFuncArr: [
        ...authState.onSnapshot_unsubFuncArr,
        ...funcArr,
      ],
    });
  };

  // signOutFromApp();

  //ログイン状態を判定・処理
  useEffect(() => {
    //loadingエフェクトを起動
    showLoadingModal();

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

        (async () => {
          const authStateData = {
            ...user,
            onSnapshot_unsubFuncArr: [],
          };
          // AuthStateを設定
          setAuthState(authStateData);

          //authを通ったユーザーを指定
          //返り値は Object(見つかった) or null(見つからなかった)
          const isUserStateExists = authUserDoc ? true : false;
          if (isUserStateExists) {
            //既にuserDocStateが存在しているかどうか判定
            console.log("your userdata has already exist.");
            return;
          }

          // userDocをfirestore上で検索
          const fetchedAuthUserData = await getAuthUserDoc(user);

          if (fetchedAuthUserData) {
            //userDocが存在した：登録済み
            const db = getFirestore();

            //authUserのsnapShot登録 & 変更を検知したらsetAuthUserDocを自動実行
            const authUserDoc_unSubFunc = onSnapshot(
              doc(db, "users", fetchedAuthUserData.uid),
              (doc) => {
                setAuthUserDoc(...doc.data());
              }
            );
            registerUnsubFunc(authUserDoc_unSubFunc);
          } else {
            //fetchedAuthUserData == nullだった
            //初回登録へ
            console.log("you are new here.");
          }
        })();
      } else {
        // User is signed out
        console.log("you have signed out!");

        // AuthStateを更新
        setAuthState(null);

        // eraceModal();
      }

      eraceModal();
    });
  }, []);

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
        {authState ? (
          authUserDoc ? (
            /**
             * authStateが存在かつauthUserDocが取得できた
             *  >> ログイン完了、アプリ開始処理
             */
            <App
              authState={authState}
              setAuthState={setAuthState}
              signOutFromApp={signOutFromApp}
              registerUnsubFunc={registerUnsubFunc}
            />
          ) : (
            /**
             * authSStateが存在かつauthUserDocが取得できなかった
             *  >> アカウント初回登録処理
             */
            <RegisterHandler
              handleSignOut={signOutFromApp}
              handleAuthUserDoc={setAuthUserDoc}
              authState={authState}
            />
          )
        ) : (
          /**
           * authUserDocが取得できなかった
           *  >> ログイン前画面表示
           */
          <SignUp />
        )}
        <ModalHandler />
      </AppRouteContext.Provider>
    </>
  );
};

import { useState, useEffect, useContext, createContext } from "react";
import { App } from "./App";
import { SignUp } from "./components/SignUp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "./fn/auth/firebase.auth";
import { appConfig } from "./app.config";
import { ModalHandler } from "./components/ModalHandler";

export const AppModal = createContext();

export const AuthHandler = () => {
  const [authState, setAuthState] = useState(null);
  const [modalState, setModalState] = useState({
    ...appConfig.initialState.modalState,
  });
  console.log("authHandler");

  /**
   * Modal util functions
   */
  const eraceModal = () =>
    setModalState({ ...appConfig.initialState.modalState });

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
    // setModalState({
    //   display: true,
    //   closable: false,
    //   type: appConfig.components.modal.type["001"],
    //   content: null,
    // });

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
        };
        // AuthStateを更新
        setAuthState(authStateData);

        // eraceModal();
      } else {
        // User is signed out
        console.log("you have signed out!");

        // AuthStateを更新
        setAuthState(null);

        // eraceModal();
      }
    });
  }, []);

  return (
    <>
      <AppModal.Provider value={{ modalState, setModalState, eraceModal }}>
        {authState ? (
          <App
            authState={authState}
            setAuthState={setAuthState}
            signOutFromApp={signOutFromApp}
            registerUnsubFunc={registerUnsubFunc}
          />
        ) : (
          <SignUp />
        )}
      </AppModal.Provider>

      <ModalHandler state={modalState} />
    </>
  );
};

import { useState, useEffect } from "react";
import { App } from "./App";
import { SignUp } from "./components/SignUp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "./fn/auth/firebase.auth";

export const AuthHandler = () => {
  const [authState, setAuthState] = useState(null);
  console.log("authHandler");

  /**
   * execute signOut
   */
  const signOutFromApp = () => {
    // onSnapshot のリスナーを削除
    authState.onSnapshot_unsubscribe.map((func) => func());

    // sign outを実行
    signOut();
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

        console.log(user);

        // AuthStateを更新
        setAuthState(user);

        // eraceModal();
      } else {
        // User is signed out
        console.log("you have signed out!");

        // AuthStateを更新
        setAuthState(null);

        // Signed Inを表示コンテンツに指定
        // setPageContentState(appConfig.pageContents["001"]);

        // eraceModal();
      }
    });
  }, []);

  return (
    <>
      {authState ? (
        <App
          authState={authState}
          setAuthState={setAuthState}
          signOutFromApp={signOutFromApp}
        />
      ) : (
        <SignUp />
      )}
    </>
  );
};

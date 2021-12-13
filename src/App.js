// config import
import { appConfig } from "./app.config";

// lib imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

// components imports
import { SignIn } from "./components/SignUp";
import { PeopleList } from "./components/PeopleList";

// fn imports
import { getAuthUserDoc, registerAuthUserDoc } from "./fn/db/firestore.handler";
import { Modal } from "./components/Modal";

const modalConfig = appConfig.components.modal;
const modalState_defaultValue = {
  display: false,
  type: null,
  closeable: false,
  content: null
}

export const App = () => {

  /**
   * setState definitions
   */
  const [authState, setAuthState] = useState(null);
  const [userData, setUserData] = useState(null);
  const [signInState, setSignInState] = useState(false);
  const [modalState, setModalState] = useState(modalState_defaultValue);

  /**
   * reset state functions
   */
  const eraceModal = () => setModalState(modalState_defaultValue);


  /**
   * useEffect functions
   */

  //ログイン状態を判定・処理
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("you have signed in!");
        console.log(user);
        setAuthState(user);
        setSignInState(true);
        // ...
      } else {
        // User is signed out
        // ...
        console.log("you have signed out!");
        setAuthState(null);
        setSignInState(false);
      }
    });
  }, []);

  //Sign in ・ out状態の切り替えを検知
  useEffect(() => {
    // console.log(`sign in state: ${signInState}`);
    authState && (async () => {
      //loadingをつける
      setModalState({
        ...modalState,
        display: true,
        closeable: false,
        type: appConfig.components.modal.type["001"]
      });

      //authを通ったユーザーを指定
      //返り値は Object(見つかった) or null(見つからなかった)
      const user = await getAuthUserDoc(authState);

      //見つからなかったらDBに登録して改めてusedataを取得・登録
      //見つかったらそのままuserdataを登録
      user ? setUserData(user) : setUserData(await registerAuthUserDoc(authState));

      //loadingを消す
      setModalState(modalState_defaultValue);
    })()

  }, [signInState]);


  /**
   * render
   */
  return (
    <div className="App">
      {
        signInState
          ? <PeopleList user={userData} />
          : <SignIn />
      }
      <Modal state={modalState} />
    </div>
  );
}

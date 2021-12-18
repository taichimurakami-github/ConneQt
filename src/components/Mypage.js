import { useState } from "react";
import { appConfig } from "../app.config";
import { signOut } from "../fn/auth/firebase.auth";
import "../styles/mypage.scss";

import { updateUserData } from "../fn/db/firestore.handler";
import { Header } from "./UI/Header";

import { MypageConfig } from "./Mypage/config";
import { MypageTop } from "./Mypage/MyPageTop";
import { EditText } from "./Mypage/EditText";


const cmpConfig = { ...MypageConfig }

export const Mypage = (props) => {

  const [myPageState, setMyPageState] = useState(cmpConfig["001"]);

  const handleComponent = () => {

    if (myPageState.id === cmpConfig["001"].id) {
      return <MypageTop
        handleOnClick={handleOnClick}
        handleSubmit={handleSubmitToDB}
        user={props.user}
      />;
    }
    else {
      return <EditText
        config={myPageState}
        handleSubmit={handleSubmitToDB}
        handleBackToTop={showMypageTop}
      />;

    }

  }

  const showMypageTop = () => setMyPageState(cmpConfig["001"]);

  const handleOnClick = (e) => {
    let target;
    Object.keys(cmpConfig).map((val) => {
      (cmpConfig[val].id === e.target.id) && setMyPageState(cmpConfig[val]);;
    });

  }


  const handleSubmitToDB = (type, data) => {
    (async () => {
      //loading 画面を表示
      props.handleModalState({
        display: true,
        closable: false,
        type: appConfig.components.modal.type["001"],
        content: null
      });

      let updateData;

      switch (myPageState.id) {
        case cmpConfig["003"].id:
          updateData = { name: data };
          break;

        case cmpConfig["004"].id:
          updateData = { state: data };
          break;

        case cmpConfig["005"].id:
          updateData = { profile: data }
          break;
      }

      //アップデートを実行
      await updateUserData(props.authData, updateData);

      //loadingモーダルを隠す
      props.eraceModal();

      //appState: userDataを更新      
      props.fetchAndRenewUserData();

      //myPageTopに遷移
      showMypageTop();
    })();
  }

  return (
    <>
      <Header
        backable={myPageState.header.backable}
        handleBack={showMypageTop}
        title={myPageState.header.title}
      />
      {handleComponent()}
    </>
  )
}
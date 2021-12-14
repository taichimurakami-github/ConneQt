import { useState } from "react";
import { appConfig } from "../app.config";
import { signOut } from "../fn/auth/firebase.auth";
import "../styles/mypage.scss";

import { updateUserData } from "../fn/db/firestore.handler";
import { Header } from "./Header";

import { MypageConfig } from "./config/Mypage";

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


const MypageTop = (props) => {

  return (
    <div className="mypage-top-wrapper">

      <img className="user-icon" src={props.user?.photo}></img>

      <p className="name clickable" id={cmpConfig["003"].id} onClick={props.handleOnClick}>
        {props.user?.name}
      </p>

      <p className="state clickable" id={cmpConfig["004"].id} onClick={props.handleOnClick}>
        {props.user?.state}
      </p>

      <p className="profile card clickable" id={cmpConfig["005"].id} onClick={props.handleOnClick}>
        <span>プロフィールメッセージ：</span>
        {props.user?.profile}
      </p>

      <button className="btn-gray" onClick={signOut}>ログアウトする</button>
    </div>

  )
}


const EditText = (props) => {

  const [inputState, setInputState] = useState(props.nowData);


  const handleInput = (e) => {
    setInputState(e.target.value);
  }

  const handleSubmit = () => props.handleSubmit(props.type, inputState);


  return (
    <>
      <h2 className="input-target-title">{props.title}</h2>
      <input
        onChange={handleInput}
        placeholder={props.title}
        value={inputState}
        className="text-input"
      />
      <button className="btn-orange" onClick={handleSubmit}>この内容に変更する</button>
      <button className="btn-gray" onClick={props.handleBackToTop}>戻る</button>
    </>
  )
}
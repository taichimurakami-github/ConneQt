import { useState } from "react";
import { appConfig } from "../app.config";

import "../styles/mypage.scss";


import { updateUserData } from "../fn/db/firestore.handler";

import { cmpConfig } from "./Mypage/config";
import { MypageTop } from "./Mypage/MyPageTop";
import { EditText } from "./Mypage/EditText";



export const MypageHandler = (props) => {

  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  const handleComponent = () => {

    switch (viewState) {

      case cmpConfig.state.view["001"]:
        return <MypageTop
          handleViewState={setViewState}
          handleSubmit={handleSubmitToDB}
          user={props.user}
        />;

      case cmpConfig.state.view["002"]:
        return <EditText
          handleSubmit={handleSubmitToDB}
        />;

      case cmpConfig.state.view["003"]:
        return <EditText
          handleSubmit={handleSubmitToDB}
        />;

      case cmpConfig.state.view["004"]:
        return <EditText
          handleSubmit={handleSubmitToDB}
        />;

      case cmpConfig.state.view["005"]:
        return <EditText
          handleSubmit={handleSubmitToDB}
        />;

      default:
        return undefined;

    }

  }

  // const handleOnClick = (e) => {
  //   let target;
  //   Object.keys(cmpConfig).map((val) => {
  //     (cmpConfig[val].id === e.target.id) && setMyPageState(cmpConfig[val]);;
  //   });

  // }


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

      switch (viewState) {
        case cmpConfig.state.view["003"]:
          updateData = { name: data };
          break;

        case cmpConfig.state.view["004"]:
          updateData = { state: data };
          break;

        case cmpConfig.state.view["005"]:
          updateData = { profile: data }
          break;

        default:
          return;
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
      {handleComponent()}
    </>
  )
}
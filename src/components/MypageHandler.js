import { useState } from "react";
import { appConfig } from "../app.config";

import "../styles/mypage.scss";

import { updateUserData } from "../fn/db/firestore.handler";

import { cmpConfig } from "./Mypage/config";
import { MypageTop } from "./Mypage/MyPageTop";
import { EditText } from "./Mypage/EditText";
import { EditLocation } from "./Mypage/EditLocation";

export const MypageHandler = (props) => {
  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  // const handleOnClick = (e) => {
  //   let target;
  //   Object.keys(cmpConfig).map((val) => {
  //     (cmpConfig[val].id === e.target.id) && setMyPageState(cmpConfig[val]);;
  //   });

  // }

  const handleSubmitToDB = (data) => {
    (async () => {
      //loading 画面を表示
      props.handleModalState({
        display: true,
        closable: false,
        type: appConfig.components.modal.type["001"],
        content: null,
      });

      let updateData;

      switch (viewState) {
        case cmpConfig.state.view["003"]:
          updateData = { name: data };
          break;

        case cmpConfig.state.view["004"]:
          updateData = { location: data };
          break;

        case cmpConfig.state.view["005"]:
          updateData = { profile: data };
          break;

        default:
          return;
      }

      //アップデートを実行
      await updateUserData(props.authData, updateData);

      //loadingモーダルを隠す
      props.eraceModal();

      //appState: userDataを更新 >> registerUpdateHookForUsersにより自動化
      // props.fetchAndRenewUserData();

      //myPageTopに遷移
      setViewState(cmpConfig.state.view["001"]);
    })();
  };

  const handleComponent = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return (
          <MypageTop
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
            user={props.nowUserDoc}
            signOut={props.signOut}
          />
        );

      case cmpConfig.state.view["002"]:
        return (
          <EditText
            viewState={viewState}
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
          />
        );

      case cmpConfig.state.view["003"]:
        return (
          <EditText
            viewState={viewState}
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
          />
        );

      case cmpConfig.state.view["004"]:
        return (
          <EditLocation
            viewState={viewState}
            nowLocation={props.nowUserDoc.location}
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
          />
        );

      case cmpConfig.state.view["005"]:
        return (
          <EditText
            viewState={viewState}
            handleViewState={setViewState}
            handleSubmit={handleSubmitToDB}
          />
        );

      default:
        return undefined;
    }
  };

  return <>{handleComponent()}</>;
};

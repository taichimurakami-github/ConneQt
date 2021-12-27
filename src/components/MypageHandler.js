import { useContext, useState } from "react";
import { appConfig } from "../app.config";

import { updateUserData } from "../fn/db/firestore.handler";

import { AppRouteContext } from "../AppRoute";

import { cmpConfig } from "./Mypage/config";
import { MypageTop } from "./Mypage/MyPageTop";
import { EditText } from "./Mypage/EditText";
import { EditLocation } from "./Mypage/EditLocation";
import "../styles/mypage.scss";

export const MypageHandler = (props) => {
  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);
  const { modalState, setModalState, eraceModal } = useContext(AppRouteContext);

  const handleSubmitToDB = (data) => {
    (async () => {
      //loading 画面を表示
      setModalState({
        display: true,
        closable: false,
        type: appConfig.components.modal.type["001"],
        content: null,
      });

      let updateData;

      switch (viewState) {
        case cmpConfig.state.view["003"]:
          updateData = { uid: props.nowUserDoc.uid, name: data };
          break;

        case cmpConfig.state.view["004"]:
          updateData = { uid: props.nowUserDoc.uid, location: data };
          break;

        case cmpConfig.state.view["005"]:
          updateData = { uid: props.nowUserDoc.uid, profile: data };
          break;

        default:
          return;
      }

      //アップデートを実行
      await updateUserData(updateData);

      //loadingモーダルを隠す
      eraceModal();

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
            inputMode="textarea"
          />
        );

      default:
        return undefined;
    }
  };

  return <>{handleComponent()}</>;
};
